const express = require("express");
const mysql = require("mysql2");
const router = express.Router();
const { verifyUser } = require("../middlewares/verifyUser");
require('dotenv').config();

var flag = 1; // 1 for wrong key
var image = " "; // stores image url of the generated image
var date; // stored date at which the image is created
const KEY = "12345678"; //for authentication in form
var count = 0; // helping variable to change the value of flag
var flag_n = 0; //if 0 then on refresh redirect to preview page

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.post('/', verifyUser, async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
          
            const userId = req.user.user_id1;
            const dates = req.body.date;
            const urls = req.body.url;
            conn.query(`INSERT INTO marketing_data (user_id,date,url) VALUES (${userId}, "${dates}", "${urls}")`, function (err) {
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

router.get('/gethistory', verifyUser, async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
          
            const userId = req.user.user_id1;
            conn.query(`SELECT * from marketing_data where user_id=${userId}`, function (err , data) {
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



module.exports = router;