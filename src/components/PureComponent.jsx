import { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default class PureComponent extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
  }

  dispatchAction(action) {
    this.props.dispatcher.dispatch(action);
  }
}
