const endpoint = process.env.REACT_APP_SWAGGER_ENDPOINT || 'http://localhost:8888/v1'

export const getOne = (definition, id) => {
    return getSwagger(`${definition}/$${id}`)
}

export const getAll = (definition, offset, limit, sort, order, queryStr) => {
    return getSwagger(definition, 
        `${queryStr ? `q=${encodeURIComponent(queryStr)}&`:""}offset=${offset}&limit=${limit}&sort=${sort}&order=${order}`)
}

export const postOne = (userID, definition, id, body) => {
    return id ? patchSwagger(userID, `${definition}/$${id}`, body) : postSwagger(userID, definition, body)
}

export const deleteMany = (userID, definition, selected) => {
    return Promise.all(selected.map(id => deleteSwagger(userID, `${definition}/$${id}`)))
}

export const getSwagger = (path, params) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("GET", `${endpoint}/${path}${params ? `?${params}` : ''}`)
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(request)
    request.onerror = (err) => rejects(err)
    request.send()
})

export const postSwagger = (userID, path, body) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("POST", `${endpoint}/${path}`)
    request.setRequestHeader("Content-type", "application/json; charset=utf-8")
    request.setRequestHeader("x-api-user", userID || 'anonymous')
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(Error(request.statusText))
    request.onerror = (err) => rejects(err)
    request.send(JSON.stringify(body))
})

export const patchSwagger = (userID, path, body) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("PATCH", `${endpoint}/${path}`)
    request.setRequestHeader("Content-type", "application/json; charset=utf-8")
    request.setRequestHeader("x-api-user", userID || 'anonymous')
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(Error(request.statusText))
    request.onerror = (err) => rejects(err)
    request.send(JSON.stringify(body))
})

export const deleteSwagger = (userID, path) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("DELETE", `${endpoint}/${path}`)
    request.setRequestHeader("x-api-user", userID || 'anonymous')
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(Error(request.statusText))
    request.onerror = (err) => rejects(err)
    request.send()
})
