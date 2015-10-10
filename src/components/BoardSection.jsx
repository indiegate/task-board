import React, { Component } from 'react';
import BoardTask from './BoardTask';
import { DropTarget } from 'react-dnd';

const sectionTarget = {
  canDrop(props, monitor) {
    return true;
  },

  hover(props, monitor, component) {
    const clientOffset = monitor.getClientOffset();
    const componentRect = React.findDOMNode(component).getBoundingClientRect();
    const isJustOverThisOne = monitor.isOver({ shallow: true });
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    console.log('Item:', item);
    return { moved: true };
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
    return this.props.tasks.map((task, idx) => {
      return <BoardTask key={idx} {...task} />;
    });
  }

  _handleAddTaskClick() {
    this.props.dispatcher.dispatch({
      type: 'ADD_TASK_CLICKED',
      payload: this.props.id,
    });
  }

  _getTargetClass() {
    const {isOver, canDrop} = this.props;
    if (isOver && canDrop) {
      return 'green-target';
    };

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
          <h4 className="ui header">
            <div className="content">
              {name}
            </div>
            <button className="ui icon button" onClick={this._handleAddTaskClick.bind(this)}>
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
