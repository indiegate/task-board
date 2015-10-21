import * as BoardReducer from './boardReducer';
import * as ActionTypes from '../constants/actionTypes';

export default (reduction, action) => {
  const { type, payload } = action;

  console.debug(`Handling action: ${type}`);

  // mutate the global appState here
  return reduction.withMutations(mutableReduction => {
    switch (type) {
    case ActionTypes.BOARD_MOUNTED:
      mutableReduction.update(_r => BoardReducer.startSync(_r, payload));
      break;
    case ActionTypes.LAYOUT_RECEIVED_OK:
      mutableReduction.update(_r => BoardReducer.layoutReceivedOk(_r, payload));
      break;
    case ActionTypes.FIREBASE_TASKS_RECEIVED:
      mutableReduction.update(_r => BoardReducer.tasksReceived(_r, payload));
      break;
    case ActionTypes.ADD_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.addTaskClicked(_r, payload));
      break;
    case ActionTypes.EDIT_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.editTaskClicked(_r, payload));
      break;
    case ActionTypes.SAVE_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.saveTaskClicked(_r, payload));
      break;
    case ActionTypes.FIREBASE_TASK_CREATED_OK:
    case ActionTypes.FIREBASE_TASK_UPDATED_OK:
    case ActionTypes.CANCEL_SAVE_TASK_CLICKED:
    case ActionTypes.FIREBASE_TASK_ARCHIVED_OK:
      mutableReduction.update(_r => BoardReducer.cancelSaveTaskClicked(_r, payload));
      break;
    case ActionTypes.ARCHIVE_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.archiveTaskClicked(_r, payload));
      break;
    case ActionTypes.DRAGGED_TASK_TO_SECTION:
      mutableReduction.update(_r => BoardReducer.draggedTaskToSection(_r, payload));
      break;
    default:
      console.debug(`Unhandled action of type: ${type}`);
    }
  });
};
