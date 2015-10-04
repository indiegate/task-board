import React from 'react';
import { PureComponent } from '../components/PureComponent';
import { BoardColumn } from '../components/BoardColumn';

export class BoardView extends PureComponent {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // fetch new layout if there no one present.
    if (!this.props.layout) {
      setTimeout(() => {
        this.dispatchAction({
          type: 'BOARD_MOUNTED',
          payload: null,
        });
      });
    }
  }

  render() {
    if (!this.props.layout) {
      return <div>Nothing</div>;
    }

    return (
      <div className="ui internally celled stackable three column grid">
        {this.props.layout.columns.map((item, idx) => {
          return <BoardColumn key={idx} {...item} />;
        })}
      </div>
    );
  }
}

BoardView.propTypes = {
  dispatcher: React.PropTypes.object.isRequired,
  layout: React.PropTypes.object,
};
