import { fromJS } from 'immutable';

const updateLayout = (layout, task) => {
  const isPresent = (tasks, innerTask) => {
    for (let idx = 0; idx < tasks.length; idx++) {
      if (tasks[idx].content === innerTask.content) {
        return true;
      }
    }
    return false;
  };

  const updateRow = (row) => {
    if (row.id === task.sectionId) {
      row.tasks = row.tasks || [];
      if (!isPresent(row.tasks, task)) {
        row.tasks.push(task);
      }
    }
    return row;
  };

  const updateColumn = (column) => {
    if (column.rows) {
      column.rows = column.rows.map(row => {
        return updateRow(row);
      });
    }
    return column;
  };

  return layout.columns.map(column => {
    return updateColumn(column);
  });
};


export const tasksReceived = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'layout']).toJS();

  Object.keys(payload).forEach(key => {
    updateLayout(layout, payload[key]);
  });

  layout.updated = true;
  return reduction.setIn(['appState', 'layout'], fromJS(layout));
};
