export const BOARD_MOUNTED = 'BOARD_MOUNTED';

// UI/User triggered actions
export const ADD_TASK_CLICKED = 'ADD_TASK_CLICKED';
export const EDIT_TASK_CLICKED = 'EDIT_TASK_CLICKED';
export const SAVE_TASK_CLICKED = 'SAVE_TASK_CLICKED';
export const CANCEL_SAVE_TASK_CLICKED = 'CANCEL_SAVE_TASK_CLICKED';
export const ARCHIVE_TASK_CLICKED = 'ARCHIVE_TASK_CLICKED';
export const DRAGGED_TASK_TO_SECTION = 'DRAGGED_TASK_TO_SECTION';
export const LOGIN_SUBMITTED = 'LOGIN_SUBMITTED';
export const LOGOUT_CLICKED = 'LOGOUT_CLICKED';
export const ADD_STORY_CLICKED = 'ADD_STORY_CLICKED';
export const EDIT_STORY_CLICKED = 'EDIT_STORY_CLICKED';
export const SAVE_STORY_CLICKED = 'SAVE_STORY_CLICKED';
export const REMOVE_STORY_CLICKED = 'REMOVE_STORY_CLICKED';
export const CLOSE_STORY_MODAL_CLICKED = 'CLOSE_STORY_MODAL_CLICKED';
export const STORY_FILTER_CLICKED = 'STORY_FILTER_CLICKED';
export const CLEAR_STORY_FILTER_CLICKED = 'CLEAR_STORY_FILTER_CLICKED';

// actions triggered by Firebase service
export const FIREBASE_TASKS_RECEIVED = 'FIREBASE_TASKS_RECEIVED';
export const FIREBASE_TASK_CREATED_OK = 'FIREBASE_TASK_CREATED_OK';
export const FIREBASE_TASK_UPDATED_OK = 'FIREBASE_TASK_UPDATED_OK';
export const FIREBASE_TASK_ARCHIVED_OK = 'FIREBASE_TASK_ARCHIVED_OK';
export const FIREBASE_TASK_ARCHIVE_FAILED = 'FIREBASE_TASK_ARCHIVE_FAILED';
export const FIREBASE_STORIES_RECEIVED = 'FIREBASE_STORIES_RECEIVED';
export const FIREBASE_STORY_CREATED_OK = 'FIREBASE_STORY_CREATED_OK';
export const FIREBASE_STORY_UPDATED_OK = 'FIREBASE_STORY_UPDATED_OK';
export const FIREBASE_STORY_REMOVED_OK = 'FIREBASE_STORY_REMOVED_OK';

// when a firebase child respond on('value') with error;
export const SYNC_FAILED = 'SYNC_FAILED';

export const LAYOUT_RECEIVED_OK = 'LAYOUT_RECEIVED_OK';
export const AUTHENTICATION_OK = 'AUTHENTICATION_OK';
export const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED';
