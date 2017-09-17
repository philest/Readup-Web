import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

import LogRocket from 'logrocket';
LogRocket.init('y5jtw9/readup-prod');

import React from 'react'
import storeConfig from './createStore'
import rootSaga from './sagas'

import ReaderManager from './ReaderManager'

import {
  HashRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import { getUserCount } from '../ReportsInterface/emailHelpers.js'

let userCount

getUserCount().then(res => {
  userCount = res
  console.log("in promise")

  console.log(res)
  console.log(userCount )
  
  LogRocket.identify(userCount + 1, {

  });
})




storeConfig.runSaga(rootSaga)

function Root ({ store, rorProps }) {
  console.log(store)
  return (
    <Provider store={store}>
      <HashRouter>
      <Switch>
        <Route
          path="/story/:story_id/page/:page_number"
          render={(props) => {
            const readerManagerProps = { ...props, ...rorProps, isDemo: (props.match.params.story_id === 'demo') } //router: this.props.history}
            return <ReaderManager {...readerManagerProps} />
          }}
        />

        <Route
          path="/story/:story_id/"
          render={(props) => {
            const url = '/story/' + props.match.params.story_id + '/page/0'
            return <Redirect to={url} />
          }}
        />

        <Route render={(props) => {
          // default catchall
          // TODO how to handle?
          console.log('404!!!!')
          return <div>Sorry, the page you requested was not found.</div>
        }} />
      </Switch>
      </HashRouter>
    </Provider>
  );
}


export default function ConnectedStudentDashboard ({ ...props }) {
  return <Root rorProps={props} store={storeConfig.store} />
}





