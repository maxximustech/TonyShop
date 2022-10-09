const http = require('http');
const express = require('express');
const useragent = require('express-useragent');
const jwt = require("jsonwebtoken");

const app = express();

const db = require('./db');

const Role = require('./models/role');
const User = require('./models/user');
const Session = require('./models/session');

const init_assoc = require('./models/init_assoc');
init_assoc();

app.use(express.json());
app.use(useragent.express());

const authRoute = require('./routes/auth');

app.use(async (req,res,next)=>{
    let token = req.header('Authorization');
    if(typeof token === "undefined" || token == null){
        next();
        return;
    }
    let jwtSecret = 'Anthony secret key';
    let data;
    jwt.verify(token, jwtSecret, (err, decoded)=>{
        if(err){
            next();
            return;
        }
        data = decoded;
    });
    let session = await Session.findOne({
        where:{
            userId: data.userId,
            validator: data.validator
        },
        include: [{
            model: User,
            include: [Role]
        }]
    });
    if(session == null){
        next();
        return;
    }
    let expiresIn = new Date(session.expiresIn).getTime();
    if(expiresIn < Date.now()){
        await session.destroy();
        next();
        return;
    }
    req.User = session.User;
    next();
});

app.use(authRoute);

const server = http.createServer(app);
//http://localhost:5000
db.sync({
    force: true
}).then(async result=>{
    try{
        let [admin, createdAdmin] = await Role.findOrCreate({
            where:{
                name: 'Admin'
            },
            defaults:{
                permissions: "access-all"
            }
        });
        let [customer, createdCustomer] = await Role.findOrCreate({
            where:{
                name: 'Customer'
            },
            defaults:{
                permissions: "get:products"
            }
        });
        let [vendor, createdVendor] = await Role.findOrCreate({
            where:{
                name: 'Vendor'
            },
            defaults:{
                permissions: "create:products"
            }
        });
        let [user, createdUser] = await User.findOrCreate({
            where:{
                username: 'Tony',
            },
            defaults:{
                password: 'wwewrew',
                email: 'frewrdf@soso.com',
                gender: 'male',
                roleId: customer.id
            }
        });
        server.listen(5000);
    }catch(err){
        console.log(err);
    }
}).catch(err=>{
    console.log(err);
});
