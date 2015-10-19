import { fromJS } from 'immutable';

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
    .setIn(['appState', 'tasks'], tasksArray)
    .setIn(['appState', 'updatedTask'], null);
};

// TODO change name to something more meaninging full...
export const saveTaskRequested = (reduction, payload) => {
  if (!payload) {
    return reduction
      .setIn(['appState', 'task'], null);
  }
};

export const updateTaskSection = (reduction, payload) => {
  const foundTask = reduction
    .getIn(['appState', 'tasks'])
    .filter(task => task.id === payload.id)[0];

  const updatedTask = {
    ...payload,
    id: foundTask.id,
  };

  return reduction
    .setIn(['appState', 'updatedTask'], updatedTask);
};
