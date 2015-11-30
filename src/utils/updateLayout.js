export default function(layout, task) {
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
      updateBoardSection(item);
    }
  };
  return layout.columns.forEach(column => updateBox(column));
}
