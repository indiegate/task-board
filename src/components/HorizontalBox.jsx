import React, { Component } from 'react';
import { VerticalBox } from './VerticalBox';
import { BoardSection } from './BoardSection';

export class HorizontalBox extends Component {

  constructor(props) {
    super(props);
  }

  _renderColumns() {
    if (!this.props.columns) {
      return null;
    }

    return this.props.columns.map((column, idx) => {
      if (column.id) {
        return (
          <BoardSection key={idx} {...column}
              dispatcher={this.props.dispatcher} />
        );
      }
      return (
        <VerticalBox key={idx} {...column}
          dispatcher={this.props.dispatcher} />
      );
    });
  }

  render() {
    return (
      <div className="ui internally celled stackable equal width grid">
       {this._renderColumns()}
      </div>
    );
  }
}

HorizontalBox.propTypes = {
  columns: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
