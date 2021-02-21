const multer = require('multer')
const path = require('path')
const responser = require('../responser')
const limiterSize = 1
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/profile_user')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

const multerUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: limiterSize * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname)
        if ((/\.(jpe?g|png)$/i).test(extension)) {
            cb(null, true)
        } else {
            cb({
                message: 'File extension not allowed! [Please upload like: jpeg/jpg/png]',
                code: 'notMatchType'
            }, false)
        }
    }
})

const singleUpload = (req, res, next) => {
    const multerSingle = multerUpload.single('image')
    if (multerSingle) {
        multerSingle(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return responser.ise(res, `The file size is too large, please enter the file under ${limiterSize}MB`)
                } else if (err.code === 'notMatchType') {
                    return responser.ise(res, err.message)
                } else {
                    return responser.ise(res, err)
                }
            } else {
                next()
            }
        })
    } else {
        next()
    }
}
module.exports = { singleUpload }