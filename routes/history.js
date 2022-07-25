const express=require('express');
const Router=express.Router();
const mysql=require('mysql2')
const cookieParser=require('cookie-parser')
const { verifyUser } = require("../middlewares/verifyUser");
require('dotenv').config();

// MySQL
// const pool =require('../config/config');
 const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
   });

   Router.use(cookieParser());


Router.use(express.urlencoded({
  extended: true
}));

    Router.post('',verifyUser,async(req, res) => {
        pool.getConnection((err, connection) => {
            if(err) throw err
            // console.log('connected as id ' + connection.threadId)
            
            const user_id=req.user.user_id1;
            
            // console.log(user_id)
            const offset=req.body.offset;
            const limit=req.body.limit;
            // console.log(limit)
            connection.query(`select count(user_id) as user_count from marketing_data where user_id=${user_id}`,(err,user1)=>{
                // res.json(user[0].user_count)
                if(user1[0].user_count>0){
                    connection.query(`SELECT * from marketing_data where user_id=${user_id} order by date DESC LIMIT ${limit} OFFSET ${offset}`, (err, rows) => {
                        connection.release() // return the connection to pool
                        if (!err) {
                            const result=rows
                            if(result){
                              res.send(result)
                            }
                            else{
                                res.send("");
                            }
                        } else {
                            res.status(400).send(err)
                            console.log(err)
                        }
                        // console.log('The data from beer table are: \n', rows)
                    })
                }
                else{
                    res.send("");
                }
            })
            
            
        })
    })

module.exports=Router;