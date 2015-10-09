import React, { Component } from 'react';
import BoardTask from './BoardTask';

export class BoardSection extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <div className="column">
        <div className="board-section">
          <h4 className="ui header">
            <div className="content">
              {this.props.name}
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
