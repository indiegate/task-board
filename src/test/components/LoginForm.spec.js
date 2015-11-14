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

  const props = Object.assign({
    showFirebaseIdInput: false,
    isAuthenticating: false,
    dispatcher,
  }, propsForOverride);

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
  it('should not display `firebaseId` input when `showFirebaseIdInput` false', () => {
    const componentWith = setup(LoginForm, {}).component;

    const [formWith] = componentWith.props.children.props.children;
    expect(formWith.props.children[1]).to.be.null;
  });

  it('should display `firebaseId` input when `showFirebaseIdInput`', () => {
    const componentWith = setup(LoginForm, {
      showFirebaseIdInput: true,
    }).component;
    const [formWith] = componentWith.props.children.props.children;
    expect(formWith.props.children[1].props.children).to.deep.equal(
      <input type="text" ref="firebaseId" placeholder="firebase_id"/>
    );
  });

  it('should display `password` input', () => {
    const { component } = setup(LoginForm, {});
    const [form] = component.props.children.props.children;

    expect(form.type).to.equal('form');
    expect(form.props.children[2].props.children).to.deep.equal(
      <input type="password" name="password" ref="password" placeholder="password"/>);
  });

  it('should contain submit button', () => {
    const { component } = setup(LoginForm, {});
    const [,,, submitWrapper] = component.props.children.props.children[0].props.children;
    const expected = <button className="ui button primary large fluid">Log in</button>;
    expect(submitWrapper.props.children).to.deep.equal(
      expected
    );
  });

  it('should display loading button when `isAuthenticating`', () => {
    const { component } = setup(LoginForm, {
      isAuthenticating: true,
    });
    const [,,, submitWrapper] = component.props.children.props.children[0].props.children;
    expect(submitWrapper.props.children).to.deep.equal(
      <button className="ui loading button primary large fluid">Log in</button>
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

  it('should dispatch by submitting the form', () => {
    const { rendered, spy } = setup(LoginForm, {
      showFirebaseIdInput: true,
    });
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
