const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

//const upload = multer({dest: 'uploads/'});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../uploads'));//
    },
    filename: function (req, file, cb) {
        let ext1 = file.originalname.split('.');
        let ext = ext[ext1.length - 1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+'.'+ext);
    }
  })
const upload = multer({ storage: storage })

router.put('/upload',upload.single('avatar'),async(req,res,next)=>{
    console.log(req.file);
});

module.exports = router;