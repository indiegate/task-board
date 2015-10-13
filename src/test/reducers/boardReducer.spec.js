import * as BoardReducer from '../../reducers/boardReducer';

import { Record as record, fromJS, List } from 'immutable';

const Reduction = record({
  appState: fromJS({
    initialLayout: null,
    layout: null,
    loading: false,
    newTaskId: null,
    updatedTask: null,
  }),
  effects: List.of(),
});

describe('BoardReducer', () => {
  let reduction;
  beforeEach(() => {
    reduction = new Reduction();
  });

  it('fetch layout pushes URL to side effects', () => {
    const URL = 'http://localhost:3000/path/to/resource';
    const newState = BoardReducer.layoutFetchRequested(reduction, URL);
    expect(reduction.getIn(['effects']).toJS()).to.deep.equal([]);
    expect(newState.getIn(['effects']).toJS()[0].payload).to.equal(URL);
  });

  it('saves fetch layout to `initialLayout`', () => {
    const layout = {
      section: 10,
    };

    const newState = BoardReducer.layoutFetched(reduction, layout);

    expect(newState.getIn(['appState', 'initialLayout']).toJS())
      .to.deep.equal(layout);
  });

  it('should add task', () => {
    const task = {
      id: 'abcd',
      content: 'task content',
      sectionId: 'some-section-id-10',
    };

    const newState = BoardReducer.saveTaskClicked(reduction, task);
    expect(newState.getIn(['appState', 'task'])).to.equal(task);
  });

  it('should cancel task adding', () => {
    const task = {
      id: 'abcd',
      content: 'task content',
      sectionId: 'some-section-id-10',
    };

    let newState = BoardReducer.saveTaskClicked(reduction, task);
    expect(newState.getIn(['appState', 'task'])).to.equal(task);
    newState = BoardReducer.cancelSaveTaskClicked(newState, task);
    expect(newState.getIn(['appState', 'task'])).to.equal(null);
  });
});
