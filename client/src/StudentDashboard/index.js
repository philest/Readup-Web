import PropTypes from "prop-types";
import { Provider } from "react-redux";

import LogRocket from "logrocket";
LogRocket.init("y5jtw9/readup-prod");

import React from "react";
import storeConfig from "./createStore";
import rootSaga from "./sagas";

import ReaderManager from "./ReaderManager";

import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import { getUserCount } from "../ReportsInterface/emailHelpers.js";

const queryString = require("query-string");

let userCount;

getUserCount().then(res => {
  userCount = res;
  console.log("in promise");

  console.log(res);
  console.log(userCount);

  LogRocket.identify(userCount + 1, {});
});

storeConfig.runSaga(rootSaga);

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function Root({ store, rorProps }) {
  console.log(store);
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route
            path="/story/:story_id/demo/:is_demo/page/:page_number/:user_id/warmup/:is_warmup"
            render={props => {
              let readerManagerProps = {
                ...props,
                ...rorProps,
                storyID: props.match.params.story_id,
                isDemo: props.match.params.is_demo === "true",
                userID: props.match.params.user_id,
                routerIsWarmup: props.match.params.is_warmup !== "false"
              }; //router: this.props.history}

              return <ReaderManager {...readerManagerProps} />;
            }}
          />

          <Route
            path="/story/:story_id/demo/:is_demo/page/:page_number"
            render={props => {
              let readerManagerProps = {
                ...props,
                ...rorProps,
                storyID: props.match.params.story_id,
                isDemo: props.match.params.is_demo === "true",
                userID: "3408"
              }; //router: this.props.history}
              return <ReaderManager {...readerManagerProps} />;
            }}
          />

          <Route
            path="/story/:story_id/"
            render={props => {
              const url =
                "/story/" + props.match.params.story_id + "/demo/true/page/0";
              return <Redirect to={url} />;
            }}
          />

          <Route
            render={props => {
              // default catchall
              // TODO how to handle?
              console.log("404!!!!");
              return <div>Sorry, the page you requested was not found.</div>;
            }}
          />
        </Switch>
      </HashRouter>
    </Provider>
  );
}

export default function ConnectedStudentDashboard({ ...props }) {
  return <Root rorProps={props} store={storeConfig.store} />;
}
