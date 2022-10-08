const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Role = require('../models/role');

router.put('/auth',async (req,res,next)=>{
    const data = req.body;
    try{
        let user = await User.create({
            username: data.username,
            password: data.password,
            gender: data.gender,
            email: data.email,
            imageUrl: data.imageUrl,
            roleId: 2
        });
        let role = await Role.findByPk(user.roleId);
        res.status(200).json({
            status: 200,
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

router.get('/auth',(req,res,next)=>{
    res.json({
        status: 200,
        message: 'User created in GET method'
    });
});


module.exports = router;