import { fromJS } from 'immutable';

import buildMessage from '../utils/buildMessage';

export const layoutFetchRequested = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'loading'], true)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage('FETCH_LAYOUT_API_CALL', payload)
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
