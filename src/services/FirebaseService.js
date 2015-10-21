import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

export const FirebaseService = {
  _ref: null,
  _dispatcher: null,

  createTask(task) {
    this._ref
      .child('tasks')
      .push()
      .set({
        sectionId: task.sectionId,
        content: task.content,
      }, (err) => {
        if (!err) {
          this._dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASK_CREATED_OK,
            payload: null,
          });
        }
      });
  },

  updateTask({id, sectionId, content}) {
    this._ref
      .child(`tasks/${id}`)
      .set({
        sectionId,
        content,
      }, (err) => {
        if (!err) {
          this._dispatcher.dispatch({
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
    this._ref = new Firebase(`https://${FIREBASE_ID}.firebaseio.com/`);
    this._dispatcher = dispatcher;

    this._ref
      .on('value', snapshot => {
        const { layout, tasks } = snapshot.val();

        if (layout) {
          setTimeout(() => {
            this._dispatcher.dispatch({
              type: ActionTypes.LAYOUT_RECEIVED_OK,
              payload: layout,
            });
          }, 1);
        }

        if (tasks) {
          setTimeout(() => {
            this._dispatcher.dispatch({
              type: ActionTypes.FIREBASE_TASKS_RECEIVED,
              payload: tasks,
            });
          }, 1);
        }
      });
  },

  stop() {
    this._ref = null;
    this._dispatcher = null;
  },
};


