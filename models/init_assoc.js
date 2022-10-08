const {DataTypes} = require("sequelize");
const db = require('../db');

const User = require('./user');
const Role = require('./role');

module.exports = ()=>{
    User.belongsTo(db.models.Role, {
        foreignKey: "roleId"
    });
    Role.hasMany(db.models.User, {
        foreignKey: "roleId"
    });
}