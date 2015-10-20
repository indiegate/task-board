import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import PureComponent from './PureComponent';
import * as ActionTypes from '../constants/actionTypes';

const taskSource = {
  beginDrag(props) {
    return {
      content: props.content,
    };
  },
  endDrag(props, monitor, component) {
    const { sectionId } = monitor.getDropResult();
    const { dispatcher, content, id} = component.props;
    dispatcher.dispatch({
      type: ActionTypes.DRAGGED_TASK_TO_SECTION,
      payload: {
        id,
        content,
        sectionId,
      },
    });
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class BoardTask extends PureComponent {
  constructor(props) {
    super(props);
  }

  _splitToWords(content) {
    return content.split(' ');
  }

  _isWordStory(word) {
    return (word.startsWith('[') && word.endsWith(']'));
  }

  _isWordTag(word) {
    return word.startsWith('#');
  }

  _renderTags(tags) {
    return tags.map((tag, idx) => {
      const classes = 'ui mini horizontal label ' + tag;
      return <div className={classes} key={idx}>{tag}</div>;
    });
  }

  _handleEditTaskDblClick() {
    this.props.dispatcher.dispatch({
      type: ActionTypes.EDIT_TASK_CLICKED,
      payload: {
        id: this.props.id,
        content: this.props.content,
        sectionId: this.props.sectionId,
      },
    });
  }

  render() {
    const { isDragging, connectDragSource, content} = this.props;

    const words = this._splitToWords(content);
    let sentence = '';
    const tags = [];
    words.map((word) => {
      if (this._isWordTag(word)) {
        tags.push(word.substring(1, word.length));
      } else if (!this._isWordStory(word)) {
        sentence += word + ' ';
      }
    });
    return (
      connectDragSource(
        <div className="item"
            onDoubleClick={this._handleEditTaskDblClick.bind(this)}
            style={{ opacity: isDragging ? 0.5 : 1 }}>
          {this._renderTags(tags)}
          {sentence}
        </div>
      )
    );
  }
}

BoardTask.propTypes = {
  content: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  dispatcher: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
};

export default DragSource('task', taskSource, collect)(BoardTask);
