import React from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardTask from '../../components/BoardTask';
import intToRGB from '../../utils/colors-helper';

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
    defaultDotBackground: '#e8e8e8',
    defaultContentBackground: '#FFF',
    component,
    rendered,
    props,
  };
}

describe('BoardTask', () => {
  it('should render some markup', () => {
    const { component } = setup();
    expect(component.type).to.equal('div');
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

  it('should use default style for `dot` and `content` without storyGroup', () => {
    const {
      component,
      defaultDotBackground,
      defaultContentBackground,
      } = setup({
        id: '456',
        content: 'Buy carrots!',
        sectionId: '101',
        story: '',
      });
    const dot = component.props.children[0];
    const contentProps = component.props;

    expect(dot.type).to.equal('a');
    expect(dot.props.className).to.equal('ui empty circular label');

    expect(dot.props.style.backgroundColor).to.equal(defaultDotBackground);

    expect(contentProps.style.backgroundColor).to.equal(defaultContentBackground);
  });

  it.only('should use style for `dot` and `content` based on storyGroup', () => {
    for (let iter = 0; iter < 10; iter++) {
      const { component, defaultDotBackground, defaultContentBackground } = setup({
        id: '456',
        content: 'Buy carrots!',
        sectionId: '101',
        story: '',
        storyGroup: iter,
      });

      const dot = component.props.children[0];
      const contentProps = component.props;
      expect(dot.type).to.equal('a');
      expect(dot.props.className).to.equal('ui empty circular label');

      expect(dot.props.style.backgroundColor).to.not.equal(defaultDotBackground);
      expect(dot.props.style.backgroundColor).to.equal(`rgb(${intToRGB(iter)})`);

      expect(contentProps.style.backgroundColor).to.not.equal(defaultContentBackground);
      expect(contentProps.style.backgroundColor).to.equal(`rgba(${intToRGB(iter, 0.04)})`);
    }
  });

  it('should have style when isDragging:true');
  it('should not style when isDragging:false');
  it('should be draggable to another destination');
});
