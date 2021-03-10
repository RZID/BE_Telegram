const jwt = require('jsonwebtoken')
const responser = require('../responser')
module.exports = {
    authentication: (req, res, next) => {
        const headers = req.headers
        if (!headers.token) {
            responser.unauthorized(res)
        } else {
            jwt.verify(headers.token, process.env.JWT_SECRET, (err) => {
                if (err) {
                    responser.unauthorized(res, err)
                } else {
                    next()
                }
            })
        }
    }
}