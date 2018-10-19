import { createStore, combineReducers, applyMiddleware } from "redux"
import {
  definitions,
  selectedDefinition,
  user,
  properties,
  definitionQuery,
  snacker
} from "./reducers"

const STORE_NAME = "realpixel-store"

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
    localStorage[STORE_NAME] = JSON.stringify(store.getState())
    return result
}

const storeTTL = store => { 
  return store // keep all store data
} 


const storeFactory = () => 
  createStore(
    combineReducers({
      definitions,
      selectedDefinition,
      user,
      properties,
      definitionQuery,
      snacker
    }),
    storeTTL(JSON.parse(localStorage[STORE_NAME] || "{}")), 
    applyMiddleware(logger, saver)
  )

export default storeFactory
