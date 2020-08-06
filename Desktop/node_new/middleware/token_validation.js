const jwttoken = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//function for jwttoken validation
module.exports.checkToken = (req, res, next) => {
    let token = req.get("authorization");
    console.log("token", token);
    if (token) {
        token = token.slice(7);
        jwttoken.verify(token, process.env.TOKEN_KEY, (err, decoded) => {

            if (err) {
                console.log(err)
                res.json({
                    status: 401,
                    message: "Invalid token"
                })
            } else {
                console.log("decoded token", decoded)
                next();
            }
        });
    } else {
        res.json({
            status: 401,
            message: "Access denied! Unauthorized user"
        })
    }
}
