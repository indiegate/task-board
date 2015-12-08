import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import BoardSection from '../../components/BoardSection';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';


/**
 * Wraps a component into a DragDropContext that uses the TestBackend.
 */
function wrapInTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    class TestContextContainer extends Component {
      render() {
        return <DecoratedComponent {...this.props} />;
      }
    }
  );
}

function setup(ComponentClass, propsForOverride) {
  const identity = el => el;

  const props = Object.assign({
    dispatcher: {},
    id: '10',
    parents: [],
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

  it('should have a header with single `name` based on props', () => {
    const { component } = setup(BoardSection, {
      name: 'TestBestSection',
      parents: [],
    });

    const header = component.props.children.props.children[0];
    const names = header.props.children.props.children;
    expect(names.length).to.equal(1);
    expect(names[0].props.children).to.equal('TestBestSection');
  });

  it('should have a header with multiple `names` based on props', () => {
    const { component } = setup(BoardSection, {
      name: 'TestBestSection',
      parents: ['ParentName'],
    });

    const header = component.props.children.props.children[0];
    const names = header.props.children.props.children;
    expect(names.length).to.equal(2);
    expect(names[0].props.children).to.equal('ParentName');
    expect(names[1].props.children[0].props.className).to.equal('right angle icon divider');
    expect(names[1].props.children[1].props.children).to.equal('TestBestSection');
  });

  it('should have a clickable header', () => {
    let called = false;
    let calledArgs = null;
    const { component } = setup(BoardSection, {
      id: '1234',
      name: 'TestBestSection',
      parents: [],
      dispatcher: {
        dispatch(args) {
          called = true;
          calledArgs = args;
        },
      },
    });
    const header = component.props.children.props.children[0];
    expect(header.props.className).to.equal('ui horizontal divider');
    header.props.onClick();
    expect(called).to.be.true;
    expect(calledArgs.type).to.eql('ADD_TASK_CLICKED');
    expect(calledArgs.payload).to.eql({sectionId: '1234'});
  });

  it('should render message about no tasks into content wrapper', () => {
    const { component } = setup(BoardSection, {
      name: 'TestBestSection',
    });
    const content = component.props.children.props.children[1];
    expect(content.type).to.equal('div');
    expect(content.props.className).to.equal('content');
    expect(content.props.children.type).to.equal('div');
    expect(content.props.children.props.className).to.equal('ui selection list');
    expect(content.props.children.props.children.type).to.equal('p');
    expect(content.props.children.props.children.props.children).to.equal('no tasks');
  });

  it('should sort and render tasks into content wrapper', () => {
    const tasks = [
      {
        id: 'some-guid-1',
        content: 'Bar',
        sectionId: '1',
      }, {
        id: 'some-guid-2',
        content: 'Foo',
        sectionId: '1',

      },
    ];

    const propsForOverride = {
      id: '100',
      dispatcher: {},
      parents: [],
      name: 'TestBestSection',
      tasks,
    };
    const BoxContext = wrapInTestContext(BoardSection);
    const root = TestUtils.renderIntoDocument(<BoxContext {...propsForOverride} />);
    const items = TestUtils.scryRenderedDOMComponentsWithClass(root, 'item');

    expect(items.length).to.equal(2);
    expect(items[0].textContent).to.not.equal('');
    expect(items[1].textContent).to.not.equal('');
  });
});
