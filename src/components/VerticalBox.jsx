import React, { Component } from 'react';
import HorizontalBox from './HorizontalBox';
import BoardSection from './BoardSection';

export default class VerticalBox extends Component {

  constructor(props) {
    super(props);
  }

  _renderRows() {
    if (!this.props.rows) {
      return null;
    }

    const parents = this.props.parents.slice();
    if (this.props.name) {
      parents.push(this.props.name);
    }

    return this.props.rows.map((row, idx) => {
      if (row.id) {
        return (
          <BoardSection key={idx} {...row} parents={parents}
              dispatcher={this.props.dispatcher} />
        );
      }
      return (
        <HorizontalBox key={idx} {...row} parents={parents}
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
  parents: React.PropTypes.array,
  name: React.PropTypes.string,
  rows: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
