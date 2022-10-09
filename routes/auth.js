const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const router = express.Router();

const User = require('../models/user');
const Role = require('../models/role');
const Session = require('../models/session');

router.put('/auth',async (req,res,next)=>{
    const data = req.body;
    try{
        if(typeof data.password === "undefined" || data.password == null){
            res.status(400).json({
                status: 400,
                message: 'Password cannot be empty'
            });
            return;
        }
        if(data.password.trim().length < 5){
            res.status(400).json({
                status: 400,
                message: 'Password is too short'
            });
            return;
        }
        let hashedPass = bcrypt.hashSync(data.password, bcrypt.genSaltSync(14));
        let user = await User.create({
            username: data.username,
            password: hashedPass,
            gender: data.gender,
            email: data.email,
            imageUrl: data.imageUrl,
            roleId: 2
        });
        let role = await Role.findByPk(user.roleId);
        res.status(201).json({
            status: 201,
            message: 'User created successfully',
            user: user,
            permission: role.permissions
        });
    }catch(err){
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.post('/auth',async (req,res,next)=>{
    try{
        let data = req.body;
        if(typeof data.username === 'undefined' || typeof data.password === "undefined" || data.username == null ||  data.password == null){
            res.status(400).json({
                status: 400,
                message: 'Please input required field'
            });
            return;
        }
        let user = await User.findOne({
            where:{
                username: data.username
            }
        });
        if(user == null || !bcrypt.compareSync(data.password, user.password)){
            res.status(401).json({
                status: 401,
                message: 'Username or password is incorrect'
            });
            return;
        }
        let validator = require('crypto').randomBytes(10).toString('hex');
        let jwtSecret = 'Anthony secret key';
        let jwtToken = jwt.sign({
            userId: user.id,
            validator: validator
        },jwtSecret);
        let session = await Session.create({
            userId: user.id,
            validator: validator,
            ipAddress: req.ip,
            userAgent: JSON.stringify(req.useragent),
            expiresIn: new Date(Date.now() + (7200 * 1000))
        });
        res.json({
            status: 200,
            message: 'User logged in successfully',
            user: user,
            token: jwtToken
        });
    }catch(err){
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});


module.exports = router;