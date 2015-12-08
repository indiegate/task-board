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
      const parents = this.props.parents.slice();
      if (this.props.name) {
        parents.push(this.props.name);
      }

      if (column.id) {
        return (
          <BoardSection key={idx} {...column} parents={parents}
              dispatcher={this.props.dispatcher} />
        );
      }
      return (
        <VerticalBox key={idx} {...column} parents={parents}
          dispatcher={this.props.dispatcher} />
      );
    });
  }

  render() {
    return (
      <div>
        <div className="ui internally celled stackable equal width grid">
         {this._renderColumns()}
        </div>
      </div>
    );
  }
}

HorizontalBox.propTypes = {
  parents: React.PropTypes.array,
  name: React.PropTypes.string,
  columns: React.PropTypes.array,
  dispatcher: React.PropTypes.object.isRequired,
};
