import React from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardTask from '../../components/BoardTask';

function setup(overrideProps) {
  const renderer = TestUtils.createRenderer();
  const identity = el => el;

  const props = Object.assign({
    id: '42',
    content: '',
    dispatcher: {},
    isDragging: false,
    connectDragSource: identity,
  }, overrideProps);

  const OriginalBoardTask = BoardTask.DecoratedComponent;

  renderer.render(<OriginalBoardTask {...props} />);

  const component = renderer.getRenderOutput();
  const rendered = TestUtils.renderIntoDocument(<OriginalBoardTask {...props}/>);

  return {
    component,
    rendered,
    props,
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
  it('should handle doubleClick - fire action', () => {
    const spyContent = {called: false, param: null};

    const dispatch = (param) => {
      spyContent.called = true;
      spyContent.param = param;
    };

    const { rendered } = setup({
      id: '456',
      content: 'Blah',
      sectionId: '101',
      story: 'TEST',
      dispatcher: {
        dispatch,
      },
    });

    const node = TestUtils.findRenderedDOMComponentWithClass(rendered, 'item');

    TestUtils.Simulate.doubleClick(node);
    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.eql({
      type: 'EDIT_TASK_CLICKED',
      payload: {
        id: '456',
        content: 'Blah',
        sectionId: '101',
        story: 'TEST',
      },
    });
  });
});
