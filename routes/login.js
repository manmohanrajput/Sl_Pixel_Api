
const express = require("express");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
const router = express.Router();
require('dotenv').config();

router.use(cookieParser());

// router.set('view engine', 'ejs');
router.use(express.urlencoded({
  extended: true
}));
// router.use(express.static("public"));

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// generate access token
const generateAccessToken =(username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET);
};



router.post("/", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
 
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
    } else {
      //check credentials in database
      conn.query("SELECT * FROM identities WHERE username=?", username, function (err, rows) {
        //console.log(rows);
        if (rows.length > 0) {
          if (rows[0].password === password) {
            // console.log("User Found");
            const user_id1 = rows[0].id;

            //generate token
            const token = generateAccessToken({ username, user_id1 });
            
            res.json({login:true,token:token,user_id:user_id1, msg:"Login successfull"});
          } else {
            console.log("incorrect password");
            res.send({login:false, msg:"Incorrect password"});
          }
        } else {
          res.send({login:false, msg:"User not found"});
        }
      })
      pool.releaseConnection(conn);
    }
  })
});


module.exports = router;
