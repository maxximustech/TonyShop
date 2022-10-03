const {DataTypes} = require("sequelize");
const db = require('../db');

const user = db.define('User',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isShort(value){
                if(value.length < 5){
                    throw new Error('Username too short');
                }
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isEmail: {
                msg: "Email is invalid"
            }
        }
    },
    gender:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'male',
        validate: {
            isGenderValid(value){
                let arr = ['male','female'];
                if(!arr.includes(value)){
                    throw new Error('Gender is invalid');
                }
            }
        }
    }
});

module.exports = user;