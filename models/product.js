const {DataTypes} = require("sequelize");
const db = require('../db');

const product = db.define('Product',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING
    },
    slug:{
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    categoryId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageUrl:{
        type: DataTypes.TEXT
    }
});

module.exports = product;