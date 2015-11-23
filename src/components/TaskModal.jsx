/*eslint wrap-iife: [2, "outside"]*/

import React, { Component, PropTypes } from 'react';
class TaskModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogContent: this.props.task.content || '',
      storyContent: this.props.task.story || 'Choose...',
      priorityContent: this.props.task.priority || 0,
      errorText: '',
    };
  }

  componentWillMount() {
    this._activateKeyListeners();
  }

  componentWillUnmount() {
    this._deactivateKeyListeners();
  }

  _keyUpHandler(event) {
    if ((event.keyCode || event.which) === 13) {
      this._submitHandler();
    }

    if ((event.keyCode || event.which) === 27) {
      this._dismissHandler();
    }
  }

  _activateKeyListeners() {
    if (!this.boundKeyUpHandler) {
      this.boundKeyUpHandler = this._keyUpHandler.bind(this);
      document.addEventListener('keyup', this.boundKeyUpHandler, false);
    }
  }

  _deactivateKeyListeners() {
    const { boundKeyUpHandler } = this;
    if (boundKeyUpHandler) {
      document.removeEventListener('keyup', boundKeyUpHandler, false);
      this.boundKeyUpHandler = null;
    }
  }

  _handleTaskInputChange(event) {
    this.setState({
      errorText: '',
      dialogContent: event.target.value,
    });
  }

  _handleStoryInputChange(event) {
    this.setState({
      errorText: '',
      storyContent: event.target.value,
    });
  }

  _handlePriorityInputChange(event) {
    this.setState({
      errorText: '',
      priorityContent: event.target.value,
    });
  }

  _submitHandler() {
    const trimmedContent = this.state.dialogContent.trim();
    const trimmedStoryContent = this.state.storyContent.trim();
    const parsedPriority = parseInt(this.state.priorityContent, 10);

    if (!trimmedContent) {
      this.setState({
        errorText: `Cant't save empty task`,
      });
      return;
    }

    this.props.onSubmit(Object.assign({}, this.props.task, {
      content: trimmedContent,
      story: trimmedStoryContent !== '' ? trimmedStoryContent : null,
      priority: parsedPriority ? parsedPriority : null,
    }));
  }

  _dismissHandler() {
    this.setState({
      errorText: '',
    });
    this.props.onClose();
  }

  _renderArchiveButton() {
    if (!this.props.task.id) {
      return null;
    }
    return (
    <div className="ui left floated red button"
         ref="remove"
         onClick={() => {
           this.props.onArchive(this.props.task);
         }}>
      <i className="trash outline icon"
         title="remove task"/>Remove
    </div>
    );
  }

  render() {
    const { task, stories } = this.props;
    const dialogName = task && task.id ? 'Edit task' : 'Add new task';
    const displayError = this.state.errorText ? 'block' : 'none';

    return (
      <div className="ui modal" style={{display: 'block'}}>
        <div className="ui clearing segment">
          <h3 className="ui left floated header">
            <div className="content">
              {dialogName}
            </div>
          </h3>
        </div>
        <div className="ui form task-form">

          <div className="fields">
            <div className="twelve wide field">
              <label>Task</label>
              <input type="text"
                     ref="dialogContent"
                     autoFocus
                     onFocus={(event) => {
                       event.persist();
                       const node = event.target;
                       node.selectionStart = node.value.length;
                       node.selectionEnd = node.value.length;
                     }}
                     onChange={this._handleTaskInputChange.bind(this)}
                     value={this.state.dialogContent}/>
            </div>
            <div className="three wide field">
              <label>Story</label>
              <div className="ui compact menu">
                <div className="ui simple dropdown item">
                  {this.state.storyContent}
                  <i className="dropdown icon"/>
                  <div className="menu">
                    {stories.map((story, idx) =>
                      <div key={idx} className="item">{story.id} : {story.title}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="one wide field">
              <label>Priority</label>
              <input type="text"
                     maxLength="1"
                     ref="storyPriority"
                     onChange={this._handlePriorityInputChange.bind(this)}
                     value={this.state.priorityContent}/>
            </div>
          </div>
        </div>
        <div className="actions">
          {this._renderArchiveButton()}
          <div className="ui button"
               ref="dismiss"
               onClick={this._dismissHandler.bind(this)}>Cancel</div>
          <div className="ui button"
               ref="submit"
               onClick={this._submitHandler.bind(this)}>OK</div>
        </div>
        <div className="ui error message" style={{display: displayError}}>{this.state.errorText}</div>
      </div>
    );
  }
}

TaskModal.propTypes = {
  stories: PropTypes.array,
  task: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onArchive: PropTypes.func,
};

export default TaskModal;
