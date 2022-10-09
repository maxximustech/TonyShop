const {DataTypes} = require("sequelize");
const db = require('../db');

const User = require('./user');
const Role = require('./role');
const Session = require('./session');
const productCategory = require('./product-category');
const Product = require('./product');

module.exports = ()=>{
    User.belongsTo(db.models.Role, {
        foreignKey: "roleId"
    });
    Role.hasMany(db.models.User, {
        foreignKey: "roleId"
    });
    Session.belongsTo(db.models.User,{
        foreignKey: "userId"
    });
    User.hasMany(db.models.Session,{
        foreignKey: "userId"
    });
    Product.belongsTo(db.models.productCategory,{
        foreignKey: "categoryId"
    });
    productCategory.hasMany(db.models.Products,{
        foreignKey: "categoryId"
    });
}