import React from 'react';
import PureComponent from '../components/PureComponent';
import HorizontalBox from '../components/HorizontalBox';
import TaskModal from '../components/TaskModal';
import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

class BoardView extends PureComponent {

  componentWillMount() {
    // fetch new layout if there no one present.
    if (!this.props.layout) {
      setTimeout(() => {
        this.dispatchAction({
          type: ActionTypes.BOARD_MOUNTED,
          payload: null,
        });
      });
    } else {
      // register for firebase updates
      this.firebaseRef = new Firebase(`https://${FIREBASE_ID}.firebaseio.com/`);
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
          .on('value', snapshot => {
            setTimeout(() => {
              this.dispatchAction({
                type: ActionTypes.FIREBASE_TASKS_RECEIVED,
                payload: snapshot.val(),
              });
            }, 1);
          });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatedTask) {
      const { content, sectionId } = nextProps.updatedTask;

      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .child(nextProps.updatedTask.id)
        .set({
          sectionId,
          content,
        });
    }
  }

  _dispatchSaveTask() {
    this.dispatchAction({
      type: ActionTypes.FIREBASE_SAVE_TASK_REQUESTED,
      payload: null,
    });
  }

  _saveTask(task) {
    // new task
    if (!task.id) {
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .push()
        .set({
          sectionId: task.sectionId,
          content: task.content,
        }, (err) => {
          if (!err) {
            this._dispatchSaveTask();
          }
        });
    // update task content
    } else {
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .child(task.id)
        .update({
          content: task.content,
        }, (err) => {
          if (!err) {
            this._dispatchSaveTask();
          }
        });
    }
  }

  _archiveTask(task) {
    this.dispatchAction({
      type: ActionTypes.ARCHIVE_TASK_CLICKED,
      payload: task,
    });
  }

  _renderTaskModal() {
    if (this.props.task) {
      return (
        <TaskModal task={this.props.task}
            onSubmit={(task) => {
              this._saveTask(task);
            }}
            onDismiss={() => {
              this.dispatchAction({
                type: ActionTypes.CANCEL_SAVE_TASK_CLICKED,
                payload: null,
              });
            }}
            onArchive={this._archiveTask.bind(this)}
        />
      );
    }
  }

  render() {
    if (!this.props.layout) {
      return <div>Nothing</div>;
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
