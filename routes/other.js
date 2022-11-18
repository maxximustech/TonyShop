const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({dest: 'uploads/'});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, req.User.username + '-' + uniqueSuffix);
    }
  })
const upload = multer({ storage: storage })

router.put('/upload',upload.single('avatar'),async(req,res,next)=>{
    console.log(req.file);
});

module.exports = router;