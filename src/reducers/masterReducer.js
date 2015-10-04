import * as BoardReducer from './boardReducer';
import * as ActionTypes from '../constants/actionTypes';

export default (reduction, action) => {
  const { type, payload } = action;

  console.debug(`Handling action: ${type}`);

  return reduction.withMutations(mutableReduction => {
    switch (type) {
    case ActionTypes.BOARD_MOUNTED:
      mutableReduction.update(_r => BoardReducer.layoutFetchRequested(_r, payload));
      break;
    case ActionTypes.LAYOUT_FETCHED_OK:
      mutableReduction.update(_r => BoardReducer.layoutFetched(_r, payload));
      break;
    default:
      console.debug(`Unhandled action of type: ${type}`);
    }
  });
};
