import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

export const FirebaseService = {
  _ref: null,

  _handleError(error, dispatcher) {
    if (error.code === 'PERMISSION_DENIED') {
      dispatcher.dispatch({
        type: ActionTypes.AUTHENTICATION_FAILED,
        payload: error,
      });
    }
  },

  createTask(dispatcher, task) {
    this._ref
      .child('tasks')
      .push()
      .set({
        sectionId: task.sectionId,
        content: task.content,
      }, (err) => {
        if (!err) {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASK_CREATED_OK,
            payload: null,
          });
        }
      });
  },

  updateTask(dispatcher, {id, sectionId, content}) {
    this._ref
      .child(`tasks/${id}`)
      .set({
        sectionId,
        content,
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

  start(dispatcher) {
    // move this to a localStorage adapter
    const firebaseId = localStorage.getItem('task-board:firebaseId');

    if (!firebaseId ) {
      setTimeout(() => {
        dispatcher.dispatch({
          type: ActionTypes.AUTHENTICATION_FAILED,
          payload: {
            code: 'FIREBASE_ID_NOT_IN_LS',
            message: 'Firebase id not present locally',
          },
        });
      }, 1);
      return;
    }

    this._ref = new Firebase(`https://${firebaseId}.firebaseio.com/`);

    this._ref
      .child('layout')
      .once('value', layoutSnapshot => {
        this._ref
          .child('tasks')
          .on('value', tasksSnapshot => {
            setTimeout(() => {
              dispatcher.dispatch({
                type: ActionTypes.FIREBASE_TASKS_RECEIVED,
                payload: tasksSnapshot.val(),
              });
            }, 1);
          }, tasksError => this._handleError(tasksError, dispatcher));

        setTimeout(() => {
          dispatcher.dispatch({
            type: ActionTypes.LAYOUT_RECEIVED_OK,
            payload: layoutSnapshot.val(),
          });
        }, 1);
      }, layoutError => this._handleError(layoutError, dispatcher));
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

    this._ref = new Firebase(`https://${firebaseId}.firebaseio.com/`);

    this._ref.authWithPassword({
      email: `developer@${firebaseId}.com`,
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
          payload: authData,
        });
      }
    });
  },
};


