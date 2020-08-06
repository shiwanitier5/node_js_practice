const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const jwttoken = require('jsonwebtoken');

const users = require('../models/login_user');

//function for adding or creating user in database
module.exports.create = async (req, res) => {
  if (!req.body.name || !req.body.username || !req.body.password) {
    res.status(400).send({
      status: 400,
      message: "Name or Username or Password can't be blank!!"
    });
  } else {
    console.log("req body", req.body)
    req.body.password = await bcrypt.hash(req.body.password, 10)//password encryption
    //email address validation 
    specificUser(req.body.username).then(User => {
      console.log("user", User)
      if (User.length != 0 && User.username == req.body.username) {
        res.status(409).send({
          status: 409,
          message: "Email address already exists in database!!"
        });
      } else {
        //creating user if no user found with the given email address
        createUser(req.body.name, req.body.username, req.body.password).then(User => {
          if (User) {

            res.send({ "status": 200, "results": User });
          } else {
            // next();
            res.send({ "status": 500, "message": "User can't be registered" });
          }
        }).catch(err => {

          res.send({ "status": 500, "message": "Something went wrong" });
        });
      }
    }).catch(err => {
      res.send({ "status": 500, "message": "Something went wrong" });
    });
  }
}
//function for getting a particular user by email from database
module.exports.getUserByEmail = (req, res) => {
  const body = req.body
  console.log("email", body)
  if (!req.body.username) {
    res.status(400).send({
      status: 400,
      message: "email field can't be empty"
    });
  } else {

    console.log("req body", req.body)

    specificUser(req.body.username).then(User => {
      if (User) {

        res.send({ "status": 200, "results": User });
      } else {
        // next();
        res.send({ "status": 404, "message": "No data found" });
      }
    }).catch(err => {
      res.send({ "status": 500, "message": "something went wrong" });
    });

  }

}
//function for getting all users from database
module.exports.getUsers = (req, res) => {
  allUser().then(User => {
    if (User) {

      res.send({ "status": 200, "results": User });
    } else {
      // next();
      res.send({ "status": 404, "message": "No data found" });
    }
  }).catch(err => {
    res.send({ "status": 500, "message": "something went wrong" });
  });
}
//function for updating user records into database
module.exports.Updatation = async function (req, res) {
  if (!req.body.name || !req.body.username || !req.body.password || !req.body.emailid) {
    res.status(400).send({
      status: 400,
      message: "Name or Username or Password can't be blank!! "
    });
  } else {

    console.log("req body", req.body)
    req.body.password = await bcrypt.hash(req.body.password, 10) //password encryption
    updateUser(req.body.name, req.body.username, req.body.password, req.body.emailid).then(User => {
      if (User) {

        res.send({ "status": 200, "message": "user Updated successfully" });
      } else {
        // next();
        res.send({ "status": 404, "message": "No user Found for the given email address" });
      }
    }).catch(err => {
      res.send({ "status": 500, "message": "something went wrong" });
    });

  }
}
//function for deleting user records from database
module.exports.Deletion = (req, res) => {
  console.log("coming")
  if (!req.body.username) {
    res.status(400).send({
      status: 400,
      message: "Content can't be empty"
    });
  } else {

    console.log("req body", req.body)
    deleteUser(req.body.username).then(User => {
      if (User) {

        res.send({ "status": 200, "message": "user Deleted successfully" });
      } else {
        // next();
        res.send({ "status": 404, "message": "No user Found for the given email address" });
      }
    }).catch(err => {
      res.send({ "status": 500, "message": "something went wrong" });
    });

  }
}
//function for user login
module.exports.UserLogin = (req, res) => {

  const body = req.body
  console.log("login", body)
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      status: 400,
      message: "username or password field can't be empty"
    });
  } else {

    console.log("req body", req.body)

    specificUser(req.body.username).then(User => {
      if (!User) {
        res.send({ "status": 401, "message": "Invalid Username or Password" });

      }
      const result = bcrypt.compare(req.body.password, User.password);
      console.log("password", result)
      console.log("token key", process.env.TOKEN_KEY);
      if (result) {
        User.password = undefined;
        const jsontoken = jwttoken.sign({ result: User }, process.env.TOKEN_KEY);
        res.send({
          "status": 200,
          "message": "User logged in successfully",
          "token": jsontoken
        });
      }
      else {
        res.send({ "status": 401, "message": "Invalid Username or Password" });
      }
    }).catch(err => {
      res.send({ "status": 500, "message": "something went wrong" });
    });

  }

}


//function for database operation to create user
async function createUser(name, username, password) {

  try {

      const userCreated = await users.create({
      name: name,
      username: username,
      password: password,

    })
    return userCreated;
  } catch (err) {
    throw new Error({ msg: "Something went wrong!" });
  }
}
//function for database operation to find a specific user by given email address
async function specificUser(username) {

  try {
    const specificUserFound = await users.findOne({
      where: {
        username: username,

      }
    })
    return specificUserFound;
  } catch (err) {
    throw new Error({ msg: "Something went wrong!" });
  }
}

//function for database operation to get all the users
async function allUser() {

  try {
    const allUserFound = await users.findAll()
    return allUserFound;
  } catch (err) {
    throw new Error({ msg: "Something went wrong!" });
  }
}
//function for database operation to update user record 
async function updateUser(name, username, password, emailid) {

  try {
    const userUpdated = await users.update({
      name: name,
      username: username,
      password: password,
    },
      {
        where: { username: emailid }
     })
    return userUpdated;
  } catch (err) {
    throw new Error({ msg: "Something went wrong!" });
  }
}
//function for database operation to delete user record
async function deleteUser(username) {
  console.log("coming here")

  try {
    const deletingUser = await users.destroy({
      where: {
        username: username,

      }
    })
    return deletingUser;
  } catch (err) {
    throw new Error({ msg: "Something went wrong!" });
  }
}