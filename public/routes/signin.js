
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const { verifyUser } = require("../middlewares/verifyUser");
require('dotenv').config();


const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.post('/signin', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var user_name = req.body.username;
      conn.query("SELECT * FROM identities WHERE username=?", user_name, function (err, data) {
        if (err) {
          console.log(err);
          res.send({ result: "err", Error: err });
        } else {
          res.send({ result: data });
        }
      });
      pool.releaseConnection(conn);
    }
  })

});

router.post('/addsignin', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {

      var ids = req.body.id;
      var user_name = req.body.username;
      var pass = req.body.password;
      var mail_id = req.body.email;
      conn.query(`INSERT INTO identities (id,username, password, email) VALUES ('${ids}' , '${user_name}', '${pass}','${mail_id}')`, function (err) {
        if (err) {
          console.log(err);
          res.send({ result: "err", Error: err });
        } else {
          console.log("Successfully inserted data");
          res.send({ result: "data inserted Successfully" });
        }
      });
      pool.releaseConnection(conn);
    }

  }
  )


})

module.exports = router;