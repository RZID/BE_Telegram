const express = require('express')
const Router = express.Router()
const { authentication } = require('../helper/middleware/auth')
const { singleUpload } = require('../helper/middleware/addProfile')
const { login, register, getUserData, setProfile, setName, getUser } = require('../controller/user')
Router
    .post('/login', login)
    .post('/register', register)
    .post('/user', authentication, getUserData)
    .post('/setProfile', authentication, singleUpload, setProfile)
    .post('/changeName', authentication, setName)
    .get('/find', authentication, getUser)
module.exports = Router