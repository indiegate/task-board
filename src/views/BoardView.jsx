/* global FIREBASE_ID, $ */

import React from 'react';
import PureComponent from '../components/PureComponent';
import { HorizontalBox } from '../components/HorizontalBox';
import Firebase from 'firebase';

export class BoardView extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // fetch new layout if there no one present.
    if (!this.props.layout) {
      setTimeout(() => {
        this.dispatchAction({
          type: 'BOARD_MOUNTED',
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
                type: 'FIREBASE_TASKS_RECEIVED',
                payload: snapshot.val(),
              });
            }, 1);
          });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatedTask) {
      console.log('nextProps.updatedTask', nextProps.updatedTask);
      this.firebaseRef
        .child('teams/fwk-int/tasks/')
        .child(nextProps.updatedTask.id)
        .set(nextProps.updatedTask);
    }
  }

  componentDidUpdate() {
    if (!this.props.newTaskId) {
      this.refs.taskText.getDOMNode().value = '';
    }
  }

  _saveTask() {
    this.firebaseRef
      .child('teams/fwk-int/tasks/')
      .push()
      .set({
        sectionId: this.props.newTaskId,
        content: this.refs.taskText.getDOMNode().value,
      }, (err) => {
        if (!err) {
          this.dispatchAction({
            type: 'FIREBASE_SAVE_TASK_REQUESTED',
            payload: err,
          });
        }
      });
  }

  _cancelAddTask() {
    this.dispatchAction({
      type: 'CANCEL_ADD_TASK_CLICKED',
      payload: null,
    });
  }

  render() {
    if (!this.props.layout) {
      return <div>Nothing</div>;
    }

    const displayModal = this.props.newTaskId ? 'block' : '';

    return (
      <div>
        <div className="ui modal" style={{display: displayModal}}>
          <i className="close icon"></i>
          <div className="header">
            Add new task
          </div>
          <div className="ui fluid input">
            <input type="text" ref="taskText" placeholder="Type new task" />
          </div>
          <div className="actions">
            <div className="ui button" onClick={this._cancelAddTask.bind(this)}>Cancel</div>
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
  newTaskId: React.PropTypes.string,
};
