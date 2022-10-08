const {DataTypes} = require("sequelize");
const db = require('../db');

const role = db.define('Role',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    permissions:{
        type: DataTypes.TEXT,
        allowNull: false
    }
});


module.exports = role;