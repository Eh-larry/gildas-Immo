const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error('Seulement les images sont acceptées'))
        }
        cb(null, true)
    }
})

module.exports = {upload}