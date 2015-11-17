const comparePriorities = (taskA, taskB) => {
  if (typeof taskA.priority === 'undefined' && typeof taskB.priority !== 'undefined') {
    return 1;
  }

  if (typeof taskA.priority !== 'undefined' && typeof taskB.priority === 'undefined') {
    return -1;
  }

  if (taskA.priority < taskB.priority ) {
    return 1;
  }

  if (taskA.priority > taskB.priority) {
    return -1;
  }

  return 0;
};

const compareStories = (taskA, taskB) => {
  if (typeof taskA.story === 'undefined' && typeof taskB.story !== 'undefined') {
    return 1;
  }

  if (typeof taskA.story !== 'undefined' && typeof taskB.story === 'undefined') {
    return -1;
  }

  if (taskA.story < taskB.story ) {
    return -1;
  }

  if (taskA.story > taskB.story) {
    return 1;
  }

  return 0;
};

const compareTaskIDs = (taskA, taskB) => {
  if (typeof taskA.id === 'undefined' && typeof taskB.id !== 'undefined') {
    return -1;
  }

  if (typeof taskA.id !== 'undefined' && typeof taskB.id === 'undefined') {
    return 1;
  }

  if (taskA.id < taskB.id ) {
    return -1;
  }

  if (taskA.id > taskB.id) {
    return 1;
  }

  return 0;
};

export const sortTasks = (tasks) => {
  return tasks.sort((taskA, taskB) => {
    const comparedStories = compareStories(taskA, taskB);
    if (comparedStories !== 0) {
      return comparedStories; // -1 or 1
    }

    const comparedPriorities = comparePriorities(taskA, taskB);
    if (comparedPriorities !== 0 ) {
      return comparedPriorities;
    }

    return compareTaskIDs(taskA, taskB);
  });
};
