const http = require('http');
const express = require('express');
const db = require('./db');

const User = require('./models/user');

const app = express();
app.use(async (req,res,next)=>{
    let user = await User.findOne();
    if(user == null){
        user = await User.create({
            username: 'Tony',
            password: 'wwewrew',
            email: 'frewrdf',
            gender: 'gay'
        });
    }
});

const server = http.createServer(app);
//http://localhost:5000
db.sync().then(result=>{
    server.listen(5000);
}).catch(err=>{
    console.log(err);
});
