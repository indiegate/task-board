import React from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardSection from '../../components/BoardSection';

function setup(ComponentClass, propsForOverride) {
  const identity = el => el;

  const props = Object.assign({
    dispatcher: {},
    id: '10',
    connectDropTarget: identity,
  }, propsForOverride);

  const OriginalComponentClass = ComponentClass.DecoratedComponent;

  const renderer = TestUtils.createRenderer();

  renderer.render(<OriginalComponentClass {...props} />);

  const component = renderer.getRenderOutput();
  const rendered = TestUtils.renderIntoDocument(<OriginalComponentClass {...props}/>);
  return {
    component,
    rendered,
  };
}

describe('BoardSection', () => {
  it('should render a `column` wrapper', () => {
    const { component } = setup(BoardSection);

    expect(component.type).to.equal('div');
    expect(component.props.className).to.equal('column');
  });

  it('should add class to `board-section` based on props', () => {
    const { component } = setup(BoardSection);

    expect(component.props.children.type).to.equal('div');
    expect(component.props.children.props.className).to.equal('board-section ');
  });

  it('should have `board-section green-target` class when is over and can drop', () => {
    const { component } = setup(BoardSection, {
      isOver: true,
      canDrop: true,
    });

    expect(component.props.children.type).to.equal('div');
    expect(component.props.children.props.className).to.equal('board-section green-target');
  });

  it('should have `board-section red-target` class when is over and can not drop', () => {
    const { component } = setup(BoardSection, {
      isOver: true,
      canDrop: false,
    });

    expect(component.props.children.type).to.equal('div');
    expect(component.props.children.props.className).to.equal('board-section red-target');
  });

  it('should have `board-section yellow-target` class when is not over and can drop', () => {
    const { component } = setup(BoardSection, {
      isOver: false,
      canDrop: true,
    });

    expect(component.props.children.type).to.equal('div');
    expect(component.props.children.props.className).to.equal('board-section yellow-target');
  });

  it('should have a `h4` header with `name` based on props', () => {
    const { component } = setup(BoardSection, {
      name: 'TestBestSection',
    });
    const header = component.props.children.props.children[0];

    expect(header.type).to.equal('h4');
    expect(header.props.className).to.equal('ui block header');
    expect(header.props.children[0].props.children).to.equal('TestBestSection');
  });

  it('should have a header with a clickable `add button`', () => {
    let called = false;
    let calledArgs = null;
    const { component } = setup(BoardSection, {
      id: '1234',
      name: 'TestBestSection',
      dispatcher: {
        dispatch(args) {
          called = true;
          calledArgs = args;
        },
      },
    });
    const header = component.props.children.props.children[0];
    expect(header.props.children[1].type).to.equal('button');
    expect(header.props.children[1].props.className).to.equal('ui icon button');
    expect(header.props.children[1].props.children.type).to.equal('i');
    expect(header.props.children[1].props.children.props.className).to.equal('plus icon');
    header.props.children[1].props.onClick();
    expect(called).to.be.true;
    expect(calledArgs.type).to.eql('ADD_TASK_CLICKED');
    expect(calledArgs.payload).to.eql({sectionId: '1234'});
  });
  it('should render tasks into content');
});
