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
import {loadSwagger, loadSwaggerUI} from "../common/SwaggerUtil"

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

const storeTTL = store => {
  var doc = loadSwagger(); // INIT schema value
  var uiConfig = loadSwaggerUI();
  var empty = {}; // RESET session value
  Object.assign(store, doc, uiConfig, empty);
  return store;
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
    storeTTL(JSON.parse(localStorage["realpixel-store"] || "{}")),
    applyMiddleware(logger, saver)
  )

export default storeFactory
