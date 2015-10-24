import React from 'react';
import PureComponent from '../components/PureComponent';
import HorizontalBox from '../components/HorizontalBox';
import TaskModal from '../components/TaskModal';
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

  render() {
    if (!this.props.layout) {
      return <div className="ui large active loader"></div>;
    }

    return (
      <div>
        {this._renderTaskModal()}
        <HorizontalBox columns={this.props.layout.toJS().columns}
            dispatcher={this.props.dispatcher}/>
      </div>
    );
  }
}

BoardView.propTypes = {
  dispatcher: React.PropTypes.object.isRequired,
  layout: React.PropTypes.object,
  task: React.PropTypes.object,
};

export default BoardView;
