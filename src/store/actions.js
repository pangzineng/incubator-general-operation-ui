import C from "./constants"

export const onSetDefinitions = definitions =>
  ({
    type: C.SET_DEFINITIONS,
    content: definitions
  })

export const onSetProperties = properties =>
({
  type: C.SET_PROPERTIES,
  content: properties
})

export const onSelectDefinition = definition => 
  ({
    type: C.SELECT_DEFINITION,
    content: definition
  })

export const onSetUser = user =>
  ({
    type: C.SET_USER,
    content: user
  })
  
export const onSetUIConfig = uiConfig =>
  ({
    type: C.SET_UICONFIG,
    content: uiConfig
  })

export const onSetSnacker = snacker =>
  ({
    type: C.SET_SNACKER,
    content: snacker
  })

export const onSetDefinitionQuery = definitionQuery =>
  ({
    type: C.SET_DEFINITION_QUERY,
    content: definitionQuery
  })