const http = require('http');
const express = require('express');

const app = express();

const db = require('./db');

const Role = require('./models/role');
const User = require('./models/user');
const init_assoc = require('./models/init_assoc');
init_assoc();

app.use(express.json());

const authRoute = require('./routes/auth');
app.use(authRoute);

app.use(async (req,res,next)=>{
    let user = await User.findOne();
    if(user == null){
        try{
            user = await User.create({
                username: 'Tony',
                password: 'wwewrew',
                email: 'frewrdf@soso.com',
                gender: 'male'
            });
        }catch(err){
            res.json({
                status: false,
                message: err.message
            });
            return;
        }
    }
    res.json({
        status: true,
        message: 'User fetched successfully',
        user: user
    });
});

const server = http.createServer(app);
//http://localhost:5000
db.sync().then(async result=>{
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
                permissions: "get:products,create:orders"
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
