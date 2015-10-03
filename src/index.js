import React from 'react';
import { App } from './App.jsx';

window.onload = () => {
  React.render(
    <App />,
    document.querySelector('#container')
  );
};
