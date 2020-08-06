const dotenv=require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const createError=require('http-errors');
const morgan=require('morgan');
const port=process.env.APP_PORT || 3000;
const usersRouter = require('./routes/user.router');
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.use('/users', usersRouter);
app.use((req,res,next) => {

  next(createError(404,"Request Not Found"));
})
app.use((err,req,res,next) => {
res.status(err.status || 500)
console.log(err.status)
res.json({
  error:{
  status:err.status,
  message:err.message
  }
})

})

app.listen(port, function() {
  console.log('Express server listening on port ',port);
});

module.exports = app;

