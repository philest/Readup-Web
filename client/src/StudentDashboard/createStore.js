// some really smart notes:
// https://github.com/reactjs/redux/issues/1171


import { combineReducers, createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { autoRehydrate } from 'redux-persist'
import readerReducer from './state'


// import componentsReducer       from './components/reducer'
// import scenesReducer           from './scenes/reducer'
// import dataReducer             from './data/reducer'
// import globalReducer           from './reducer'
// import { firebaseInfoReducer } from 'app/services/pushController'



const rootReducer = combineReducers({
  reader: readerReducer,
  // components: componentsReducer,
  // scenes: scenesReducer,
  // data: dataReducer,
})



const sagaMiddleware = createSagaMiddleware()


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
    ),
    autoRehydrate(),
  ),
)


export default {
  store,
  runSaga: sagaMiddleware.run
}
