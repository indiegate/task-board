import React from 'react';
import PureComponent from './PureComponent';
import intToRGB from '../utils/colors-helper';
import * as ActionTypes from '../constants/actionTypes';

class Bar extends PureComponent {
  constructor(props) {
    super(props);
  }

  _handleAddStoryClick() {
    this.props.dispatcher.dispatch({
      type: ActionTypes.ADD_STORY_CLICKED,
      payload: null,
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
        <div className="item" key={idx}>
          <content>
            <a className="ui small inverted label"
               style={{backgroundColor: `rgb(${intToRGB(story.color)})`}}>{story.id}</a>
            <p>{story.title}</p>
          </content>
        </div>);
    });
  }

  render() {
    console.log(this.props.stories);
    if (!this.props.stories) {
      return <h1>no stories</h1>;
    }

    return (<div className="ui vertical inverted menu fixed top" style={{height: '100%'}}>
      <button className="ui icon button"
              onClick={this._logout.bind(this)}>
        Log out
      </button>
      <div className="item">
        <h4>Stories</h4>
        <button className="ui icon button"
                onClick={this._handleAddStoryClick.bind(this)}>
          <i className="plus icon"/>
        </button>
        <div className="ui inverted relaxed divided selection list">
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
