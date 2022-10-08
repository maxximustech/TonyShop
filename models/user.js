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
        validate: {
            isEmpty(value){
                if(typeof value === 'undefined' || value == null){
                    throw new Error('Username cannot be empty');
                }
            },
            isShort(value){
                if(value.length < 3){
                    throw new Error('Username too short');
                }
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        validate: {
            isEmpty(value){
                if(typeof value === 'undefined' || value == null){
                    throw new Error('Password cannot be empty');
                }
            },
            isShort(value){
                if(value.length < 3){
                    throw new Error('Password too short');
                }
            }
        }
    },
    email:{
        type: DataTypes.STRING,
        validate:{
            isEmpty(value){
                if(typeof value === 'undefined' || value == null){
                    throw new Error('Email address cannot be empty');
                }
            },
            isEmail: {
                msg: "Email is invalid"
            }
        }
    },
    gender:{
        type: DataTypes.STRING,
        defaultValue: 'male',
        validate: {
            isEmpty(value){
                if(typeof value === 'undefined' || value == null){
                    throw new Error('Gender cannot be empty');
                }
            },
            isGenderValid(value){
                let arr = ['male','female'];
                if(!arr.includes(value)){
                    throw new Error('Gender is invalid');
                }
            }
        }
    },
    imageUrl:{
        type: DataTypes.TEXT
    },
    roleId:{
        type: DataTypes.INTEGER,
        validate:{
            isEmpty(value){
                if(typeof value === 'undefined' || value == null){
                    throw new Error('Please select a role');
                }
            }
        }
    }
});

module.exports = user;