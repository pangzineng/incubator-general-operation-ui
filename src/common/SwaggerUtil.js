import {asyncGetHTTP} from './APIUtil';
import {
  onSetDefinitions,
  onSetProperties,
  onSetUIConfig
} from "../store/actions"
var _ = require('lodash');

const pickRef = (ref, swagger) => {
  var definition = _.get(swagger, ref.replace('#/','').replace('/','.'))
  definition.properties = combineRef(definition.properties, swagger)
  definition.type = 'object'
  return definition
}

const combineRef = (properties, swagger) => {
  return _.reduce(_.keys(properties), (obj, k) => {
    obj[k] = _.has(properties, `${k}.$ref`) ? pickRef(properties[k]['$ref'], swagger) : properties[k]
    return obj
  }, {})
}

const removeHide = (obj) => {
  return _.pick(obj, _.keys(obj).filter(k => !k.startsWith('_')))
}

const createDefaultUIConfig = (properties) => {
  return _.reduce(_.keys(properties), (obj, k) => {
    obj[k] = { map: {enable: false}, oin: {enable: false}, chart: {enable: false} }
    return obj
  }, {})
}

export const loadSwagger = async(store) => {
  const v = await asyncGetHTTP(`swagger.json`)
  const swagger = JSON.parse(v)
  var definitions = []
  var properties = {}
  swagger.tags.map(tag => tag.name).forEach(tag => {
    definitions.push({'key': tag, 'description': swagger['definitions'][tag]['description']})
    properties[tag] = combineRef(removeHide(swagger['definitions'][tag]['properties']), swagger)
  })
  store.dispatch(onSetDefinitions(definitions))
  store.dispatch(onSetProperties(properties))
  store.dispatch(onSetUIConfig(createDefaultUIConfig(properties)))
}