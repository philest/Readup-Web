import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import React from 'react'
import storeConfig from './createStore'

import ReaderManager from './ReaderManager'

import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom'




function Root ({ store }) {
  console.log(store)
  return (
    <Provider store={store}>
      <HashRouter>
      <Switch>
        <Route
          path="/story/:story_id/page/:page_number"
          render={(props) => {
            const readerManagerProps = {...props, ...this.props} //router: this.props.history}
            return <ReaderManager {...readerManagerProps} />
          }}
        />


        <Route render={(props) => {
          // default catchall
          // TODO how to handle?
          console.log('404!!!!')
          return <div>404</div>
        }} />
      </Switch>
      </HashRouter>
    </Provider>
  );
}


export default function ConnectedStudentDashboard ({ ...props }) {
  return <Root {...props} store={storeConfig.store} />
}





