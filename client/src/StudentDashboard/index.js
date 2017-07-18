import PropTypes from 'prop-types';
import React from 'react';

import ReaderManager from './ReaderManager'

import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom'




export default class StudentDashboard extends React.Component {

  render() {

    return (
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
    );
  }
}






