const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const constants = require("../utils/constant");

const { Op } = require("sequelize");

router.put('/checkout',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('create:orders',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let carts = await Cart.findAll({
            where: {
                userId: req.User.id
            },
            include: [Product]
        });
        let items = [];
        let amount = 0;
        carts.forEach(cart=>{
            items.push({
                title: cart.Product.title,
                price: cart.Product.price,
                qty: cart.qty,
                imageUrl: cart.Product.imageUrl
            });
            amount += cart.Product.price * cart.qty;
        });
        let order = await Order.create({
            name: req.User.username,
            email: req.User.email,
            userId: req.User.id,
            items: JSON.stringify(items),
            ref: Math.floor(((Math.random() * 10) + 1)*1000)
                +"-"+Math.floor(((Math.random() * 10) + 1)*1000)
                +"-"+Math.floor(((Math.random() * 10) + 1)*1000)
                +"-"+Math.floor(((Math.random() * 10) + 1)*1000),
            amount: amount
        });
        await Cart.destroy({
            where: {
                userId: req.User.id
            }
        });
        return res.status(200).json({
            status: 200,
            message: 'Order created successfully',
            order: order
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.post('/order/:ref',async(req,res,next)=>{
    try{
        if(!authController.hasPermission('update:order-status',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let order = await Order.findOne({
            where:{
                ref: req.params.ref
            }
        });
        if(order == null){
            return res.status(404).json({
                status: 404,
                message: "Order could not be found"
            });
        }
        let status = +req.body.status || null;
        if(status == null){
            return res.status(400).json({
                status: 400,
                message: "Please specify the order status"
            });
        }
        if(typeof constants.orderStatus[+status] === 'undefined'){
            return res.status(400).json({
                status: 400,
                message: "Order status is not valid"
            });
        }
        await order.update({
            status: status
        });
        return res.status(200).json({
            status: 200,
            message: "Order status updated successfully"
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('/order/:ref',async(req,res,next)=>{
    try{
        if(!authController.hasPermission('get:orders',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let order = await Order.findOne({
            where:{
                ref: req.params.ref
            }
        });
        if(order == null){
            return res.status(404).json({
                status: 404,
                message: "Order could not be found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Order fetched successfully",
            order: order
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('/orders',async(req,res,next)=>{
    try{
        if(!authController.hasPermission('get:orders',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let orders = await Order.findAll({
            where:{
                userId: req.User.id
            }
        });
        return res.status(200).json({
            status: 200,
            message: "Orders fetched successfully",
            orders: orders
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('admin/orders',async(req,res,next)=>{
    try{
        if(!authController.hasPermission('access-all',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let orders = await Order.findAll();
        return res.status(200).json({
            status: 200,
            message: "Orders fetched successfully",
            orders: orders
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});

module.exports = router;