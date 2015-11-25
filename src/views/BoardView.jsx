import React from 'react';
import PureComponent from '../components/PureComponent';
import HorizontalBox from '../components/HorizontalBox';
import TaskModal from '../components/TaskModal';
import StoryModal from '../components/StoryModal';
import Bar from '../components/Bar';
import * as ActionTypes from '../constants/actionTypes';

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

  render() {
    if (!this.props.layout) {
      return <div className="ui large active loader"></div>;
    }

    return (
      <div>
        { this.props.task ?
          <TaskModal task={this.props.task}
                     stories={this.props.stories}
                     onSubmit={this._saveTask.bind(this)}
                     onClose={this._closeModal.bind(this)}
                     onArchive={this._archiveTask.bind(this)}
          />
          :
          null
        }
        { this.props.story ?
          <StoryModal story={this.props.story} dispatcher={this.props.dispatcher}/>
          :
          null
        }
        <div style={{flexFlow: 'row', display: 'flex'}}>
          <div style={{flex: '0 0 20rem', order: 0}}>
            <Bar
                stories={this.props.stories}
                firebaseId={this.props.firebaseId}
                dispatcher={this.props.dispatcher}/>
          </div>
          <div style={{flex: '3 1', order: 1}}>
            <HorizontalBox
                columns={this.props.layout.toJS().columns}
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
  story: React.PropTypes.object,
  stories: React.PropTypes.array,
  firebaseId: React.PropTypes.string.isRequired,
};

export default BoardView;
