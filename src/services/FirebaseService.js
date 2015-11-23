import Firebase from 'firebase';
import * as FirebaseActions from '../actions/FirebaseActions';

const deferDispatch = dispatcher => action => setTimeout(() => dispatcher.dispatch(action), 1);

export const FirebaseService = {
  _ref: null,

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
          dispatcher.dispatch(FirebaseActions.taskCreated());
        } // TODO handle task create fail
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
          dispatcher.dispatch(FirebaseActions.taskUpdated());
        } // TODO handle task update fail
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
          dispatcher.dispatch(FirebaseActions.storyCreated());
        } // TODO handle story create fail
      });
  },

  updateStory(dispatcher, {id, title}) {
    this._ref
      .child(`stories/${id}/title`)
      .set(title, (err) => {
        if (!err) {
          dispatcher.dispatch(FirebaseActions.storyUpdated());
        } // TODO handle story update fail
      });
  },

  removeStory(dispatcher, {id}) {
    this._ref
      .child(`stories/${id}`)
      .set(null, (err) => {
        if (!err) {
          dispatcher.dispatch(FirebaseActions.storyRemoved());
        } // TODO handle story removal fail
      });
  },

  start(dispatcher, {firebaseId}) {
    const deferredDispatch = deferDispatch(dispatcher);
    const dispatch = dispatcher.dispatch;

    if (!firebaseId ) {
      deferredDispatch(FirebaseActions.authFailed({
        code: 'FIREBASE_ID_NOT_IN_LS',
        message: 'Firebase id not present locally',
      }));
      return;
    }

    this._ref = new Firebase(`https://${firebaseId}.firebaseio.com/`);

    this._ref
      .child('layout')
      .on('value', layoutSnapshot => deferredDispatch(FirebaseActions.layoutReceived(layoutSnapshot.val())),
        layoutError => dispatch(FirebaseActions.syncFailed(layoutError)));

    this._ref
      .child('stories')
      .on('value', storiesSnapshot => {
        deferredDispatch(FirebaseActions.storiesReceived(storiesSnapshot.val() ? storiesSnapshot.val() : []));
      }, storiesError => dispatch(FirebaseActions.syncFailed(storiesError)));

    this._ref
      .child('tasks')
      .on('value', tasksSnapshot => deferredDispatch(FirebaseActions.tasksReceived(tasksSnapshot.val())),
        tasksError => dispatch(FirebaseActions.syncFailed(tasksError)));
  },

  authenticate(dispatcher, {firebaseId, password}) {
    const deferredDispatch = deferDispatch(dispatcher);

    if (!firebaseId) {
      deferredDispatch(FirebaseActions.authFailed({
        code: 'INVALID_FIREBASE_ID',
        message: 'Invalid firebase id',
      }));
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
        deferredDispatch(FirebaseActions.authFailed(error));
      } else {
        dispatcher.dispatch(FirebaseActions.authSuccess({authData, firebaseId}));
      }
    });
  },

  unauthenticate() {
    this._ref.unauth();
  },
};


