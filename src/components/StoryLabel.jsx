import React, { PropTypes } from 'react';
import PureComponent from './PureComponent';
import * as ActionTypes from '../constants/actionTypes';

class StoryLabel extends PureComponent {
  _render() {
    return <div className="ui mini horizontal label">{this.props.story}</div>;
  }
}

BoardTask.propTypes = {
  story: PropTypes.string.isRequired,
};
