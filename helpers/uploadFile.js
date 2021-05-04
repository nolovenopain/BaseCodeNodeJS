const multer = require('multer')

var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            const extend = file.originalname.split('.')
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extend[1])
        }
    }
)

module.exports = {
    uploadSingle: multer(
        { storage },
        {
            limits: {
                fileSize: 1000000
            },
            fileFilter(req, file, cb) {
                if(!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/))
                return cb(new Error('This is not a correct format of the file'))
                cb(undefined, true)
            }
        }
    )
}