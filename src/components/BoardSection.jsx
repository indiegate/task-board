import React, { Component } from 'react';
import BoardTask from './BoardTask';
import { DropTarget } from 'react-dnd';
import * as ActionTypes from '../constants/actionTypes';
import { sortTasks }from '../utils/compare-story-helper';

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
      return <p style={{ textAlign: 'center', color: 'lightgrey'}}>no tasks</p>;
    }
    return sortTasks(this.props.tasks)
      .map((task, idx) => {
        return <BoardTask key={idx} {...task} dispatcher={this.props.dispatcher}/>;
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
              <i className="plus icon"/>
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
