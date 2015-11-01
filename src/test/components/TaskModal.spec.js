import React from 'react';
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

  it('calls `onSubmit` by clicking OK', () => {
    const task = {id: 10, content: 'Some task text'};
    const spyContent = {called: false, param: null};
    const { rendered } = setup({
      task,
      onSubmit(response) {
        spyContent.called = true;
        spyContent.param = response;
      },
    });
    const taskInput = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')[0];
    const storyInput = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')[1];
    const submitButton = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'ui button')[2];

    taskInput.value = 'Updated task text';
    TestUtils.Simulate.change(taskInput);
    storyInput.value = 'STY-123';
    TestUtils.Simulate.change(storyInput);
    TestUtils.Simulate.click(submitButton);

    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.eql({id: 10, story: 'STY-123', content: 'Updated task text'});
  });

  it('calls `onClose` by clicking Cancel button', () => {
    const task = {id: 10, content: 'Some task text'};
    const spyContent = {called: false, param: null};
    const { rendered } = setup({
      task,
      onClose(response) {
        spyContent.called = true;
        spyContent.param = response;
      },
    });

    const closeButton = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'ui button')[1];

    TestUtils.Simulate.click(closeButton);

    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.be.undefined;
  });

  it('displays error when try save empty task', () => {
    const { rendered } = setup({task: {sectionId: 10}});

    const submitButton = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'ui button')[1];

    TestUtils.Simulate.click(submitButton);
    expect(rendered.state.errorText).to.equal('Cant\'t save empty task');
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

  it('disallows to add empty task', () => {
    const task = {sectionId: 10};
    const spyContent = {called: false, param: null};
    const { rendered } = setup({
      task,
      onSubmit(response) {
        spyContent.called = true;
        spyContent.param = response;
      },
    });
    const taskInput = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')[0];
    const submitButton = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'ui button')[1];

    taskInput.value = '         ';
    TestUtils.Simulate.change(taskInput);
    TestUtils.Simulate.click(submitButton);

    expect(spyContent.called).to.be.false;
    expect(spyContent.param).to.be.null;
  });

  it('trims text before saving task', () => {
    const task = {sectionId: 10};
    const spyContent = {called: false, param: null};
    const { rendered } = setup({
      task,
      onSubmit(response) {
        spyContent.called = true;
        spyContent.param = response;
      },
    });
    const input = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'input')[0];
    const submit = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'ui button')[1];
    input.value = ' x b c  ';

    TestUtils.Simulate.change(input);
    TestUtils.Simulate.click(submit);
    expect(spyContent.called).to.be.true;
    expect(spyContent.param.content).to.equal('x b c');
  });

  it('should not display `Remove` button when creating new task', () => {
    const { output } = setup({task: {sectionId: 123}});
    expect(output.props.children[2].props.children[0]).to.be.null;
  });
});


