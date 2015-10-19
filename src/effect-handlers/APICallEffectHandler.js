import Firebase from 'firebase';
import { Map as createMap } from 'immutable';
import * as APIService from '../services/APIService';
import * as ActionTypes from '../constants/actionTypes';


const FirebaseService = {
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
            type: 'FIREBASE_TASK_CREATED_OK',
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
            type: 'FIREBASE_TASK_UPDATED_OK',
            payload: null,
          });
        }
      });
  },
  archiveTask(task) {
    return new Promise((resolve, reject) => {
      this._ref
        .child('teams/fwk-int/archived-tasks/')
        .push()
        .set({
          sectionId: task.sectionId,
          content: task.content,
        }, (err) => {
          if (!err) {
            resolve();
          } else {
            reject();
          }
        });
    });
  },
  updateTasks(tasks) {
    const updatedTasks = {};

    tasks.forEach(task => {
      updatedTasks[task.id] = {
        content: task.content,
        sectionId: task.sectionId,
      };
    });

    return new Promise((resolve, reject) => {
      this._ref
        .child('teams/fwk-int/tasks/')
        .set(updatedTasks, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
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

const buildEffectHandler = (handlers) => {
  return (dispatcher, effect) => {
    createMap(handlers)
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(dispatcher, effect.payload));
  };
};

export default buildEffectHandler({
  [ActionTypes.FETCH_LAYOUT_API_CALL]: (dispatcher, payload) => {
    APIService.fetchLayout(payload).then(layout => {
      dispatcher.dispatch({
        type: ActionTypes.LAYOUT_FETCHED_OK,
        payload: layout,
      });
    });
  },

  [ActionTypes.FIREBASE_ARCHIVE_TASK_REQUESTED]: (dispatcher, payload) => {
    FirebaseService
      .archiveTask(payload.task)
      .then(() => {
        FirebaseService.updateTasks(payload.tasks).then((result) => {
          dispatcher.dispatch({
            type: 'FIREBASE_TASK_ARCHIVED_OK',
            payload: result,
          });
        }, err => {
          dispatcher.dispatch({
            type: ActionTypes.FIREBASE_TASK_ARCHIVE_FAILED,
            payload: err,
          });
        });
      });
  },

  'FIREBASE_START_LISTENING': (dispatcher, payload) => {
    console.log('FIREBASE_START_LISTENING', payload);
    FirebaseService.start(dispatcher);
  },

  'FIREBASE_SAVE_TASK': (dispatcher, payload) => {
    if (!payload.id ) {
      FirebaseService.createTask(payload);
    } else {
      FirebaseService.updateTask(payload);
    }
  },

  'FIREBASE_UPDATE_TASK': (dispatcher, payload) => {
    FirebaseService.updateTask(payload);
  },
});
