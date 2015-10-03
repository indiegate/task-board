import React from 'react';
import { App } from './App.jsx';
require('semantic-ui-css/semantic.min.css');
require('./styles/main.css');

window.onload = () => {
  React.render(
    <App />,
    document.querySelector('#container')
  );
};
