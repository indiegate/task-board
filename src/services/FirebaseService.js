import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

export const FirebaseService = {
  _ref: null,
  _dispatcher: null,

  createTask(task) {
    this._ref
      .child('teams/fwk-int/tasks/')
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
      .child('teams/fwk-int/tasks/')
      .child(id)
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
  archiveTask(task) {
    return new Promise((resolve, reject) => {
      this._ref
        .child('teams/fwk-int/tasks/')
        .child(task.id)
        .set(null, (removeError) => {
          if (!removeError) {
            this._ref
              .child('teams/fwk-int/archivedTasks/')
              .push()
              .set({
                sectionId: task.sectionId,
                content: task.content,
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
      .child('teams/fwk-int/tasks/')
      .on('value', snapshot => {
        setTimeout(() => {
          this._dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASKS_RECEIVED,
            payload: snapshot.val(),
          });
        }, 1);
      });
  },

  stop() {
    this._ref = null;
    this._dispatcher = null;
  },
};


