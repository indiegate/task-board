import React from 'react';
import PureComponent from './PureComponent';
import intToRGB from '../utils/colors-helper';
import * as ActionTypes from '../constants/actionTypes';

class Bar extends PureComponent {
  constructor(props) {
    super(props);
  }

  _handleAddStoryClick() {
    this.dispatchAction({
      type: ActionTypes.ADD_STORY_CLICKED,
      payload: null,
    });
  }

  _handleEditStoryClick(story) {
    this.dispatchAction({
      type: ActionTypes.EDIT_STORY_CLICKED,
      payload: story,
    });
  }

  _logout() {
    this.dispatchAction({
      type: ActionTypes.LOGOUT_CLICKED,
      payload: null,
    });
  }

  _renderStoryItems() {
    return this.props.stories.map((story, idx) => {
      return (
        <div className="item" key={idx} onDoubleClick={this._handleEditStoryClick.bind(this, story)}>
          <h4 className="ui header">
            <a className={"ui empty circular label"} style={{backgroundColor: `rgb(${intToRGB(story.color)})`}}/>
            {story.id}
          </h4>
          <span>{story.title}</span>
        </div>);
    });
  }

  render() {
    if (!this.props.stories) {
      return <h1>no stories</h1>;
    }

    return (<div className="ui vertical menu fixed top" style={{height: '100%', backgroundColor: '#ebebeb'}}>
      <button className="ui icon button"
              onClick={this._logout.bind(this)}>
        Log out
      </button>
      <div className="item">
        <h4>Stories
          <button className="ui adapted icon button" onClick={this._handleAddStoryClick.bind(this)}>
            <i className="plus icon"/>
          </button>
        </h4>
        <div className="ui relaxed divided selection list">
          {this._renderStoryItems()}
        </div>
      </div>
    </div>);
  }
}

Bar.propTypes = {
  stories: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};

export default Bar;
