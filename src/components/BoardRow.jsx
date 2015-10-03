import React, { Component } from 'react';

export class BoardRow extends Component {
  constructor(props) {
    super(props);
  }

  _renderTasks() {
    if (!this.props.tasks) {
      return <p>No tasks</p>;
    }
    // TODO vire - add logic for task paining
  }

  render() {
    return (
      <div className="row">
        <div className="ui divider"></div>
        <div className="column">
          <div className="board-section" id="todo">
            <h3 className="ui header">
              <div className="content">
                {this.props.name}
              </div>
              <button className="ui icon button">
                <i className="plus icon"></i>
              </button>
            </h3>
            <div className="content">
              <div className="ui selection list">
                {this._renderTasks()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BoardRow.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  tasks: React.PropTypes.array,
};
