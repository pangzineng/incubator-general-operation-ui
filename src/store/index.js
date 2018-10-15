import { createStore, combineReducers, applyMiddleware } from "redux"
import {
  definitions,
  selectedDefinition,
  user,
  properties,
  uiConfig,
  definitionQuery,
  snacker
} from "./reducers"

const logger = store => next => action => {
    let result
    console.groupCollapsed("dispatching", action.type)
    console.log("prev state", store.getState())
    console.log("action", action)
    result = next(action)
    console.log("next state", store.getState())
    console.groupEnd()
    return result
}

const saver = store => next => action => {
    let result = next(action)
    localStorage["realpixel-store"] = JSON.stringify(store.getState())
    return result
}

const storeFactory = () => 
  createStore(
    combineReducers({
      definitions,
      selectedDefinition,
      user,
      properties,
      uiConfig,
      definitionQuery,
      snacker
    }),
    {}, // RESET session everytime
    applyMiddleware(logger, saver)
  )

export default storeFactory
