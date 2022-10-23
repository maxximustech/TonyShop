const {DataTypes} = require("sequelize");
const db = require('../db');

const cart = db.define('Cart',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty:{
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
});

module.exports = cart;