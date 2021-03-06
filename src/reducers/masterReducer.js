import * as BoardReducer from './boardReducer';
import * as StoryReducer from './storyReducer';
import * as ActionTypes from '../constants/actionTypes';

export default (reduction, action) => {
  const { type, payload } = action;

  console.debug(`Handling action: ${type}`);

  // mutate the global appState here
  return reduction.withMutations(mutableReduction => {
    switch (type) {
    case ActionTypes.LOGIN_SUBMITTED:
      mutableReduction.update(_r => BoardReducer.loginSubmitted(_r, payload));
      break;
    case ActionTypes.BOARD_MOUNTED:
      mutableReduction.update(_r => BoardReducer.startSync(_r));
      break;
    case ActionTypes.LAYOUT_RECEIVED_OK:
      mutableReduction.update(_r => BoardReducer.layoutReceivedOk(_r, payload));
      break;
    case ActionTypes.FIREBASE_TASKS_RECEIVED:
      mutableReduction.update(_r => BoardReducer.tasksReceived(_r, payload));
      break;
    case ActionTypes.FIREBASE_STORIES_RECEIVED:
      mutableReduction.update(_r => StoryReducer.storiesReceived(_r, payload));
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
    case ActionTypes.AUTHENTICATION_OK:
      mutableReduction.update(_r => BoardReducer.authenticationOk(_r, payload));
      break;
    case ActionTypes.AUTHENTICATION_FAILED:
      mutableReduction.update(_r => BoardReducer.authenticationFailed(_r, payload));
      break;
    case ActionTypes.ADD_STORY_CLICKED:
      mutableReduction.update(_r => StoryReducer.addStoryClicked(_r));
      break;
    case ActionTypes.EDIT_STORY_CLICKED:
      mutableReduction.update(_r => StoryReducer.editStoryClicked(_r, payload));
      break;
    case ActionTypes.SAVE_STORY_CLICKED:
      mutableReduction.update(_r => StoryReducer.saveStoryClicked(_r, payload));
      break;
    case ActionTypes.REMOVE_STORY_CLICKED:
      mutableReduction.update(_r => StoryReducer.removeStoryClicked(_r, payload));
      break;
    case ActionTypes.CLOSE_STORY_MODAL_CLICKED:
    case ActionTypes.FIREBASE_STORY_CREATED_OK:
    case ActionTypes.FIREBASE_STORY_UPDATED_OK:
    case ActionTypes.FIREBASE_STORY_REMOVED_OK:
      mutableReduction.update(_r => StoryReducer.closeStoryModalClicked(_r));
      break;
    case ActionTypes.LOGOUT_CLICKED:
      mutableReduction.update(_r => BoardReducer.logout(_r, payload));
      break;
    case ActionTypes.STORY_FILTER_CLICKED:
      mutableReduction.update(_r => StoryReducer.applyStoryFilterClicked(_r, payload));
      break;
    case ActionTypes.CLEAR_STORY_FILTER_CLICKED:
      mutableReduction.update(_r => StoryReducer.clearStoryFilterClicked(_r, payload));
      break;
    default:
      console.debug(`Unhandled action of type: ${type}`);
    }
  });
};
