import React, { Component } from 'react';
import { BoardRow } from './BoardRow';

export class BoardColumn extends Component {

  constructor(props) {
    super(props);
  }

  _renderRows() {
    if (!this.props.rows) {
      return null;
    }

    return this.props.rows.map((row, idx) => {
      return <BoardRow key={idx} {...row} />;
    });
  }

  render() {
    return (
      <div className="column">
        <h2 className="ui header">{this.props.name}</h2>
        {this._renderRows()}
      </div>
    );
  }
}

BoardColumn.propTypes = {
  rows: React.PropTypes.array,
  name: React.PropTypes.string,
};
