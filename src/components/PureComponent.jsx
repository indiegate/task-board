import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export class PureComponent extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
  }

  dispatchAction(action) {
    this.props.dispatcher.dispatch(action);
  }
}
