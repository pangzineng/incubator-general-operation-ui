var yaml = require("js-yaml");
var _ = require('lodash');

const swagger = process.env.REACT_APP_SWAGGER_SPEC

export const loadSwagger = () => {
    var definitions = []
    var properties = {}
    try {
        var doc = yaml.safeLoad(swagger);
        _.forOwn(doc.definitions, (v,k) => {
            definitions.push({'key':k, 'description':v['description']});
            _.forOwn(v.properties, (pv,pk) => {
                if (!pk.startsWith('_')){
                    _.set(properties, `${k}.${pk}`, pv);
                }
            });
        });
      } catch (e) {
        console.log('loadSwagger error', e);
    }
    return {"definitions": definitions, "properties": properties};
}

const swaggerUI = process.env.REACT_APP_SWAGGER_UI

export const loadSwaggerUI = () => {
  try {
    var doc = yaml.safeLoad(swaggerUI)
    return {'uiConfig': doc}
  } catch (e) {
    console.log('loadSwaggerUI error' , e)
  }
}