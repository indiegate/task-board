import { fromJS } from 'immutable';
import * as ActionTypes from '../constants/actionTypes';
import buildMessage from '../utils/buildMessage';

export const layoutFetchRequested = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'loading'], true)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(ActionTypes.FETCH_LAYOUT_API_CALL, payload)
    ));
};

export const layoutFetched = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'initialLayout'], fromJS(payload));
};


export const saveTaskClicked = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'task'], payload);
};

export const cancelSaveTaskClicked = (reduction) => {
  return reduction
    .setIn(['appState', 'task'], null);
};

export const archiveTaskClicked = (reduction, payload) => {
  const tasks = reduction.getIn(['appState', 'tasks'])
      .filter(task => task.id !== payload.id);

  return reduction
      .set('effects', reduction
          .get('effects')
          .push(buildMessage(ActionTypes.FIREBASE_ARCHIVE_TASK_REQUESTED, {task: payload, tasks})
      ));
};
