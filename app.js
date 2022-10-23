const http = require('http');
const express = require('express');
const useragent = require('express-useragent');
const jwt = require("jsonwebtoken");

const app = express();

const db = require('./db');
const constant = require('./utils/constant');

const Role = require('./models/role');
const User = require('./models/user');
const Session = require('./models/session');

const init_assoc = require('./models/init_assoc');
init_assoc();

app.use(express.json());
app.use(useragent.express());

const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

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
app.use(productRoute);

const server = http.createServer(app);
//http://localhost:5000
db.sync({
    //force: true
}).then(async result=>{
    try{
        let [admin, createdAdmin] = await Role.findOrCreate({
            where:{
                name: 'Admin'
            },
            defaults:{
                permissions: constant.adminPermissions
            }
        });
        if(!createdAdmin){
            await admin.update({
                permissions: constant.adminPermissions
            });
        }
        let [customer, createdCustomer] = await Role.findOrCreate({
            where:{
                name: 'Customer'
            },
            defaults:{
                permissions: constant.customerPermissions
            }
        });
        if(!createdCustomer){
            await customer.update({
                permissions: constant.customerPermissions
            });
        }
        let [vendor, createdVendor] = await Role.findOrCreate({
            where:{
                name: 'Vendor'
            },
            defaults:{
                permissions: constant.vendorPermissions
            }
        });
        if(!createdVendor){
            await vendor.update({
                permissions: constant.vendorPermissions
            });
        }
        let bcrypt = require('bcryptjs');
        let [user, createdUser] = await User.findOrCreate({
            where:{
                username: 'Tony',
            },
            defaults:{
                password: bcrypt.hashSync('12345', bcrypt.genSaltSync(14)),
                email: 'frewrdf@soso.com',
                gender: 'male',
                roleId: admin.id
            }
        });
        server.listen(5000);
    }catch(err){
        console.log(err);
    }
}).catch(err=>{
    console.log(err);
});
