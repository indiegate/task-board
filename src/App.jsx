import React, { Component } from 'react';
import { BoardColumn } from './components/BoardColumn';
import * as APIService from './services/APIService';

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      layout: null,
    };
  }

  componentWillMount() {
    APIService.fetchLayout()
      .then(layout => {
        this.setState({
          layout,
        });
      });
  }

  render() {
    if (!this.state.layout) {
      return <p>Loading</p>;
    }

    return (
      <div className="ui internally celled stackable three column grid">
        {this.state.layout.columns.map((item, idx) => {
          return <BoardColumn key={idx} {...item} />;
        })}
      </div>
    );
  }
}
