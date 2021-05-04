const createError = require('http-errors');

const getToken = req => {
    if(!req.headers['authorization']) throw createError.Unauthorized()
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    return bearerToken[1]
}

module.exports = getToken