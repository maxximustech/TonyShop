const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('tony-shop','tony-shop','Tony4321',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;