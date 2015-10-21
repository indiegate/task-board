import React, { PropTypes } from 'react';
import PureComponent from './PureComponent';

export default class StoryLabel extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <h5 className="ui header"><i>{this.props.story}</i></h5>;
  }
}

StoryLabel.propTypes = {
  story: PropTypes.string.isRequired,
};
