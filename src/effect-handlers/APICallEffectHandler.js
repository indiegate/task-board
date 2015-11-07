import { Map as createMap } from 'immutable';
import { FirebaseService } from '../services/FirebaseService';
import * as ActionTypes from '../constants/actionTypes';
import * as EffectTypes from '../constants/effectTypes';

const buildEffectHandler = (handlers) => {
  return (dispatcher, effect) => {
    createMap(handlers)
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(dispatcher, effect.payload));
  };
};

export default buildEffectHandler({
  [EffectTypes.TASK_ARCHIVING_REQUESTED]: (dispatcher, task) => {
    FirebaseService
      .archiveTask(task)
      .then(() => {
        dispatcher.dispatch({
          type: ActionTypes.FIREBASE_TASK_ARCHIVED_OK,
          payload: null,
        });
      }, (err) => {
        dispatcher.dispatch({
          type: ActionTypes.FIREBASE_TASK_ARCHIVE_FAILED,
          payload: err,
        });
      });
  },

  [EffectTypes.SYNC_START_REQUESTED]: (dispatcher, payload) => {
    FirebaseService.start(dispatcher, payload);
  },

  [EffectTypes.TASK_SAVE_REQUESTED]: (dispatcher, payload) => {
    if (!payload.id ) {
      FirebaseService.createTask(dispatcher, payload);
    } else {
      FirebaseService.updateTask(dispatcher, payload);
    }
  },

  [EffectTypes.TASK_UPDATE_REQUESTED]: (dispatcher, payload) => {
    FirebaseService.updateTask(dispatcher, payload);
  },

  [EffectTypes.AUTHENTICATION_REQUESTED]: (dispatcher, payload) => {
    FirebaseService.authenticate(dispatcher, payload);
  },
});
