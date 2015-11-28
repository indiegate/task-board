import React from 'react';
import PureComponent from './PureComponent';
import intToRGB from '../utils/colors-helper';
import * as ActionTypes from '../constants/actionTypes';

const applyFilter = payload => ({type: ActionTypes.STORY_FILTER_CLICKED, payload});

const createNewStory = () => ({type: ActionTypes.ADD_STORY_CLICKED, payload: null});

const editStory = story => ({type: ActionTypes.EDIT_STORY_CLICKED, payload: story});

const logout = () => ({type: ActionTypes.LOGOUT_CLICKED, payload: null});

class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedStory: null,
    };
  }

  _handleApplyFilterClick(story) {
    const { selectedStory } = this.state;
    const newSelectedStory = selectedStory !== story.id ? story.id : null;
    this.setState({
      selectedStory: newSelectedStory,
    }, this.dispatchAction(applyFilter(newSelectedStory)));
  }

  _renderStoryItems() {
    return this.props.stories.map((story, idx) => {
      // TODO introduce class for background color + isHighlighted to classNames
      // TODO handle editStory in a different way than onDoubleClick
      const isHighlighted = this.state.selectedStory === story.id;
      return (
        <div className="item"
             style={{background: isHighlighted ? '#BABABA' : ''}}
             key={idx}
             onClick={this._handleApplyFilterClick.bind(this, story)}>
          <h4 className="ui header">
            <a className={"ui empty circular label"} style={{backgroundColor: `rgb(${intToRGB(story.color)})`}}/>
            {story.id}
          </h4>
          <span>{story.title}</span>
          <button className="ui adapted icon button"
                  onClick={() => {this.dispatchAction(editStory(story));}}>
            <i className="write icon"/>
          </button>
        </div>);
    });
  }

  render() {
    if (!this.props.stories) {
      return <h1>no stories</h1>;
    }
    return (
      <div className="ui vertical menu fixed top"
          style={{height: '100%', backgroundColor: '#ebebeb'}}>
        <h2 className="ui header"
              style={{
                margin: '1rem',
                display: 'inline-block',
                width: '10rem',
                wordWrap: 'break-word',
              }}>
          {this.props.firebaseId}
        </h2>
        <button className="ui compact button"
            onClick={() => {this.dispatchAction(logout());}}
            style={{display: 'inline-block', float: 'right', margin: '1rem'}}>
          logout
        </button>
        <div className="item">
          <h4>Stories
            <button className="ui adapted icon button"
                onClick={() => {this.dispatchAction(createNewStory());}}>
              <i className="plus icon"/>
            </button>
          </h4>
          <div className="ui relaxed divided selection list">
            {this._renderStoryItems()}
          </div>
        </div>
      </div>
    );
  }
}

Bar.propTypes = {
  firebaseId: React.PropTypes.string.isRequired,
  stories: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};

export default Bar;
