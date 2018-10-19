const endpoint = process.env.REACT_APP_AUTH_ENDPOINT || 'http://localhost:8080'

export const accountsAction = (action, body) => new Promise((resolves, rejects) => {
    const request = new XMLHttpRequest()
    request.open("POST", `${endpoint}/accounts/${action}`)
    request.setRequestHeader("Content-type", "application/json; charset=utf-8")
    request.onload = () =>
      (request.status === 200) ?
      resolves(request.response) :
      rejects(request.response)
    request.onerror = (err) => rejects(err)
    request.send(JSON.stringify(body))
})