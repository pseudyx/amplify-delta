import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { history } from './store/history';
import storeConfig from './store/storeConfig';
import { ConnectedRouter } from 'connected-react-router';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

Amplify.configure(awsExports);

ReactDOM.render(
  <Provider store={storeConfig(history)}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
