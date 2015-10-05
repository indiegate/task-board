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
    }
    return item;
  };

  return layout.columns.map(column => {
    return updateBox(column);
  });
};

export const tasksReceived = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();

  // put tasks into initialLayout
  Object.keys(payload).forEach(key => {
    updateLayout(layout, payload[key]);
  });

  return reduction
    .setIn(['appState', 'layout'], fromJS(layout));
};
