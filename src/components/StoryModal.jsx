import React, { Component, PropTypes } from 'react';
import * as ActionTypes from '../constants/actionTypes';

class StoryModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idContent: this.props.story.id || '',
      titleContent: this.props.story.title || '',
      errorText: '',
    };
  }

  componentWillMount() {
    this._activateKeyListeners();
  }

  componentWillUnmount() {
    this._deactivateKeyListeners();
  }

  _dispatch(actionType, payload) {
    this.props.dispatcher.dispatch({
      type: actionType,
      payload: payload,
    });
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

  _handleIdInputChange(event) {
    this.setState({
      errorText: '',
      idContent: event.target.value,
    });
  }

  _handleTitleInputChange(event) {
    this.setState({
      errorText: '',
      titleContent: event.target.value,
    });
  }

  _submitHandler() {
    const trimmedIdContent = this.state.idContent.trim();
    const trimmedTitleContent = this.state.titleContent.trim();

    if (!trimmedIdContent) {
      this.setState({
        errorText: `Cant't save empty id`,
      });
      return;
    }

    this._dispatch(ActionTypes.SAVE_STORY_CLICKED, Object.assign({}, this.props.story, {
      id: trimmedIdContent,
      title: trimmedTitleContent !== '' ? trimmedTitleContent : null,
    }));
  }

  _dismissHandler() {
    this.setState({
      errorText: '',
    });
    this._dispatch(ActionTypes.CLOSE_STORY_MODAL_CLICKED, null);
  }

  _renderRemoveButton() {
    if (!this.props.story.id) {
      return null;
    }
    return (
    <div className="ui left floated red button"
         ref="remove"
         onClick={() => {
           this._dispatch(ActionTypes.REMOVE_STORY_CLICKED, this.props.story);
         }}>
      <i className="trash outline icon" title="remove story"/>Remove
    </div>
    );
  }

  render() {
    const story = this.props.story;
    const editMode = story && story.id;
    const dialogName = editMode ? 'Edit story' : 'Add new story';
    const displayError = this.state.errorText ? 'block' : 'none';
    const idFieldClasses = 'six wide' + (editMode ? ' disabled ' : ' ') + 'field';

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
            <div className={idFieldClasses}>
              <label>Id</label>
              <input type="text"
                     ref="storyIdContent"
                     autoFocus={!editMode}
                     onFocus={(event) => {
                       event.persist();
                       const node = event.target;
                       node.selectionStart = node.value.length;
                       node.selectionEnd = node.value.length;
                     }}
                     onChange={this._handleIdInputChange.bind(this)}
                     value={this.state.idContent}/>
            </div>
            <div className="ten wide field">
              <label>Title</label>
              <input type="text"
                     ref="storyContent"
                     autoFocus={editMode}
                     onChange={this._handleTitleInputChange.bind(this)}
                     value={this.state.titleContent}/>
            </div>
          </div>
        </div>
        <div className="actions">
          {this._renderRemoveButton()}
          <div className="ui button" ref="dismiss" onClick={this._dismissHandler.bind(this)}>Cancel</div>
          <div className="ui button" ref="submit" onClick={this._submitHandler.bind(this)}>OK</div>
        </div>
        <div className="ui error message" style={{display: displayError}}>{this.state.errorText}</div>
      </div>
    );
  }
}

StoryModal.propTypes = {
  dispatcher: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onRemove: PropTypes.func,
};

export default StoryModal;
