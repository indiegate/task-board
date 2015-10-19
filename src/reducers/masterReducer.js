import * as BoardReducer from './boardReducer';
import * as FirebaseReducer from './firebaseReducer';
import * as ActionTypes from '../constants/actionTypes';

export default (reduction, action) => {
  const { type, payload } = action;

  console.debug(`Handling action: ${type}`);

  // mutate the global appState here
  return reduction.withMutations(mutableReduction => {
    switch (type) {
    case ActionTypes.BOARD_MOUNTED:
      mutableReduction.update(_r => BoardReducer.layoutFetchRequested(_r, payload));
      break;
    case ActionTypes.LAYOUT_FETCHED_OK:
      mutableReduction.update(_r => BoardReducer.layoutFetched(_r, payload));
      break;
    case ActionTypes.FIREBASE_TASKS_RECEIVED:
      mutableReduction.update(_r => FirebaseReducer.tasksReceived(_r, payload));
      break;
    case ActionTypes.ADD_TASK_CLICKED:
    case ActionTypes.EDIT_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.saveTaskClicked(_r, payload));
      break;
    case ActionTypes.CANCEL_SAVE_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.cancelSaveTaskClicked(_r, payload));
      break;
    case ActionTypes.ARCHIVE_TASK_CLICKED:
      mutableReduction.update(_r => BoardReducer.archiveTaskClicked(_r, payload));
      break;
    case ActionTypes.FIREBASE_SAVE_TASK_REQUESTED:
      mutableReduction.update(_r => FirebaseReducer.saveTaskRequested(_r, payload));
      break;
    case ActionTypes.TASK_SECTION_UPDATED:
      mutableReduction.update(_r => FirebaseReducer.updateTaskSection(_r, payload));
      break;
    default:
      console.debug(`Unhandled action of type: ${type}`);
    }
  });
};
