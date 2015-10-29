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

export const startSync = (reduction, payload) => {
  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.SYNC_START_REQUESTED, payload)
    ));
};

export const tasksReceived = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();
  const tasksArray = [];
  const groupsDict = {};
  let group = 0;
  const storyRegExp = new RegExp('\\[.*]');
  // put tasks into initialLayout
  Object.keys(payload).forEach(key => {
    const task = payload[key];
    task.id = key;
    const story = storyRegExp.exec(task.content);
    if (story) {
      task.story = story[0];
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

export const loginSubmitted = (reduction, payload) => {
  localStorage.setItem('task-board:firebaseId', payload.firebaseId);
  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.AUTHENTICATION_REQUESTED, payload)
    ));
};

export const authenticationOk = (reduction, payload) => {
  localStorage.setItem('task-board:token', payload.token);
  return reduction
    .setIn(['appState', 'isLoggedIn'], true)
    .setIn(['appState', 'authData'], payload);
};

export const authenticationFailed = (reduction, payload) => {
  // SIDE EFFECT!
  const firebaseId = localStorage.getItem('task-board:firebaseId');
  const newPayload = Object.assign({}, payload);

  if (firebaseId && !localStorage.getItem(`firebase:session::${firebaseId}`)
    && payload.code !== 'AUTHENTICATION_DISABLED') {
    newPayload.message = 'Session expired';
  } else {
    newPayload.message = payload.message;
  }

  localStorage.removeItem('task-board:token');
  localStorage.removeItem('task-board:firebaseId');

  return reduction
    .setIn(['appState', 'isLoggedIn'], false)
    .setIn(['appState', 'authData'], null)
    .setIn(['appState', 'authError'], newPayload);
};
