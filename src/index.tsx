import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import data from './data/data';
import polyfill from './utils/polyfill'

polyfill();

ReactDOM.render(
  <React.StrictMode>
    <App data={data} debugMode={new URLSearchParams(window.location.search).get('debug-mode') === 'true'} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
