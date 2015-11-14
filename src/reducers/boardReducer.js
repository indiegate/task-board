import { fromJS } from 'immutable';
import * as EffectTypes from '../constants/effectTypes';
import buildMessage from '../utils/buildMessage';

const updateLayout = (layout, task) => {
  const updateBoardSection = (section) => {
    if (section.id === task.sectionId) {
      section.tasks = section.tasks || [];
      section.tasks.push(task);
    }
    return section;
  };

  const updateBox = (item) => {
    if (item.columns) {
      item.columns = item.columns.map(column => {
        if (column.id) {
          return updateBoardSection(column);
        }
        return updateBox(column);
      });
    } else if (item.rows) {
      item.rows = item.rows.map(row => {
        if (row.id) {
          return updateBoardSection(row);
        }
        return updateBox(row);
      });
    } else if (item.id) {
      return updateBoardSection(item);
    }
    return item;
  };

  return layout.columns.map(column => {
    return updateBox(column);
  });
};

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
  const tasksArray = [];
  const groupsDict = {};
  let group = 0;
  // put tasks into initialLayout
  Object.keys(payload).forEach(key => {
    const task = payload[key];
    task.id = key;
    if (task.story) {
      const num = groupsDict[task.story];
      if (num) {
        task.storyGroup = num;
      } else {
        group++;
        groupsDict[task.story] = group;
        task.storyGroup = group;
      }
    }
    updateLayout(layout, task);
    tasksArray.push(task);
  });
  return reduction
    .setIn(['appState', 'layout'], fromJS(layout))
    .setIn(['appState', 'tasks'], tasksArray);
};

export const storiesReceived = (reduction, payload) => {
  const storiesArray = [];
  Object.keys(payload).forEach(key => {
    const story = payload[key];
    story.id = key;
    storiesArray.push(story);
  });
  return reduction
    .setIn(['appState', 'stories'], storiesArray);
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

export const addStoryClicked = (reduction) => {
  return reduction
    .setIn(['appState', 'story'], {});
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
