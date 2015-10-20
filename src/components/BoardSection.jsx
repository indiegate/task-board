import React, { Component } from 'react';
import BoardTask from './BoardTask';
import { DropTarget } from 'react-dnd';
import { fromJS } from 'immutable';
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
    return this.props.tasks
        .map((task) => {
          const taskWithStory = storyRegExp.exec(task.content);
          if (taskWithStory) {
            task.story = taskWithStory[0];
          }
          return task;
        })
        .map(task => task.story)
        .reduce((p,c) => {
          if(p.indexOf(c) > -1) {
            return p
          } else {
            p.push(c)
          }
          return p;
        },[]) // get array of unique stories
        .map(story => {
          return this.props.tasks.filter(ii => ii.story === story)
            .reduce((p,c) => {
              p.story = c.story;
              p.tasks = p.tasks || [];
              p.tasks.push({id: c.id, sectionId: c.sectionId, content: c.content});
              return p;
            }, {})
        })
        .map((story, idx) => {
          console.log(story);
          if (story.story) {
            return <StoryLabel key={idx} story={story.story} />;
          }
          return <BoardTask key={idx} {...task} dispatcher={this.props.dispatcher} />;
        });
  }

  _renderStory(story) {
    if (story.story) {
      return <StoryLabel key={idx} story={story.story} />;
    }
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
          <h4 className="ui header">
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
