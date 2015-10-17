import TaskModal from '../../components/TaskModal';
import React from 'react/addons';

const { TestUtils } = React.addons;

function setup(propsOverrides) {
  const props = Object.assign({
    task: {},
    onSubmit() {},
    onDismiss() {},
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
});


