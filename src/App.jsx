
import React, { Component } from 'react';
import { Dispatcher } from 'flux';
import { Record as record, fromJS, List } from 'immutable';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import masterReducer from './reducers/masterReducer';

import LoginForm from './components/LoginForm';
import BoardView from './views/BoardView';

// services
import APICallEffectHandler from './effect-handlers/APICallEffectHandler';

const firebaseId = localStorage.getItem('task-board:firebaseId')
  || (window.location.host.indexOf('firebaseapp') > 0 ? window.location.host.split('.')[0] : null);
const isLoggedIn = localStorage.getItem(`firebase:session::${firebaseId}`);

const Reduction = record({
  appState: fromJS({
    initialLayout: null,
    layout: null,
    loading: false,
    task: null,
    firebaseId,
    isLoggedIn,
    showFirebaseIdInput: !firebaseId,
    auth: false,
    isAuthenticating: false,
  }),
  effects: List.of(),
});

class App extends Component {

  constructor(props) {
    super(props);
    const dispatcher = new Dispatcher();

    // this is top level store that modifies appState
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
    const { dispatcher, reduction } = this.state;
    const layout = reduction.getIn(['appState', 'layout']) || reduction.getIn(['appState', 'initialLayout']);

    if (!reduction.getIn(['appState', 'isLoggedIn'])) {
      return (
        <LoginForm dispatcher={dispatcher}
            isAuthenticating={reduction.getIn(['appState', 'isAuthenticating'])}
            showFirebaseIdInput={reduction.getIn(['appState', 'showFirebaseIdInput'])}
            error={reduction.getIn(['appState', 'authError'])}/>
      );
    }

    return (
      <div>
        <BoardView dispatcher={this.state.dispatcher}
            task={this.state.reduction.getIn(['appState', 'task'])}
            layout={layout}/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
