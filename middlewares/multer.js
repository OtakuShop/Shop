const multer = require('multer')
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch');
let usuario = localStorage.getItem("usuario")
module.exports = (
    multer({
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, './public/images/avatar')
            },
            filename: function(req, file, cb) {
                let size = file.originalname.length
                if (file.originalname.match(/png/) || file.originalname.match(/jpg/)) {
                    cb(null, "user_" + usuario + file.originalname.substring(size - 4, size))
                } else {
                    cb(null, "user_" + usuario + file.originalname.substring(size - 5, size))
                }
            }
        }),
        fileFilter: (req, file, cb) => {
            const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(
                formatoAceito => formatoAceito == file.mimetype
            );
            if (extensaoImg) {
                return cb(null, true)
            }
            return cb(null, false)
        }
    })
)