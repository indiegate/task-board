import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PureComponent from './PureComponent';
import { LOGIN_SUBMITTED } from '../constants/actionTypes';
import classNames from 'classnames';

class LoginForm extends PureComponent {

  _handleLoginSubmit(event) {
    event.preventDefault();
    const payload = {
      password: ReactDOM.findDOMNode(this.refs.password).value,
    };

    if (this.props.showFirebaseIdInput) {
      payload.firebaseId = ReactDOM.findDOMNode(this.refs.firebaseId).value;
    }

    this.dispatchAction({
      type: LOGIN_SUBMITTED,
      payload,
    });
  }

  _renderErrorMsg() {
    const { error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div className="ui error message">
        <p>{error.message}</p>
      </div>
    );
  }

  _renderFirebaseIdInput() {
    if (!this.props.showFirebaseIdInput) {
      return null;
    }
    return (
      <div className="field">
        <input type="text" ref="firebaseId" placeholder="firebase_id"/>
      </div>
    );
  }

  render() {
    const { isAuthenticating } = this.props;
    const buttonClassName = classNames('ui', { loading: isAuthenticating }, 'button primary large fluid');

    return (
      <div className="ui middle aligned center aligned stackable grid">
        <div className="column three wide">
          <form className="ui form" onSubmit={this._handleLoginSubmit.bind(this)}>
            <h2 className="center aligned header form-head">Log In</h2>
            {this._renderFirebaseIdInput()}
            <div className="field">
              <input name="password" type="password" ref="password" placeholder="password"/>
            </div>
            <div className="field">
              <button className={buttonClassName}>Log in</button>
            </div>
          </form>
          {this._renderErrorMsg()}
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  error: PropTypes.object,
  isAuthenticating: PropTypes.bool.isRequired,
  showFirebaseIdInput: PropTypes.bool.isRequired,
};

export default LoginForm;
