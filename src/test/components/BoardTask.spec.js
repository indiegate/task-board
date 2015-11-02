import React from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardTask from '../../components/BoardTask';

function setup() {
  const renderer = TestUtils.createRenderer();
  const identity = el => el;

  const props = {
    id: 42,
    content: '',
    dispatcher: {},
    isDragging: false,
    connectDragSource: identity,
  };

  const OriginalBoardTask = BoardTask.DecoratedComponent;

  renderer.render(<OriginalBoardTask {...props} />);

  const component = renderer.getRenderOutput();

  return {
    component,
  };
}

describe('BoardTask', () => {
  it('should render some markup', () => {
    const { component } = setup();
    expect(component.type).to.equal('div');

    // const dot = component.props.children[0];
    // const content = component.props.children[1];
    // const tags= component.props.children[2];
  });

  it('should render tags extracted from content');
  it('should color `dot` and `content` based on storyGroup prop');
  it('should have style when isDragging:true');
  it('should not style when isDragging:false');
});
