const {DataTypes} = require("sequelize");
const db = require('../db');

const productCategory = db.define('productCategory',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    slug:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = productCategory;