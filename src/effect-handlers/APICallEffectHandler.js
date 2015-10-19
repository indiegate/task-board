import { Map as createMap } from 'immutable';
import * as APIService from '../services/APIService';
import * as ActionTypes from '../constants/actionTypes';

const FirebaseService = {
  _ref: null,
  archiveTask(task) {
    // get archivedTasks ref
    // push task to the archivedTasks
    console.log('task for archive: ', task);
    return Promise.resolve();
  },
  updateTasks(tasks) {
    return new Promise((resolve) => {
      // get ref to tasks
      // push updated tasks
      resolve(tasks);
    });
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
            type: 'UPDATE_TASKS_REQUESTED',
            payload: result,
          });
        });
      });
  },
});
