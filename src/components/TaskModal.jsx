import React, { Component, PropTypes } from 'react';

class TaskModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogContent: '',
      errorText: '',
    };
  }

  componentWillMount() {
    const { task } = this.props;

    if (task && task.content) {
      const dialogContent = this.props.task.content ? this.props.task.content : '';
      this.setState({
        dialogContent,
      });
    }

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

  _handleInputChange(event) {
    this.setState({
      errorText: '',
      dialogContent: event.target.value,
    });
  }

  _submitHandler() {
    if (!this.state.dialogContent) {
      this.setState({
        errorText: `Cant't save empty task`,
      });
      return;
    }
    const res = this.props.task;
    res.content = this.state.dialogContent;
    this.props.onSubmit(res);
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
    const { dialogContent } = this.state;
    const { task } = this.props;
    const displayModal = task ? 'block' : '';
    const dialogName = task && task.id ? 'Edit task' : 'Add new task';
    const displayError = this.state.errorText ? 'block' : 'none';

    return (
      <div className="ui modal" style={{display: displayModal}}>
        <div className="ui clearing segment">
          <h3 className="ui left floated header">
            <div className="content">
              {dialogName}
            </div>
          </h3>
        </div>
        <div className="ui fluid input">
          <input type="text"
                 ref="dialogContent"
                 autoFocus
                 onFocus={(event) => {
                   event.persist();
                   const node = event.target;
                   node.selectionStart = node.value.length;
                   node.selectionEnd = node.value.length;
                 }}
                 onChange={this._handleInputChange.bind(this)}
                 value={dialogContent}/>
        </div>
        <div className="actions">
          {this._renderArchiveButton()}
          <div className="ui button"
               ref="dismiss"
               onClick={this._dismissHandler.bind(this)}
               >Cancel
          </div>
          <div className="ui button"
               ref="submit"
               onClick={this._submitHandler.bind(this)}>
            OK
          </div>
        </div>
        <div className="ui error message" style={{display: displayError}}>{this.state.errorText}</div>
      </div>
    );
  }
}

TaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onArchive: PropTypes.func,
};

export default TaskModal;
