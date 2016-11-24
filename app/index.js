import React, { Component } from "react";
import App from "./containers/app";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-55635298-7');

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers/index";

const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

const AppProvider = (
  <Provider store={store}>
    <App />
  </Provider>
)


class Main extends Component {
  render() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
    return (
      AppProvider
    )
  }
}

export default Main;
