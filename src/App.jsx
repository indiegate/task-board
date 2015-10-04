import React, { Component } from 'react';
import { Dispatcher } from 'flux';
import { Record as record, Map as createMap, fromJS, List } from 'immutable';
import masterReducer from './reducers/masterReducer';

import { BoardView } from './views/BoardView';


// services
import * as APIService from './services/APIService';

const APICallEffectHandler = ((handlers) => {
  return (dispatcher, effect) => {
    createMap(handlers)
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(dispatcher, effect.payload));
  };
}({
  ['FETCH_LAYOUT_API_CALL']: (dispatcher, payload) => {
    APIService.fetchLayout(payload).then(layout => {
      dispatcher.dispatch({
        type: 'LAYOUT_FETCHED_OK',
        payload: layout,
      });
    });
  },
}));

const Reduction = record({
  appState: fromJS({
    layout: null,
    loading: false,
  }),
  effects: List.of(),
});

export class App extends Component {

  constructor(props) {
    super(props);
    const dispatcher = new Dispatcher();

    // this is top level store that modifies appstate
    dispatcher.register((action) => {
      let reduction = this.state.reduction;

      // store current action in appState
      const actionLog = this.state.actionLog.push(action);

      reduction = reduction.set('effects', List.of());
      reduction = masterReducer(reduction, action);
      reduction.get('effects')
        .forEach(APICallEffectHandler.bind(null, dispatcher));

      //
      this.setState({
        reduction,
        actionLog,
      });
    });

    this.state = {
      dispatcher,
      reduction: new Reduction(),
      actionLog: List.of(),
      layout: null,
    };

    // if hot-module-reload, replay state after file save.
    if (module.hot) {
      module.hot.addStatusHandler(() => setTimeout(() => window.replay()));
    }
  }

  componentDidUpdate() {
    // method is here only for hot-module-reload
    window.replay = () => {
      const reduction = this.state
        .actionLog
        .reduce(masterReducer, new Reduction)
        .set('effects', List.of());

      this.setState({
        reduction,
      });
    };
  }

  render() {
    if (this.state.reduction.getIn(['appState', 'loading']) && !this.state.reduction.getIn(['appState', 'layout'])) {
      return <p>Loading</p>;
    }

    return (
      <div>
        <BoardView dispatcher={this.state.dispatcher}
                    layout={this.state.reduction.getIn(['appState', 'layout'])}/>
      </div>
    );
  }
}
