/* global document */

import React from "react";
// import { applyMiddleware, createStore } from 'redux'
import { AppContainer } from "react-hot-loader";
import createBrowserHistory from "history/createBrowserHistory";
// import { routerMiddleware } from 'react-router-redux'

import { render } from "react-dom";
import ReactOnRails from "react-on-rails";
import HelloWorld from "./HelloWorld";
import StudentDashboard from "./StudentDashboard";
import GraderInterface from "./GraderInterface";
import ReportsInterface from "./ReportsInterface";
import ReportWithScorer from "./ReportWithScorer";
import Signup from "./Signup";

const history = createBrowserHistory();

// const configureStore = (props) => {
//   const enhancers = applyMiddleware(routerMiddleware(history))
//   return createStore(reducer, props, enhancers)
// }

const consoleErrorReporter = ({ error }) => {
  console.error(error); // eslint-disable-line
  return null;
};
consoleErrorReporter.propTypes = {
  error: React.PropTypes.instanceOf(Error).isRequired
};

function createHotModule(Komponent) {
  return (props, railsContext, domNodeId) => {
    console.log("creating module props: " + JSON.stringify(props));
    console.log("creating module context: " + JSON.stringify(railsContext));
    console.log("creating module domNodeId: " + JSON.stringify(domNodeId));
    // const store = ReactOnRails.getStore('store')
    const renderApp = () => {
      const fullProps = { ...props, history: history };
      const element = (
        <AppContainer errorReporter={consoleErrorReporter}>
          <Komponent {...fullProps} />
        </AppContainer>
      );
      render(element, document.getElementById(domNodeId));
    };
    renderApp(Komponent);
    if (module.hot) {
      module.hot.accept(
        [
          "./HelloWorld",
          "./StudentDashboard",
          "./GraderInterface",
          "./ReportsInterface",
          "./ReportWithScorer",
          "./Signup"
        ],
        () => {
          // store.replaceReducer(reducer)
          renderApp(Komponent);
        }
      );
    }
  };
}

// ReactOnRails.registerStore({ store: configureStore })
ReactOnRails.register({
  HelloWorld: createHotModule(HelloWorld),
  StudentDashboard: createHotModule(StudentDashboard),
  GraderInterface: createHotModule(GraderInterface),
  ReportsInterface: createHotModule(ReportsInterface),
  ReportWithScorer: createHotModule(ReportWithScorer),
  Signup: createHotModule(Signup)
});
