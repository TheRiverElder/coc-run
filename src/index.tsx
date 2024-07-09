import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/font-faces.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import data from './data/data';
import polyfill from './utils/polyfill'

polyfill();

ReactDOM.render(
  <App data={data} debugMode={new URLSearchParams(window.location.search).get('debug-mode') === 'true'} />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
