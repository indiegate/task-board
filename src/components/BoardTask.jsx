import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import PureComponent from './PureComponent';
import * as ActionTypes from '../constants/actionTypes';
import intToRGB from '../utils/colors-helper';
import classNames from 'classnames';

const taskSource = {
  beginDrag(props) {
    return {
      content: props.content,
    };
  },
  endDrag(props, monitor, component) {
    const { sectionId } = monitor.getDropResult();
    const { dispatcher, content, id, story, priority} = component.props;
    dispatcher.dispatch({
      type: ActionTypes.DRAGGED_TASK_TO_SECTION,
      payload: {
        id,
        content,
        sectionId,
        story,
        priority,
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

  _renderTags(tags) {
    const colors = {
      'dev': 'green',
      'qa': 'yellow',
      'bug': 'red',
      'doc': 'doc',
    };

    return tags.map((tag, idx) => {
      const color = colors[tag.toLowerCase()];
      const className = classNames('ui mini right floated basic horizontal', {[color]: color}, 'label');
      return <div className={className} key={idx}>{tag}</div>;
    });
  }

  _handleEditTaskDblClick() {
    this.props.dispatcher.dispatch({
      type: ActionTypes.EDIT_TASK_CLICKED,
      payload: {
        id: this.props.id,
        content: this.props.content,
        sectionId: this.props.sectionId,
        story: this.props.story,
        priority: this.props.priority,
      },
    });
  }

  _getBackgroundColorFor(type) {
    const DEFAULT_ITEM_BACKGROUND = '#FFF';
    const DEFAULT_DOT_BACKGROUND = '#e8e8e8';
    const { storyGroup } = this.props;
    if (type === 'dot') {
      return typeof storyGroup === 'number' ? `rgb(${intToRGB(storyGroup)})` : DEFAULT_DOT_BACKGROUND;
    }

    if (type === 'item') {
      return typeof storyGroup === 'number' ? `rgba(${intToRGB(storyGroup, 0.04)})` : DEFAULT_ITEM_BACKGROUND;
    }
  }

  render() {
    const { isDragging, connectDragSource, content} = this.props;

    const words = this._splitToWords(content);
    const tags = words
      .filter(word => word.startsWith('#'))
      .map(word => word.substring(1, word.length));

    const sentence = words
      .filter(word => !word.startsWith('#'))
      .join(' ');

    const dotStyle = {
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: this._getBackgroundColorFor('item'),
    };

    return (
      connectDragSource(
        <div className="item"
            onDoubleClick={this._handleEditTaskDblClick.bind(this)}
            style={dotStyle}>
            <a className={"ui empty circular label"}
                style={{backgroundColor: this._getBackgroundColorFor('dot')}}/>
            {sentence}
            {this._renderTags(tags)}
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
  story: React.PropTypes.string,
  storyGroup: React.PropTypes.number,
};

export default DragSource('task', taskSource, collect)(BoardTask);
