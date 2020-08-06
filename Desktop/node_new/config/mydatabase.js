const db={};
const dotenv=require('dotenv').config();



const { Sequelize } = require('sequelize');

//database creation using sequelize
const sequelize = new Sequelize(process.env.MYSQL_DB,process.env.DB_USER,process.env.DB_PASS,{
    host:process.env.DB_HOST,
    port:3306,
    dialect: 'mysql'
  });

  try {
    //checking authentication
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  module.exports = db;