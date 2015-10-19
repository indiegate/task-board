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

  _renderBoxHeader() {
    if (this.props.name) {
      return (<div className="column">
        <div className="ui small header">{this.props.name}</div>
      </div>);
    }
  }


  render() {
    return (
      <div className="column">
        {this._renderBoxHeader()}
        {this._renderRows()}
      </div>
    );
  }
}

VerticalBox.propTypes = {
  name: React.PropTypes.string,
  rows: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
