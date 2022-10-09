const {DataTypes} = require("sequelize");
const db = require('../db');

const session = db.define('Session',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    validator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userAgent: {
        type: DataTypes.TEXT
    },
    expiresIn: {
        type: DataTypes.DATE
    }
});

module.exports = session;