import { Map as createMap } from 'immutable';
import { FirebaseService } from '../services/FirebaseService';
import * as APIService from '../services/APIService';
import * as ActionTypes from '../constants/actionTypes';

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
        dispatcher.dispatch({
          type: 'FIREBASE_TASK_ARCHIVED_OK',
          payload: null,
        });
      }, (err) => {
        dispatcher.dispatch({
          type: ActionTypes.FIREBASE_TASK_ARCHIVE_FAILED,
          payload: err,
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
