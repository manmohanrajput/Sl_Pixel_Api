const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const express=require('express');
const app=express();
app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  // // console.log(req.headers.authorization)
  // const token = req.headers.authorization;


  // // token=window.localStorage.getItem(user_id1);

  // if (!token) {
  //   // return res
  //   //   .status(401)
  //     // .send("Yo, we need a token please give it to me next time.");
  //   console.log(token);
  //   res.json("/");
  // }

  // jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
  //   if (err) {
  //     console.log(err);
  //     // return res.status(400).send("Oops! auth Failed");
  //     res.json("/");
  //   }

  //   req.user = decoded;
  //   console.log('user',req.user);
  //   next();
  // });
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken,  process.env.TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode;
      console.log("user is",req.user);
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
};

exports.verifyUser = authenticateToken;
