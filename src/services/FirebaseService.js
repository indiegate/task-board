import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

const layoutReceived = payload => ({type: ActionTypes.LAYOUT_RECEIVED_OK, payload});

const storiesReceived = payload => ({type: ActionTypes.FIREBASE_STORIES_RECEIVED, payload});

const tasksReceived = payload => ({type: ActionTypes.FIREBASE_TASKS_RECEIVED, payload});

const authFailed = payload => ({type: ActionTypes.AUTHENTICATION_FAILED, payload});

const deferDispatch = dispatcher => action => setTimeout(() => dispatcher.dispatch(action), 1);

export const FirebaseService = {
  _ref: null,

  _handleError(error, dispatcher) {
    if (error.code === 'PERMISSION_DENIED') {
      dispatcher.dispatch(authFailed(error));
    }
    // TODO handle layout, stories, tasks errors
  },

  createTask(dispatcher, task) {
    this._ref
      .child('tasks')
      .push()
      .set({
        sectionId: task.sectionId,
        content: task.content,
        story: task.story,
        createdTs: Date.now(),
        priority: task.priority,
      }, (err) => {
        if (!err) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASK_CREATED_OK,
            payload: null,
          });
        }
      });
  },

  updateTask(dispatcher, {id, sectionId, content, story = null, priority = null}) {
    this._ref
      .child(`tasks/${id}`)
      .set({
        sectionId,
        content,
        story,
        priority,
      }, (err) => {
        if (!err) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASK_UPDATED_OK,
            payload: null,
          });
        }
      });
  },

  archiveTask({id, sectionId, content}) {
    return new Promise((resolve, reject) => {
      this._ref
        .child(`tasks/${id}`)
        .set(null, (removeError) => {
          if (!removeError) {
            this._ref
              .child('archivedTasks')
              .push()
              .set({
                sectionId,
                content,
              }, (archiveError) => {
                if (!archiveError) {
                  resolve();
                } else {
                  reject(archiveError);
                }
              });
          } else {
            reject(removeError);
          }
        });
    });
  },

  createStory(dispatcher, {id, title}) {
    this._ref
      .child(`stories`)
      .transaction((object) => {
        const currentStories = (object) ? object : {};
        let color = 0;
        if (currentStories) {
          const colorDict = {};
          Object.keys(currentStories).forEach((key) => {
            const currentStory = currentStories[key];
            if (currentStory.color !== undefined) {
              colorDict[currentStory.color] = true;
            }
          });
          while (color in colorDict) {
            color++;
          }
        }
        if (!(id in currentStories)) {
          currentStories[id] = {title, color};
          return currentStories;
        }
        return undefined;
      }, (error, committed) => {
        if (!error && committed) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_STORY_CREATED_OK,
            payload: null,
          });
        }
      });
  },

  updateStory(dispatcher, {id, title}) {
    this._ref
      .child(`stories/${id}/title`)
      .set(title, (err) => {
        if (!err) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_STORY_UPDATED_OK,
            payload: null,
          });
        }
      });
  },

  removeStory(dispatcher, {id}) {
    this._ref
      .child(`stories/${id}`)
      .set(null, (err) => {
        if (!err) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_STORY_REMOVED_OK,
            payload: null,
          });
        }
      });
  },

  start(dispatcher, {firebaseId}) {
    const deferredDispatch = deferDispatch(dispatcher);

    if (!firebaseId ) {
      const payload = {
        code: 'FIREBASE_ID_NOT_IN_LS',
        message: 'Firebase id not present locally',
      };
      deferredDispatch(authFailed(payload));
      return;
    }

    this._ref = new Firebase(`https://${firebaseId}.firebaseio.com/`);

    this._ref
      .child('layout')
      .on('value', layoutSnapshot => deferredDispatch(layoutReceived(layoutSnapshot.val())),
        layoutError => this._handleError(layoutError, dispatcher));

    this._ref
      .child('stories')
      .on('value', storiesSnapshot => {
        deferredDispatch(storiesReceived(storiesSnapshot.val() ? storiesSnapshot.val() : []));
      }, storiesError => this._handleError(storiesError, dispatcher));

    this._ref
      .child('tasks')
      .on('value', tasksSnapshot => deferredDispatch(tasksReceived(tasksSnapshot.val())),
        tasksError => this._handleError(tasksError, dispatcher));
  },

  authenticate(dispatcher, {firebaseId, password}) {
    if (!firebaseId) {
      setTimeout(() => {
        dispatcher.dispatch({
          type: ActionTypes.AUTHENTICATION_FAILED,
          payload: {
            code: 'INVALID_FIREBASE_ID',
            message: 'Invalid firebase id',
          },
        });
      }, 1);
      return;
    }

    // TODO make email/username configurable
    const email = `developer@${firebaseId}.com`;
    this._ref = new Firebase(`https://${firebaseId}.firebaseio.com/`);

    this._ref.authWithPassword({
      email,
      password,
    }, (error, authData) => {
      if (error) {
        dispatcher.dispatch({
          type: ActionTypes.AUTHENTICATION_FAILED,
          payload: error,
        });
      } else {
        dispatcher.dispatch({
          type: ActionTypes.AUTHENTICATION_OK,
          payload: {
            authData,
            firebaseId,
          },
        });
      }
    });
  },

  unauthenticate() {
    this._ref.unauth();
  },
};


