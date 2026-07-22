import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { SnackbarProvider } from 'notistack';
import { UserProvider } from './context/UserContext';
import { replaceAlert } from './utils/sweetAlert';
import axios from 'axios';
import { backendUrl } from './utils/config';

// Configure Axios defaults for deployed backend URL and cross-origin cookie credentials
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

// Replace all alert functions with SweetAlert
replaceAlert();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Router>
            <App />
          </Router>
        </SnackbarProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);