require('jquery');
require('bootstrap-webpack');

if (process.env.BROWSER) {
  require('./styles/_app.less');
}

import React from 'react';
import {render} from 'react-dom';
import Parse from 'parse';
import Root from './containers/Root';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import configureStore from './store/configureStore';
import ServerConfig from '../cfg/NodeJS';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

let master_key = (process.env.REACT_WEBPACK_ENV != 'local' ? process.env.PARSE_APP_ID : ServerConfig.parse[process.env.REACT_WEBPACK_ENV].PARSE_APP_ID);
let server_url = (process.env.REACT_WEBPACK_ENV != 'local' ? process.env.PARSE_SERVER_URL : ServerConfig.parse[process.env.REACT_WEBPACK_ENV].PARSE_SERVER_URL);

Parse.initialize(master_key);
Parse.serverURL = server_url;

render(
  <Root store={store} history={history}/>,
  document.getElementById('root')
);
