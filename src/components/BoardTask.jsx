import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import PureComponent from './PureComponent';

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
      type: 'TASK_SECTION_UPDATED',
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

  _renderSentence(words) {
    let sentence = '';
    words.map((word) => {
      if (!word.startsWith('#')) {
        sentence += word + ' ';
      }
    });
    return sentence;
  }

  _renderTags(words) {
    const tags = [];
    words.map((word) => {
      if (word.startsWith('#')) {
        tags.push(word.substring(1, word.length));
      }
    });
    return tags.map((tag, idx) => {
      const classes = 'ui mini horizontal label ' + tag;
      return <div className={classes} key={idx}>{tag}</div>;
    });
  }

  render() {
    const { isDragging, connectDragSource, content } = this.props;

    return (
      connectDragSource(
        <div style={{ opacity: isDragging ? 0.5 : 1 }}>
          {this._renderTags(this._splitToWords(content))}
          {this._renderSentence(this._splitToWords(content))}
        </div>
      )
    );
  }
}

BoardTask.propTypes = {
  content: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

export default DragSource('task', taskSource, collect)(BoardTask);
