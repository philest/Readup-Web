/* global document */

import React from 'react'
// import { applyMiddleware, createStore } from 'redux'
import { AppContainer } from 'react-hot-loader'
import createBrowserHistory from 'history/createBrowserHistory'
// import { routerMiddleware } from 'react-router-redux'

import { render } from 'react-dom'
import ReactOnRails from 'react-on-rails'
import HelloWorld from './HelloWorld'
import StudentDashboard from './StudentDashboard'

const history = createBrowserHistory()

// const configureStore = (props) => {
//   const enhancers = applyMiddleware(routerMiddleware(history))
//   return createStore(reducer, props, enhancers)
// }

const consoleErrorReporter = ({ error }) => {
  console.error(error) // eslint-disable-line
  return null
}
consoleErrorReporter.propTypes = {
  error: React.PropTypes.instanceOf(Error).isRequired,
}


function createHotModule(Komponent) {
  return (props, railsContext, domNodeId) => {
    // const store = ReactOnRails.getStore('store')
    const renderApp = () => {
      const element = (
        <AppContainer errorReporter={consoleErrorReporter}>
          <Komponent {...{ history }} />
        </AppContainer>
      )
      render(element, document.getElementById(domNodeId))
    }
    renderApp(HelloWorld)
    if (module.hot) {
      module.hot.accept(['./HelloWorld', './StudentDashboard'], () => {
        // store.replaceReducer(reducer)
        renderApp(StudentDashboard)
      })
    }
  }
}


// ReactOnRails.registerStore({ store: configureStore })
ReactOnRails.register({
  HelloWorld: createHotModule(HelloWorld),
  StudentDashboard: createHotModule(StudentDashboard),
})
