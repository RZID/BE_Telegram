const model = require('../model/chat')

module.exports = {
    getUsers (from) {
        return new Promise((resolve, reject) => {
            model.getUsers(from).then((res) => {
                resolve(res.filter(el => { return el.from_chat == from || el.from_chat == from }))
            }).catch((err) => {
                reject(err.message)
            })
        })
    }
}

