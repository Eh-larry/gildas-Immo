const { authMiddleware } = require('../config/authMiddleware')
const { upload } = require('../config/multerConfig')
const { postProperty, getProperties, deleteOne } = require('../controller/propertyController')

const router = require('express').Router()

router.post('/postProperty', authMiddleware , upload.array('images'), postProperty)

router.get('/getProperties', getProperties)

router.get('/deleteOne', authMiddleware , deleteOne)


module.exports = router