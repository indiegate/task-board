import React from 'react';
import PureComponent from '../components/PureComponent';
import HorizontalBox from '../components/HorizontalBox';
import TaskModal from '../components/TaskModal';
import * as ActionTypes from '../constants/actionTypes';
import intToRGB from '../utils/colors-helper';

class BoardView extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // fetch new layout if there no one present.
    if (!this.props.layout) {
      setTimeout(() => {
        this.dispatchAction({
          type: ActionTypes.BOARD_MOUNTED,
          payload: null,
        });
      });
    }
  }

  _saveTask(task) {
    this.dispatchAction({
      type: ActionTypes.SAVE_TASK_CLICKED,
      payload: task,
    });
  }

  _archiveTask(task) {
    this.dispatchAction({
      type: ActionTypes.ARCHIVE_TASK_CLICKED,
      payload: task,
    });
  }

  _closeModal() {
    this.dispatchAction({
      type: ActionTypes.CANCEL_SAVE_TASK_CLICKED,
      payload: null,
    });
  }

  _renderTaskModal() {
    if (this.props.task) {
      return (
        <TaskModal task={this.props.task}
            onSubmit={this._saveTask.bind(this)}
            onClose={this._closeModal.bind(this)}
            onArchive={this._archiveTask.bind(this)}
        />
      );
    }
  }

  _renderStoryItems() {
    return this.props.stories.map((story, idx) => {
      return (
        <div className="item" key={idx}>
          <content>
            <a className="ui small inverted label" style={{backgroundColor: `rgb(${intToRGB(story.color)})`}}>{story.id}</a>
            <p>{story.title}</p>
          </content>
        </div>);
    });
  }

  _renderBar() {
    console.log(this.props.stories);
    if (!this.props.stories) {
      return <h1>no stories</h1>;
    }

    return (<div className="ui vertical inverted menu fixed top" style={{height: '100%'}}>
      <div className="item">
        <h4>Stories</h4>
        <div className="ui inverted relaxed divided selection list">
          {this._renderStoryItems()}
        </div>
      </div>
    </div>);
  }

  render() {
    if (!this.props.layout) {
      return <div className="ui large active loader"></div>;
    }

    return (
      <div>
        {this._renderTaskModal()}
        <div style={{flexFlow: 'row', display: 'flex'}}>
          <div style={{flex: '0 0 200px', order: 0}}>
            {this._renderBar()}
          </div>
          <div style={{flex: '3 1', order: 1}}>
            <HorizontalBox columns={this.props.layout.toJS().columns}
                           dispatcher={this.props.dispatcher}/>
          </div>
        </div>
      </div>
    );
  }
}

BoardView.propTypes = {
  dispatcher: React.PropTypes.object.isRequired,
  layout: React.PropTypes.object,
  task: React.PropTypes.object,
  stories: React.PropTypes.array,
};

export default BoardView;
