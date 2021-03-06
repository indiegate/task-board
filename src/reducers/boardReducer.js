import { fromJS, Map as map } from 'immutable';
import * as EffectTypes from '../constants/effectTypes';
import buildMessage from '../utils/buildMessage';
import updateLayout from '../utils/updateLayout';

export const startSync = (reduction) => {
  const firebaseId = reduction.getIn(['appState', 'firebaseId']);

  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.SYNC_START_REQUESTED, {
        firebaseId,
      })
    ));
};

export const tasksReceived = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();
  const stories = reduction.getIn(['appState', 'stories']);
  const selectedStory = reduction.getIn(['appState', 'selectedStory']);
  const tasks = map(payload).map((value, key) => {
    value.id = key;
    if (value.story) {
      const story = stories.filter(s => s.id === value.story)[0];
      if (story) {
        value.storyGroup = story.color;
      }
    }
    return value;
  }).toArray();
  const predicateFn = selectedStory ? task => task.story === selectedStory : () => true;
  // TODO refactor this side-effect
  tasks
    .filter(predicateFn)
    .forEach(task => updateLayout(layout, task));

  return reduction
    .setIn(['appState', 'layout'], fromJS(layout))
    .setIn(['appState', 'tasks'], tasks);
};

export const layoutReceivedOk = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'initialLayout'], fromJS(payload));
};

export const addTaskClicked = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'task'], {sectionId: payload.sectionId});
};

export const editTaskClicked = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'task'], payload);
};

export const saveTaskClicked = (reduction, payload) => {
  reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.TASK_SAVE_REQUESTED, payload)
    ));
};

export const cancelSaveTaskClicked = (reduction) => {
  return reduction
    .setIn(['appState', 'task'], null);
};

export const draggedTaskToSection = (reduction, payload) => {
  const foundTask = reduction
    .getIn(['appState', 'tasks'])
    .filter(task => task.id === payload.id)[0];

  const updatedTask = {
    ...payload,
    id: foundTask.id,
  };

  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.TASK_UPDATE_REQUESTED, updatedTask)
    ));
};

export const archiveTaskClicked = (reduction, payload) => {
  return reduction
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(EffectTypes.TASK_ARCHIVING_REQUESTED, payload)
      ));
};

export const loginSubmitted = (reduction, {firebaseId, password }) => {
  const requestFirebaseId = firebaseId ? firebaseId : reduction.getIn(['appState', 'firebaseId']);

  return reduction
    .setIn(['appState', 'isAuthenticating'], true)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.AUTHENTICATION_REQUESTED, {
        firebaseId: requestFirebaseId,
        password,
      })
    ));
};

export const authenticationOk = (reduction, {authData, firebaseId}) => {
  // SIDE EFFECT
  localStorage.setItem('task-board:firebaseId', firebaseId);

  return reduction
    .setIn(['appState', 'firebaseId'], firebaseId)
    .setIn(['appState', 'isAuthenticating'], false)
    .setIn(['appState', 'isLoggedIn'], true)
    .setIn(['appState', 'authData'], authData);
};

export const authenticationFailed = (reduction, payload) => {
  // SIDE EFFECT!
  const newPayload = Object.assign({}, payload);

  if (payload.code === 'PERMISSION_DENIED') {
    // TODO handle properly firebase.ref.off();
    // this case happens after un-auth when connection to firebase still persists.
    if (!reduction.getIn(['appState', 'isLoggedIn'])) {
      return null;
    }
    // #1 SESSION EXPIRED === 'PERMISSION_DENIED'
    newPayload.message = 'Session expired';
  } else {
    // #2 payload.code === "INVALID_FIREBASE"
    if (payload.code === 'INVALID_FIREBASE') {
      localStorage.removeItem('task-board:firebaseId');
    }
    // #3 WRONG USERNAME / FOR NOW IGNORED
    // #4 payload.code === "INVALID_PASSWORD"
    newPayload.message = payload.message;
  }

  return reduction
    .setIn(['appState', 'isAuthenticating'], false)
    .setIn(['appState', 'isLoggedIn'], false)
    .setIn(['appState', 'authData'], null)
    .setIn(['appState', 'authError'], newPayload);
};

export const logout = (reduction, payload) => {
  localStorage.removeItem('task-board:firebaseId');

  return reduction
    .setIn(['appState', 'initialLayout'], null)
    .setIn(['appState', 'layout'], null)
    .setIn(['appState', 'firebaseId'], null)
    .setIn(['appState', 'isAuthenticating'], false)
    .setIn(['appState', 'isLoggedIn'], false)
    .setIn(['appState', 'authData'], null)
    .setIn(['appState', 'showFirebaseIdInput'], true)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.UNAUTHENTICATION_REQUESTED, payload)
      ));
};
