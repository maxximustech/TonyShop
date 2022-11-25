const express = require('express');
const router = express.Router();

const productCategory = require('../models/product-category');
const Product = require('../models/product');
const Cart = require('../models/cart');
const authController = require('../controllers/auth');

router.put('/product/category',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('create:category',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let data = req.body;
        if(typeof data.name === 'undefined' || data.name == null || data.name.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please enter a category name'
            });
        }
        let slug = require('crypto').randomBytes(15).toString('hex');
        let [category, created] = await productCategory.findOrCreate({
            where: {
                name: data.name
            },
            defaults:{
                slug: slug
            }
        });
        if(!created){
            return res.status(200).json({
                status: 200,
                message: 'This category already exist',
                category: category
            });
        }else{
            return res.status(201).json({
                status: 201,
                message: 'Product category created successfully',
                category: category
            });
        }
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.post('/category/:slug',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('edit:category',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let data = req.body;
        if(typeof data.name === 'undefined' || data.name == null || data.name.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please enter a category name'
            });
        }
        let category = await productCategory.findOne({
            where:{
                slug: req.params.slug
            }
        });
        if(category == null){
            return res.status(404).json({
                status: 404,
                message: 'Category could not be found'
            });
        }
        await category.update({
            name: data.name
        });
        return res.status(200).json({
            status: 200,
            message: 'Category updated successfully',
            category: category
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.delete('/category/:slug',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('delete:category',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let category = await productCategory.findOne({
            where:{
                slug: req.params.slug
            }
        });
        if(category == null){
            return res.status(404).json({
                status: 404,
                message: 'Category could not be found'
            });
        }
        await category.destroy();
        return res.status(200).json({
            status: 200,
            message: 'Category deleted successfully'
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('/category',async (req,res,next)=>{
    try{
        let category = await productCategory.findAll({
            order: [
                ['id','DESC']
            ],
            include: typeof req.query.fetchProduct !== 'undefined' ? Product : undefined
        });
        
        return res.status(200).json({
            status: 200,
            message: 'Category fetched successfully',
            category: category
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.put('/product',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('create:products',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let data = req.body;
        if(typeof data.title === 'undefined' || data.title == null || data.title.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid title'
            });
        }
        if(typeof data.description === 'undefined' || data.description == null || data.description.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid description'
            });
        }
        if(typeof data.price === 'undefined' || data.price == null || +data.price <= 0){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid price'
            });
        }
        if(typeof data.category === 'undefined' || data.category == null || +data.category <= 0){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid category'
            });
        }
        let category = await productCategory.findOne({
            where:{
                id: data.category
            }
        });
        if(category == null){
            return res.status(404).json({
                status: 404,
                message: 'Product category does not exist'
            });
        }
        let product = await Product.create({
            title: data.title,
            description: data.description,
            slug: require('crypto').randomBytes(20).toString('hex'),
            price: data.price,
            categoryId: data.category,
            imageUrl: data.imageUrl,
            userId: req.User.id
        });
        return res.status(201).json({
            status: 201,
            message: 'Product created successfully',
            product: product
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.post('/product/:slug',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('edit:products',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let product = await Product.findOne({
            where: {
                slug: req.params.slug
            }
        });
        if(product == null){
            return res.status(404).json({
                status: 404,
                message: 'Product does not exist'
            });
        }
        if((product.userId !== req.User.id) && !authController.hasPermission('access-all',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to edit this product'
            });
        }
        let data = req.body;
        if(typeof data.title === 'undefined' || data.title == null || data.title.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid title'
            });
        }
        if(typeof data.description === 'undefined' || data.description == null || data.description.trim() === ''){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid description'
            });
        }
        if(typeof data.price === 'undefined' || data.price == null || +data.price <= 0){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid price'
            });
        }
        if(typeof data.category === 'undefined' || data.category == null || +data.category <= 0){
            return res.status(400).json({
                status: 400,
                message: 'Please add a valid category'
            });
        }
        let category = await productCategory.findOne({
            where:{
                id: data.category
            }
        });
        if(category == null){
            return res.status(404).json({
                status: 404,
                message: 'Product category does not exist'
            });
        }
        await product.update({
            title: data.title,
            description: data.description,
            price: data.price,
            categoryId: data.category,
            imageUrl: data.imageUrl
        });
        return res.status(200).json({
            status: 200,
            message: 'Product updated successfully',
            product: product
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.delete('/product/:slug',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('delete:products',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let product = await Product.findOne({
            where: {
                slug: req.params.slug
            }
        });
        if(product == null){
            return res.status(404).json({
                status: 404,
                message: 'Product does not exist'
            });
        }
        if((product.userId !== req.User.id) && !authController.hasPermission('access-all',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to edit this product'
            });
        }
        await product.destroy();
        return res.status(200).json({
            status: 200,
            message: 'Product deleted successfully'
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});
router.get('/products',async (req,res,next)=>{
    try{
        let products = await Product.findAll({
            order: [
                ['updatedAt','DESC']
            ]
        });
        
        return res.status(200).json({
            status: 200,
            message: 'Product fetched successfully',
            products: products
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
})

router.put('/product/:slug/cart',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('add-to-cart',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let product = await Product.findOne({
            where:{
                slug: req.params.slug
            }
        });
        if(product == null){
            return res.status(404).json({
                status: 404,
                message: 'Product does not exist'
            });
        }
        let qty = +req.body.qty || 1;
        let [cart, cartCreated] = await Cart.findOrCreate({
            where:{
                productId: product.id,
                userId: req.User.id
            },
            defaults:{
                qty: qty
            }
        });
        if(!cartCreated){
            await cart.update({
                qty: typeof req.body.refresh !== 'undefined'?qty:cart.qty + qty
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'Product added to cart successfully'
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});

router.delete('/product/:slug/cart',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('add-to-cart',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let product = await Product.findOne({
            where:{
                slug: req.params.slug
            }
        });
        if(product == null){
            return res.status(404).json({
                status: 404,
                message: 'Product does not exist'
            });
        }
        await Cart.destroy({
            where: {
                userId: req.User.id,
                productId: product.id
            }
        });
        return res.status(200).json({
            status: 200,
            message: 'Product removed from cart successfully'
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
});

router.delete('/cart',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('add-to-cart',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        await Cart.destroy({
            where: {
                userId: req.User.id
            }
        });
        return res.status(200).json({
            status: 200,
            message: 'Cart cleared successfully'
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
})

router.get('/cart',async (req,res,next)=>{
    try{
        if(!authController.hasPermission('add-to-cart',req)){
            return res.status(403).json({
                status: 403,
                message: 'You are not authorized to access this resource'
            });
        }
        let carts = await Cart.findAll({
            where:{
                userId: req.User.id
            },
            include: [Product],
            order: [
                ['updatedAt','DESC']
            ]
        });
        
        return res.status(200).json({
            status: 200,
            message: 'Cart fetched successfully',
            carts: carts
        });
    }catch(err){
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
})

module.exports = router;