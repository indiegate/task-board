import React, { PropTypes } from 'react';
import PureComponent from './PureComponent';
import { LOGIN_SUBMITTED } from '../constants/actionTypes';

class LoginForm extends PureComponent {

  _handleLoginSubmit(event) {
    event.preventDefault();
    const payload = {
      firebaseId: React.findDOMNode(this.refs.firebaseId).value,
      password: React.findDOMNode(this.refs.password).value,
    };

    this.dispatchAction({
      type: LOGIN_SUBMITTED,
      payload,
    });
  }

  _renderErrorMsg() {
    const { error } = this.props;
    if (this.props.error) {
      return (
        <div className="ui error message">
          <p>{error.message}</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="ui one column center aligned grid">
        <div className="column four wide form-holder">
          <form onSubmit={this._handleLoginSubmit.bind(this)}>
            <h2 className="center aligned header form-head">Log In</h2>
            <div className="ui form">
              <div className="field">
                <input type="text" ref="firebaseId" placeholder="firebase_id"/>
              </div>
              <div className="field">
                <input type="password" ref="password" placeholder="password"/>
              </div>
              <div className="field">
                <input type="submit" value="Log in" className="ui button large fluid"/>
              </div>
            </div>
            {this._renderErrorMsg()}
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  error: PropTypes.object,
};

export default LoginForm;
