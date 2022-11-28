const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const authController = require('../controllers/auth');

//const upload = multer({dest: 'uploads/'});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!authController.hasPermission('upload-image',req)){
            return;
        }
        cb(null, path.join(__dirname,'../public/uploads'));//
    },
    filename: function (req, file, cb) {
        if(!authController.hasPermission('upload-image',req)){
            return;
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix+'-'+file.originalname);
    }
  })
const upload = multer({ storage: storage })

router.put('/upload',upload.single('avatar'),async(req,res,next)=>{
    //console.log(req.file.path);
    //res.json({status: 200});
    try{
        if(!authController.hasPermission('upload-image',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        if(typeof req.file === 'undefined'){
            return res.status(400).json({
                status: 400,
                message: 'No file uploaded'
            });
        }
        res.status(201).json({
            status: 201,
            message: 'File uploaded successfully',
            path: 'uploads/'+req.file.filename
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('/verify-payment/:ref',async(req,res,next)=>{
    try{
        if(typeof req.User === 'undefined'){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        fetch('https://api.paystack.co/transaction/verify/'+req.params.ref,{
            headers: {
                Authorization: 'Bearer '+process.env.PAYSTACK_SECRET_KEY
            },
            port: 443,
        }).then(response=>{
            return response.json();
        }).then(data=>{
            if(typeof data.data === 'undefined'){
                return res.status(400).json({
                    status: 400,
                    message: data.message
                }); 
            }
            if(data.data.status === 'failed'){
                return res.status(412).json({
                    status: 412,
                    message: data.gateway_response
                }); 
            }
            if(data.data.status === 'success'){
                return res.status(200).json({
                    status: 200,
                    message: 'Transaction reference fetched successfully',
                    reference: data
                }); 
            }
            return res.status(422).json({
                status: 422,
                message: 'Not processable'
            });
        }).catch(err=>{
            return res.status(500).json({
                status: 500,
                message: err.message
            });
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
})

module.exports = router;