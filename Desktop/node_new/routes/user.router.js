const User_Management= require('../controller/user');

const router= require('express').Router();
const middleware= require("../middleware/token_validation");

router.post("/addUser",User_Management.create);
router.get("/getUsers",middleware.checkToken,User_Management.getUsers);
router.post("/getUserByEmail",middleware.checkToken,User_Management.getUserByEmail);
router.post("/updateUser",middleware.checkToken,User_Management.Updatation);
router.post("/deleteUser",middleware.checkToken,User_Management.Deletion);
router.post("/userLogin",User_Management.UserLogin);




module.exports= router;