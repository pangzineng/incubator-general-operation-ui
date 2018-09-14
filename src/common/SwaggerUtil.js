var yaml = require("js-yaml");
var _ = require('lodash');

const swagger = process.env.REACT_APP_SWAGGER_SPEC || `definitions:
  analysis:
    type: object
    description: The video or stream for analysis
    properties:
      _id:
        type: string
        description: The unique ID
      eyeID:
        type: string 
        description: ID of the associated eye 
      type:
        type: string
        description: machine learning approach
        enum:
          - full
          - tiny
        default: tiny
      status:
        type: string
        description: progress of analysis
        enum:
          - new
          - running
          - finished
          - error
        default: new
      source:
        type: object
        description: The video or stream source
        properties:
          type:
            type: string
            description: video source format type
            enum:
              - file
              - stream
            default: file
          protocol:
            type: string
            description: the transfer protocol of the video source
            enum:
              - rtsp
              - http
              - https
              - file
            default: https
          uri:
            type: string
            description: the uri of the video source
          meta:
            type: object
            description: meta data of the video source
            properties:
              startTime:
                type: string
                description: The start time of the video if it is a file
      _sys:
        $ref: '#/definitions/_sys'
  eye:
    type: object
    description: The tracking camera
    properties:
      _id:
        type: string
        description: The unique ID
      name:
        type: string
        description: The name of the camera
      source:
        type: object
        description: source information of the camera
        properties:
          address:
            type: string
            description: installation address
          geo:
            type: object
            description: geo location info
            properties:
              lat:
                type: number
                description: latitude
              lon:
                type: number
                description: longitude
      _sys:
        $ref: '#/definitions/_sys'
`

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

const swaggerUI = process.env.REACT_APP_SWAGGER_UI || `analysis:
  map:
    enable: false
  oin:
    enable: false
  chart:
    enable: false
eye:
  map:
    enable: true
    lat: source.geo.lat
    lon: source.geo.lon
  oin:
    enable: true
    tooltip: enter the eye
    path: 
      template: http://localhost:8888/v1/eye/$\${0}?cts=\${1}
      fields:
        - _id
        - _sys.created_ts
  chart:
    enable: true
    xAxis: name
    yAxis:
      - field: source.geo.lat
        name: Lat
        serie: line
        type: value
        area: {}
      - field: _sys.created_by
        name: CB
        serie: bar
        type: category
      - field: _sys.created_ts
        name: Time
        serie: bar
        type: time
`

export const loadSwaggerUI = () => {
  try {
    var doc = yaml.safeLoad(swaggerUI)
    return {'uiConfig': doc}
  } catch (e) {
    console.log('loadSwaggerUI error' , e)
  }
}