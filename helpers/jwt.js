var JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: user => {
        return new Promise((resolve, reject) => {
            const payload = {
                role: user.role
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer: 'pickurpage.com',
                audience: user.id
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(createError.InternalServerError(err.message))

                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                reject(createError.Unauthorized(message))
            }

            req.payload = payload
            next()
        })
    },
    signRefreshToken: user => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer: 'pickurpage.com',
                audience: user.id
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(createError.InternalServerError(err.message))

                resolve(token)
            })
        })
    },
    verifyRefreshToken: refreshToken => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) reject(createError.Unauthorized())
                const userId = payload.aud

                resolve(userId)
            })
        })
    },
    signEmailVerifyToken: user => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.EMAIL_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer: 'pickurpage.com',
                audience: user.id
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(createError.InternalServerError(err.message))

                resolve(token)
            })
        })
    },
    verifyEmailToken: token => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.EMAIL_TOKEN_SECRET, (err, payload) => {
                if(err) reject(createError.Unauthorized())

                const userId = payload.aud
                resolve(userId)
            })
        })
    },
    signResetPasswordToken: user => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.RESET_PASSWORD_KEY
            const options = {
                expiresIn: '1h',
                issuer: 'pickurpage.com',
                audience: user.id
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(createError.InternalServerError(err.message))

                resolve(token)
            })
        })
    },
    verifyResetPasswordToken: token => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.RESET_PASSWORD_KEY, (err, payload) => {
                if(err) reject(createError.Unauthorized())

                const userId = payload.aud
                resolve(userId)
            })
        })
    },
}