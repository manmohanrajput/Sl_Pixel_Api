const express = require("express");
const mysql = require("mysql2");
app = express();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const cors=require('cors');
const upload = multer({
  dest: 'public/uploads/'
});

require('dotenv').config();
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));
app.use(cors());



const loginRoute = require("./routes/login");
const historyPost = require("./routes/historypost");
const registerRoute =require("./routes/register");
const signinRoute =require("./routes/signin");

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};


const { verifyUser } = require("./middlewares/verifyUser");

app.use("/", loginRoute);
app.use("/addHistory",historyPost);
app.use("/register", registerRoute);
app.use("/apisignin",signinRoute)

app.get("/logout", function (req, res) {
  res.json("/");
})

const PORT = 3200;
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
})
