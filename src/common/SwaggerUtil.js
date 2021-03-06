import {getHTTP} from './APIUtil';
var _ = require('lodash');

const pickRef = (ref, swagger) => {
  var definition = _.get(swagger, ref.replace('#/','').replace('/','.'))
  definition.properties = combineRef(definition.properties, swagger)
  definition.type = 'object'
  return definition
}

const combineRef = (properties, swagger) => {
  return _.reduce(_.keys(properties), (obj, k) => {
    if (_.has(properties, `${k}.$ref`)){
      obj[k] = pickRef(properties[k]['$ref'], swagger)
    } else if (_.has(properties, `${k}.items.$ref`)){
      obj[k] = properties[k]
      obj[k]['items'] = pickRef(properties[k]['items']['$ref'], swagger)
    } else {
      obj[k] = properties[k]
    }
    return obj
  }, {})
}

const removeHide = (obj) => {
  return _.pick(obj, _.keys(obj).filter(k => !k.startsWith('_')))
}

export const loadSwagger = (profile) => {
  return getHTTP(`${profile.endpoint}/swagger.json`).then(
    (v) => {
      const swagger = JSON.parse(v)
      if (swagger.info.title !== profile.name){
        return {}
      }
      var definitions = []
      var properties = {}
      swagger.tags.map(tag => tag.name).filter(tag => _.has(profile.access, tag)).forEach(tag => {
        definitions.push({'key': tag, 'description': swagger['definitions'][tag]['description']})
        properties[tag] = combineRef(removeHide(swagger['definitions'][tag]['properties']), swagger)
      })
      return {definitions, properties}
    }
  )
}