// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */


export const MIC_SET_PERMISSION = 'MIC_SET_PERMISSION'

export function setMicPermission(micEnabled: false) {
  return {
    type: MIC_SET_PERMISSION,
    payload: {
      micEnabled,
    },
  }
}



const initialState = {
  micEnabled: false,
}


// any way to do this other than writing a custom reducer for each?

// how to use flow here then?


function reducer(state = initialState, action = {}) {
  const { payload, type } = action
  switch (type) {

    case MIC_SET_PERMISSION: {
      return { ...state, micEnabled: payload.micEnabled }
    }

    default: return state;
  }
}

export default reducer
