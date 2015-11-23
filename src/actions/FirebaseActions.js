import * as ActionTypes from '../constants/actionTypes';

export const layoutReceived = payload => ({type: ActionTypes.LAYOUT_RECEIVED_OK, payload});

export const storiesReceived = payload => ({type: ActionTypes.FIREBASE_STORIES_RECEIVED, payload});

export const storyCreated = () => ({type: ActionTypes.FIREBASE_STORY_CREATED_OK, payload: null});

export const storyRemoved = () => ({type: ActionTypes.FIREBASE_STORY_REMOVED_OK, payload: null});

export const storyUpdated = () => ({type: ActionTypes.FIREBASE_STORY_UPDATED_OK, payload: null});

export const tasksReceived = payload => ({type: ActionTypes.FIREBASE_TASKS_RECEIVED, payload});

export const taskCreated = () => ({type: ActionTypes.FIREBASE_TASK_CREATED_OK, payload: null});

export const taskUpdated = () => ({type: ActionTypes.FIREBASE_TASK_UPDATED_OK, payload: null});

export const authFailed = payload => ({type: ActionTypes.AUTHENTICATION_FAILED, payload});

export const syncFailed = payload => ({type: ActionTypes.SYNC_FAILED, payload});

export const authSuccess = payload => ({type: ActionTypes.AUTHENTICATION_OK, payload});
