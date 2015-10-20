import TaskModal from '../../components/TaskModal';
import React from 'react/addons';

const { TestUtils } = React.addons;

function setup(propsOverrides) {
  const props = Object.assign({
    task: {},
    onSubmit() {},
    onClose() {},
  }, propsOverrides);

  const renderer = TestUtils.createRenderer();
  renderer.render(<TaskModal {...props} />);
  const output = renderer.getRenderOutput();
  return {
    output,
  };
}

describe('TaskModal component', () => {
  it('renders ok', () => {
    const { output } = setup();
    expect(output.type).to.equal('div');
    expect(output.props.className).to.equal('ui modal');
  });

  it('has default initial state', () => {
    const output = TestUtils.renderIntoDocument(<TaskModal/>);
    expect(output.state.dialogContent).to.equal('');
    expect(output.state.errorText).to.equal('');
  });

  it('updates state based on props', () => {
    const content = 'Some task text';
    const output = TestUtils.renderIntoDocument(<TaskModal task={{content}}/>);
    expect(output.state.dialogContent).to.equal(content);
    expect(output.state.errorText).to.equal('');
  });

  it('calls `submitHandler` on click to okay', () => {
    const content = 'Some task text';
    const spyContent = {called: false, param: null};
    const spy = (response) => {
      spyContent.called = true;
      spyContent.param = response;
    };

    const output = TestUtils.renderIntoDocument(<TaskModal
      onSubmit={spy}
      task={{content}}/>);
    const node = React.findDOMNode(output.refs.submit);
    const input = React.findDOMNode(output.refs.dialogContent);
    input.value = 'Updated task text';
    TestUtils.Simulate.change(input);
    TestUtils.Simulate.click(node);
    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.deep.equal({content: 'Updated task text'});
  });

  it('calls `dismissHandler` on click to cancel', () => {
    const spyContent = {called: false, param: null};
    const spy = (response) => {
      spyContent.called = true;
      spyContent.param = response;
    };

    const output = TestUtils.renderIntoDocument(<TaskModal
      onClose={spy}/>);
    const node = React.findDOMNode(output.refs.dismiss);

    TestUtils.Simulate.click(node);
    expect(spyContent.called).to.be.true;
    expect(spyContent.param).to.be.undefined;
  });

  it('shows error when user tries to save empty task', () => {
    const output = TestUtils.renderIntoDocument(<TaskModal/>);

    const submitButton = React.findDOMNode(output.refs.submit);
    TestUtils.Simulate.click(submitButton);
    expect(output.state.errorText).to.equal('Cant\'t save empty task');
  });
});


