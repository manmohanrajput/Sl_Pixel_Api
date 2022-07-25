const express = require("express");
const mysql = require("mysql2");
app = express();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
const session = require('session');
const multer = require('multer');
const flash = require('express-flash')
const cors=require('cors');
const upload = multer({
  dest: 'public/uploads/'
});

require('dotenv').config();
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',  extended: true}));

// app.use(session());

app.use(cors());


const loginRoute = require("./routes/login");
const historyPost = require("./routes/historypost");
const registerRoute = require("./routes/register");
const signinRoute = require("./routes/signin");
const resetPasswordRoute = require("./routes/resetPassword");
const fileUploadRoute = require("./routes/fileUpload");
const profileRoute = require("./routes/profile");


const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};

// app.use(
//   session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
//   })
// );

// app.use(flash());

const { verifyUser } = require("./middlewares/verifyUser");




app.use("/", loginRoute);
app.use("/addHistory",historyPost);
app.use("/register", registerRoute);
app.use("/apisignin",signinRoute)
app.use("/apiresetpassword",resetPasswordRoute)
app.use("/apifileUpload",fileUploadRoute)
app.use("/apiprofile",profileRoute)

app.get("/logout", function (req, res) {
  res.json("/");
})

const PORT =  3200;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
})
