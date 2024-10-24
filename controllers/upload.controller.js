const UserModel = require('../database/models/user.model');
const fs = require('fs');
const {promisify} = require('util');
const { uploadErrors } = require('../utils/errors.user.utils');
const pipeline = promisify(require('stream').pipeline);
const path = require('path');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => { 
            cb(null, path.join(__dirname, '../client/public/uploads/profil'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname); // Appel correct à Date.now()
        }
    })
});


exports.uploadProfil = [
    upload.single('file'),
    async (req, res, next) => {
      try {
        await UserModel.findByIdAndUpdate(
          req.body.userId,
          {$set: { picture: `/uploads/profil/${req.file.filename}` }},
          {new:true, upsert: true, setDefaultOnInsert: true},

        )
       
        res.status(200).send()
      } catch(e) {
        
        next(e);
      }
    }
  ]