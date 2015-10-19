import React, { Component } from 'react';
import VerticalBox from './VerticalBox';
import BoardSection from './BoardSection';

export default class HorizontalBox extends Component {

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

  _renderBoxHeader() {
    if (this.props.name) {
      return (<div className="column">
        <div className="ui small header">{this.props.name}</div>
      </div>);
    }
  }

  render() {
    return (
      <div>
        {this._renderBoxHeader()}
        <div className="ui internally celled stackable equal width grid">
         {this._renderColumns()}
        </div>
      </div>
    );
  }
}

HorizontalBox.propTypes = {
  name: React.PropTypes.string,
  columns: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
