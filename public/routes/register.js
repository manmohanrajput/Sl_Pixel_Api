const express = require("express");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
const router = express.Router();
require('dotenv').config();

router.use(cookieParser());

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  router.post("/", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query("SELECT * FROM identities WHERE username=?", username, function (err, rows) {
          //console.log(rows);
          if (rows.length > 0) {
            res.send({rseult:"User name already exist"});
          } else {
            conn.query(`INSERT INTO identities ( username, password) VALUES ('${username}', '${password}')`, function (err) {
              if (err) {
                res.send({result:err});

              } else {
                res.send({result:"Sign up successfull"});
                console.log("Successfully inserted data");
              }
            })
          }
        })

        pool.releaseConnection(conn);
      }
    })
  });

module.exports = router;
