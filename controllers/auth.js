const express = require('express');

const isAuth = (req, res, next)=> {
    if (typeof req.User === "undefined" || req.User == null) {
        res.status(401).json({
            status: 401,
            message: 'You are not authenticated'
        });
    }
}

exports.isAuth = isAuth;

exports.hasPermission = (perm, req)=>{
    if(typeof req.User === 'undefined'){
        return false;
    }
    let userPerm = req.User.Role.permissions.split(',');
    if(!userPerm.includes(perm) && !userPerm.includes('access-all')){
        return false;
    }
    return true;
}