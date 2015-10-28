import React, { Component } from 'react';
import BoardTask from './BoardTask';
import StoryLabel from './StoryLabel';
import { DropTarget } from 'react-dnd';
import * as ActionTypes from '../constants/actionTypes';

const sectionTarget = {
  canDrop() {
    return true;
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return null;
    }
    return {
      sectionId: component.props.id,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

class BoardSection extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  _renderTasks() {
    if (!this.props.tasks) {
      return <p>No tasks</p>;
    }
    const storyRegExp = new RegExp('\\[.*]');
    const storiesAndTasks = [];
    this.props.tasks
      .map((task) => {
        const taskWithStory = storyRegExp.exec(task.content);
        if (taskWithStory) {
          task.story = taskWithStory[0];
        }
        return task;
      })
      .sort((taskA, taskB) => {
        if (!taskA.story) {return -1; }
        if (!taskB.story) {return 1; }
        if (taskA.story < taskB.story) {return -1; }
        if (taskA.story > taskB.story) {return 1; }
        return 0;
      })
      .forEach((task) => {
        if (!task.story) {
          storiesAndTasks.push(task);
        } else {
          if (storiesAndTasks.some(entry => entry.story === task.story)) {
            storiesAndTasks.push(task);
          } else {
            storiesAndTasks.push({story: task.story});
            storiesAndTasks.push(task);
          }
        }
      });
    return storiesAndTasks.map((entry, idx) => {
      if (!entry.id) {
        return <StoryLabel key={idx} story={entry.story}/>;
      }
      return <BoardTask key={idx} {...entry} dispatcher={this.props.dispatcher}/>;
    });
  }

  _handleAddTaskClick() {
    this.props.dispatcher.dispatch({
      type: ActionTypes.ADD_TASK_CLICKED,
      payload: {sectionId: this.props.id},
    });
  }

  _getTargetClass() {
    const {isOver, canDrop} = this.props;

    if (isOver && canDrop) {
      return 'green-target';
    }

    if (isOver && !canDrop) {
      return 'red-target';
    }

    if (!isOver && canDrop) {
      return 'yellow-target';
    }

    return '';
  }

  render() {
    const { connectDropTarget, name } = this.props;

    const sectionClass = 'board-section ' + this._getTargetClass();
    return connectDropTarget(
      <div className="column">
        <div className={sectionClass}>
          <h4 className="ui block header">
            <div className="content">
              {name}
            </div>
            <button className="ui icon button"
                onClick={this._handleAddTaskClick.bind(this)}>
              <i className="plus icon"></i>
            </button>
          </h4>
          <div className="content">
            <div className="ui selection list">
              {this._renderTasks()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BoardSection.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  tasks: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};

export default DropTarget('task', sectionTarget, collect)(BoardSection);
