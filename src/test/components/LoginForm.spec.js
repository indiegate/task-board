import LoginForm from '../../components/LoginForm';
import TestUtils from 'react-addons-test-utils';
import React from 'react';

function setup(ComponentClass, propsForOverride) {
  const spy = {
    clickHandler(...args) {
      this._spyCalled = true;
      this._spyArguments = args;
    },
    _spyCalled: false,
    _spyArguments: null,
  };

  const dispatcher = {
    dispatch: spy.clickHandler.bind(spy),
  };

  const props = Object.assign({dispatcher}, propsForOverride);

  const renderer = TestUtils.createRenderer();
  renderer.render(<ComponentClass {...props} />);
  const component = renderer.getRenderOutput();

  const rendered = TestUtils.renderIntoDocument(<ComponentClass {...props}/>);

  return {
    spy,
    dispatcher,
    component,
    rendered,
  };
}

describe('LoginForm', () => {
  it('should contain input for firebaseId and password', () => {
    const { component } = setup(LoginForm, {});

    const [form] = component.props.children.props.children;

    expect(form.type).to.equal('form');
    expect(form.props.children[1].props.children).to.deep.equal(
      <input type="text" ref="firebaseId" placeholder="firebase_id"/>
    );
    expect(form.props.children[2].props.children).to.deep.equal(
      <input type="password" ref="password" placeholder="password"/>);
  });

  it('should contain 1 submit button', () => {
    const { component } = setup(LoginForm, {});
    const [,,, submitWrapper] = component.props.children.props.children[0].props.children;
    expect(submitWrapper.props.children).to.deep.equal(
      <input type="submit" value="Log in" className="ui button large fluid"/>
    );
  });

  it('should contain area for error message', () => {
    const { component } = setup(LoginForm, {});
    expect(component.props.children.props.children[1]).to.be.null;

    const componentTwo = setup(LoginForm, {error: {message: 'Some error message text'}}).component;
    const errorMessage = componentTwo.props.children.props.children[1];
    expect(errorMessage).to.deep.equal(
      <div className="ui error message">
        <p>Some error message text</p>
      </div>
    );
  });

  it('should dispatch by submiting the form', () => {
    const { rendered, spy } = setup(LoginForm, {});
    const [form] = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'form');

    TestUtils.Simulate.submit(form);
    expect(spy._spyCalled).to.be.true;
    expect(spy._spyArguments[0].payload).to.deep.equal({
      firebaseId: '',
      password: '',
    });
    expect(spy._spyArguments[0].type).to.equal('LOGIN_SUBMITTED');
  });
});