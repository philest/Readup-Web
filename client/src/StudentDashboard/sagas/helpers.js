import { call } from 'redux-saga/effects'

export function* clog(...args) {
  yield call(console.log, 'SAGA CLOG: ', ...args)
}
