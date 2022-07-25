const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const md5 = require('md5');
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

router.post('/getprofile', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {

            // const Id = req.body.id;
            var user_name = req.body.username;

            conn.query(`SELECT * from identities where username="${user_name}"`, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send({ result: "err", Error: err });
                } else {
                    res.send({ result: data });
                }
            });
            pool.releaseConnection(conn);
        }

    }
    )
})

router.post('/addprofile', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            // const Id = req.body.id;
            var user_name = req.body.username;
            var password = md5(req.body.password);
            var email = req.body.email;
            var profile = req.body.profile_pic;
            conn.query(`INSERT INTO identities (username,password,email,profile_pic) VALUES ("${user_name}", "${password}","${email}","${profile}")`, function (err) {
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

router.post('/updateprofile', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            // const Id = req.body.id;
            var user_name = req.body.username;
            var email = req.body.email;
            var profile = req.body.profile_pic;
            conn.query(`UPDATE identities SET email="${email}",profile_pic="${profile}" WHERE username="${user_name}"`, function (err) {
                if (err) {
                    console.log(err);
                    res.send({ result: "err", Error: err });
                } else {
                    console.log("Successfully update data");
                    res.send({ result: "data update Successfully" });
                }
            });
            pool.releaseConnection(conn);
        }

    }
    )
})



module.exports = router;