const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: '../uploads/'});

router.put('/upload',upload.single('avatar'),async(req,res,next)=>{
    console.log(req.file);
});

module.exports = router;