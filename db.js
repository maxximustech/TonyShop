const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('tony_shop','root','Maxximus2013',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;