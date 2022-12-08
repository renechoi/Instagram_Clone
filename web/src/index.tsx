// react modules
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

// External modules
import axios from 'axios';

// Reducers
import UserReducer from './reducers/UserReducer';
import FeedReducer from './reducers/FeedReducer';

// Components
import App from './App';

// Styles
import './index.css';

axios.defaults.baseURL = 'http://localhost:9998';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const store = configureStore({
  reducer: {
    UserState: UserReducer,
    FeedState: FeedReducer
  },
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(thunkMiddleware),
  devTools: true
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
