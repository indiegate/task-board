/* global FIREBASE_ID, $ */

import React from 'react';
import PureComponent from '../components/PureComponent';
import HorizontalBox from '../components/HorizontalBox';
import Firebase from 'firebase';
import * as ActionTypes from '../constants/actionTypes';

export default class BoardView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      taskText: '',
    };
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

  componentDidUpdate() {
    if (!this.props.task) {
      this.refs.taskText.getDOMNode().value = '';
    }
  }

  _saveTask() {
    const task = this.props.task;
    // new task
    if (!task.id) {
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .push()
        .set({
          sectionId: task.sectionId,
          content: this.refs.taskText.getDOMNode().value,
        }, (err) => {
          if (!err) {
            this.dispatchAction({
              type: ActionTypes.FIREBASE_SAVE_TASK_REQUESTED,
              payload: err,
            });
          }
        });
    // update task content
    } else {
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .child(task.id)
        .update({
          content: this.state.taskText,
        }, (err) => {
          if (!err) {
            this.dispatchAction({
              type: ActionTypes.FIREBASE_SAVE_TASK_REQUESTED,
              payload: err,
            });
          }
        });
      this.setState({taskText: ''});
    }
  }

  _cancelSaveTask() {
    this.dispatchAction({
      type: ActionTypes.CANCEL_SAVE_TASK_CLICKED,
      payload: null,
    });
  }

  render() {
    if (!this.props.layout) {
      return <div>Nothing</div>;
    }

    const task = this.props.task;
    let displayModal = '';
    let dialogName = 'Add new task';
    let dialogContent = '';
    if (task) {
      displayModal = 'block';
      if (task.id) {
        // initialy there is no taskText, use `passed-in` task
        dialogContent = this.state.taskText || task.content;
        dialogName = 'Edit task';
      } else {
        dialogContent = this.state.taskText;
      }
    }
    return (
      <div>
        <div className="ui modal" style={{display: displayModal}}>
          <i className="close icon"></i>
          <div className="header">
            {dialogName}
          </div>
          <div className="ui fluid input">
            <input type="text"
                ref="taskText"
                onChange={(event) => {
                  console.log('called on change');
                  this.setState({
                    taskText: event.target.value,
                  });
                }}
                value={dialogContent}
                />
          </div>
          <div className="actions">
            <div className="ui button" onClick={this._cancelSaveTask.bind(this)}>Cancel</div>
            <div className="ui button"
                onClick={this._saveTask.bind(this)}>OK</div>
          </div>
        </div>
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
