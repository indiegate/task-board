import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
require('semantic-ui-css/semantic.min.css');
require('./styles/main.css');

ReactDOM.render(<App />, document.querySelector('#container'));
