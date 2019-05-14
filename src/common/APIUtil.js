export const getOne = (endpoint, definition, id) => {
    return getSwagger(endpoint, `${definition}/$${id}`)
}

export const getAll = (endpoint, definition, offset, limit, sort, order, queryStr, projectionStr) => {
    return getSwagger(endpoint, definition, 
        `${queryStr ? `q=${encodeURIComponent(queryStr)}&`:""}${projectionStr ? `p=${encodeURIComponent(projectionStr)}&`:""}offset=${offset}&limit=${limit}&sort=${sort}&order=${order}`)
}

export const postOne = (endpoint, userID, definition, id, body) => {
    return id ? patchSwagger(endpoint, userID, `${definition}/$${id}`, body) : postSwagger(endpoint, userID, definition, body)
}

export const deleteMany = (endpoint, userID, definition, selected) => {
    return Promise.all(selected.map(id => deleteSwagger(endpoint, userID, `${definition}/$${id}`)))
}

export const getSwagger = (endpoint, path, params) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("GET", `${endpoint}/${path}${params ? `?${params}` : ''}`)
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(request)
    request.onerror = (err) => rejects(err)
    request.send()
})

export const postSwagger = (endpoint, userID, path, body) => new Promise((resolves, rejects) => {
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

export const patchSwagger = (endpoint, userID, path, body) => new Promise((resolves, rejects) => {
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

export const deleteSwagger = (endpoint, userID, path) => new Promise((resolves, rejects) => {
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

export const getHTTP = (url, userID) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("GET", url)
    if (userID) {
        request.setRequestHeader("x-api-user", userID)
    }
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(request)
    request.onerror = (err) => rejects(err)
    request.send()
})

export const putHTTP = (url, body) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("PUT", url, true)
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(request)
    request.onerror = (err) => rejects(err)
    request.send(body)
})