import C from "./constants"

export const definitions = (state = [], action) => {
  switch (action.type) {
    case C.SET_DEFINITIONS:
      if(action.content === null) {
        return []
      } else {
        return action.content
      }
    default:
      return state
  }
}

export const selectedDefinition = (state = null, action) => {
  switch(action.type) {
    case C.SELECT_DEFINITION:
      return action.content
    default:
      return state
  }
}

export const properties = (state = {}, action) => {
  switch (action.type) {
    case C.SET_PROPERTIES: {
      if(action.content === null) {
        return {}
      } else {
        const nstate = Object.assign({}, state, action.content)
        return nstate
      }
    }
    default :
      return state
  }
}

export const user = (state = {}, action) => {
  switch (action.type) {
    case C.SET_USER: {
      if(action.content === null) {
        return {}
      } else {
        const nstate = Object.assign({}, state, action.content)
        return nstate
      }
    }
    default :
      return state
  }
}

export const snacker = (state = {}, action) => {
  switch(action.type) {
    case C.SET_SNACKER:
      return action.content
    default:
      return state
  }
}

export const definitionQuery = (state = {}, action) => {
  switch (action.type) {
    case C.SET_DEFINITION_QUERY: {
      if(action.content === null) {
        return {}
      } else {
        const nstate = Object.assign({}, state, action.content)
        return nstate
      }
    }
    default :
      return state
  }
}
