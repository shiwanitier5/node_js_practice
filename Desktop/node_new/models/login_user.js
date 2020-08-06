'use strict';
const Sequelize = require('sequelize');


const db = require("../config/mydatabase.js");

const Users = db.sequelize.define('users', {
  // Model attributes are defined here
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true
   
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
 
});



module.exports = Users;