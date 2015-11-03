import React from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardTask from '../../components/BoardTask';

function setup(overrideProps) {
  const renderer = TestUtils.createRenderer();
  const identity = el => el;

  const props = Object.assign({
    id: '42',
    sectionId: '101',
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

  it('should render custom tags extracted from content', () => {
    const { component } = setup({
      id: '456',
      content: '#tomato #tuna #cheese',
      sectionId: '101',
      story: 'TEST',
    });

    // TODO remove double space from BoardTask.renderTags implementation !
    const className = 'ui mini right floated basic horizontal  label';
    const tags = component.props.children[2];

    expect(tags[0]).to.eql(<div key={0} className={className}>tomato</div>);
    expect(tags[1]).to.eql(<div key={1} className={className}>tuna</div>);
    expect(tags[2]).to.eql(<div key={2} className={className}>cheese</div>);
  });

  it('should render default tags extracted from content', () => {
    const { component } = setup({
      id: '456',
      content: '#dev #qa #bug #doc',
      sectionId: '101',
      story: 'TEST',
    });

    const tags = component.props.children[2];

    expect(tags[0]).to.eql(
      <div key={0} className={'ui mini right floated basic horizontal green label'}>dev</div>);
    expect(tags[1]).to.eql(
      <div key={1} className={'ui mini right floated basic horizontal yellow label'}>qa</div>);
    expect(tags[2]).to.eql(
      <div key={2} className={'ui mini right floated basic horizontal red label'}>bug</div>);
    expect(tags[3]).to.eql(
      <div key={3} className={'ui mini right floated basic horizontal doc label'}>doc</div>);
  });

  it('should color `dot` and `content` based on storyGroup prop');
  it('should have style when isDragging:true');
  it('should not style when isDragging:false');
  it('should be draggable to another destination');
});
