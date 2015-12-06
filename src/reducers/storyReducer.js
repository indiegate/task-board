import { fromJS } from 'immutable';
import updateLayout from '../utils/updateLayout';
import * as EffectTypes from '../constants/effectTypes';
import buildMessage from '../utils/buildMessage';

export const storiesReceived = (reduction, payload) => {
  const stories = Object.keys(payload).map(key => {
    const value = payload[key];
    return {
      id: key,
      title: value.title,
      color: value.color,
    };
  });
  return reduction
    .setIn(['appState', 'stories'], stories);
};

export const addStoryClicked = (reduction) => {
  return reduction
    .setIn(['appState', 'story'], {});
};

export const editStoryClicked = (reduction, payload) => {
  return reduction
    .setIn(['appState', 'story'], payload);
};

export const closeStoryModalClicked = (reduction) => {
  return reduction
    .setIn(['appState', 'story'], null);
};

export const saveStoryClicked = (reduction, payload) => {
  reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.STORY_SAVE_REQUESTED, payload)
      ));
};

export const removeStoryClicked = (reduction, payload) => {
  reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(EffectTypes.STORY_REMOVE_REQUESTED, payload)
      ));
};

export const applyStoryFilterClicked = (reduction, payload) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();
  const tasks = reduction.getIn(['appState', 'tasks']);

  tasks
    .filter(task => task.story === payload)
    .forEach(task => updateLayout(layout, task));

  return reduction
    .setIn(['appState', 'selectedStory'], payload)
    .setIn(['appState', 'layout'], fromJS(layout));
};

export const clearStoryFilterClicked = (reduction) => {
  const layout = reduction.getIn(['appState', 'initialLayout']).toJS();

  reduction.getIn(['appState', 'tasks'])
    .forEach(task => updateLayout(layout, task));

  return reduction
    .setIn(['appState', 'selectedStory'], null)
    .setIn(['appState', 'layout'], fromJS(layout));
};
