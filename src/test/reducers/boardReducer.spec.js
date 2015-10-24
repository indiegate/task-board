import * as BoardReducer from '../../reducers/boardReducer';

import { Record as record, fromJS, List } from 'immutable';

const Reduction = record({
  appState: fromJS({
    initialLayout: null,
    layout: null,
    loading: false,
    newTaskId: null,
  }),
  effects: List.of(),
});

describe('BoardReducer', () => {
  let reduction;
  beforeEach(() => {
    reduction = new Reduction();
  });

  it('saves fetch layout to `initialLayout`', () => {
    const layout = {
      section: 10,
    };

    const newState = BoardReducer.layoutReceivedOk(reduction, layout);

    expect(newState.getIn(['appState', 'initialLayout']).toJS())
      .to.deep.equal(layout);
  });
});
