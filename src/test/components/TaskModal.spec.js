import React from 'react';
import ReactDOM from 'react-dom';
import TaskModal from '../../components/TaskModal';
import TestUtils from 'react-addons-test-utils';

function setup(propsOverrides) {
  const props = Object.assign({
    task: {},
    onSubmit() {},
    onClose() {},
  }, propsOverrides);

  const rendered = TestUtils.renderIntoDocument(<TaskModal {...props}/>);
  const renderer = TestUtils.createRenderer();
  renderer.render(<TaskModal {...props} />);

  const output = renderer.getRenderOutput();

  return {
    rendered,
    output,
  };
}

describe('TaskModal component', () => {
  it('renders ok', () => {
    const { output } = setup();
    expect(output.type).to.equal('div');
    expect(output.props.className).to.equal('ui modal');
  });

  it('has initial state', () => {
    const { rendered } = setup({task: {id: 42}});

    expect(rendered.props.task.id).to.equal(42);
    expect(rendered.state.dialogContent).to.equal('');
    expect(rendered.state.errorText).to.equal('');
  });

  it('set state based on `task` prop', () => {
    const content = 'Some task text';
    const { rendered } = setup({task: {id: 10, content}});

    expect(rendered.state.dialogContent).to.equal(content);
    expect(rendered.state.errorText).to.equal('');
  });

  it.only('calls `submitHandler` on click to okay', () => {
    const task = {id: 10, content: 'Some task text'};
    const spyContent = {called: false, param: null};
    const { rendered } = setup({
      task,
      onSubmit(response) {
        spyContent.called = true;
        spyContent.param = response;
      },
    });
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input');

    inputs[0].value = 'Updated task text';
    TestUtils.Simulate.change(inputs[0]);
    TestUtils.Simulate.click(ReactDOM.findDOMNode(rendered.refs.submit));

    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.eql({id: 10, content: 'Updated task text'});
  });

  it('calls `dismissHandler` on click to cancel', () => {
    const spyContent = {called: false, param: null};
    const spy = (response) => {
      spyContent.called = true;
      spyContent.param = response;
    };

    const output = TestUtils.renderIntoDocument(<TaskModal
      task={{id: 42}}
      onClose={spy}/>);
    const node = ReactDOM.findDOMNode(output.refs.dismiss);

    TestUtils.Simulate.click(node);
    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.be.undefined;
  });

  it('displays error when saving empty task', () => {
    const output = TestUtils.renderIntoDocument(<TaskModal task={{id: 42}}/>);

    const submitButton = ReactDOM.findDOMNode(output.refs.submit);
    TestUtils.Simulate.click(submitButton);
    expect(output.state.errorText).to.equal('Cant\'t save empty task');
  });

  it('contains action bar with 3 buttons', () => {
    const { output } = setup({task: {id: 123}});
    expect(output.props.children[2].props.children.length).to.equal(3);
  });

  it('displays `remove task` btn when editing', () => {
    const { output } = setup({task: {id: 123}});
    const removeButton = output.props.children[2].props.children[0];
    expect(removeButton).to.not.be.null;
    expect(removeButton.props.className).to.equal('ui left floated red button');
    expect(removeButton.props.children[0].type).to.equal('i');
    expect(removeButton.props.children[0].props.className).to.equal('trash outline icon');
    expect(removeButton.props.children[1]).to.equal('Remove');
  });

  it('doesn\'t display `remove task` btn on new task', () => {
    const { output } = setup({task: {sectionId: 123}});
    expect(output.props.children[2].props.children[0]).to.be.null;
  });

  it('disallows to add empty task', () => {
    let called = false;
    let calledParam = null;

    const spy = (param) => {
      called = true;
      calledParam = param;
    };

    const output = TestUtils.renderIntoDocument(<TaskModal
      onSubmit={spy}
      task={{id: 42}}/>);

    const submit = ReactDOM.findDOMNode(output.refs.submit);
    const input = ReactDOM.findDOMNode(output.refs.dialogContent);
    input.value = '   ';
    TestUtils.Simulate.change(input);
    TestUtils.Simulate.click(submit);
    expect(called).to.be.false;
    expect(calledParam).to.be.null;
  });

  it('trims text before saving task', () => {
    let called = false;
    let calledParam = null;

    const spy = (param) => {
      called = true;
      calledParam = param;
    };

    const output = TestUtils.renderIntoDocument(<TaskModal
      onSubmit={spy}
      task={{id: 42}}/>);

    const submit = ReactDOM.findDOMNode(output.refs.submit);
    const input = ReactDOM.findDOMNode(output.refs.dialogContent);
    input.value = ' x b c  ';
    TestUtils.Simulate.change(input);
    TestUtils.Simulate.click(submit);
    expect(called).to.be.true;
    expect(calledParam.content).to.equal('x b c');
  });
});


