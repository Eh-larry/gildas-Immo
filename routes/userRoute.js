const { authMiddleware } = require('../config/authMiddleware')
const { register, login, verif } = require('../controller/userController')

const router = require('express').Router()

router.post('/sendEmail', register)

router.post('/login', login)


module.exports = router