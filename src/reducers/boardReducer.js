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
    .setIn(['appState', 'firebaseRef'], payload)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.SYNC_START_REQUESTED, payload)
      ));
};

export const tasksReceived = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();
  const tasksArray = [];
  // put tasks into initialLayout
  Object.keys(payload).forEach(key => {
    const task = payload[key];
    task.id = key;
    updateLayout(layout, task);
    tasksArray.push(task);
  });

  return reduction
    .setIn(['appState', 'layout'], fromJS(layout))
    .setIn(['appState', 'tasks'], tasksArray);
};

export const layoutFetchRequested = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'loading'], true)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.LAYOUT_REQUESTED, payload)
    ));
};

export const layoutFetched = (reduction, payload) => {
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
