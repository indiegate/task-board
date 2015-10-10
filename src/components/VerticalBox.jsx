import React, { Component } from 'react';
import { HorizontalBox } from './HorizontalBox';
import BoardSection from './BoardSection';

export class VerticalBox extends Component {

  constructor(props) {
    super(props);
  }

  _renderRows() {
    if (!this.props.rows) {
      return null;
    }

    return this.props.rows.map((row, idx) => {
      if (row.id) {
        return (
          <BoardSection key={idx} {...row}
              dispatcher={this.props.dispatcher} />
        );
      }
      return (
        <HorizontalBox key={idx} {...row}
          dispatcher={this.props.dispatcher} />
      );
    });
  }

  render() {
    return (
      <div className="column">
        {this._renderRows()}
      </div>
    );
  }
}

VerticalBox.propTypes = {
  rows: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
