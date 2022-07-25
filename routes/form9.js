const express = require("express");
const mysql = require("mysql2");
// const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const cookieParser = require("cookie-parser");
const moment = require('moment');
const aws = require('aws-sdk');
const multer = require('multer');
//aws credentials
const multerS3 = require('multer-s3');
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: "ap-south-1"
});
const s3 = new aws.S3();

//storing data on aws-s3

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'speedlabs',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, "pixels/" + Date.now().toString())
    }
  })
})

//require verifyUser function

const {verifyUser} = require("../middlewares/verifyUser");
require('dotenv').config();

router.use(cookieParser());

// router.set('view engine', 'ejs');
router.use(express.urlencoded({
  extended: true
}));


const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

var flag = 1; // 1 for wrong key
var image = " "; // stores image url of the generated image
var date; // stored date at which the image is created
const KEY = "12345678"; //for authentication in form
var count = 0; // helping variable to change the value of flag
var flag_n = 0; //if 0 then on refresh redirect to preview page



// const singleUpload = upload.single("img")

router.post("/",verifyUser, upload.single("img"), function (req, res) {
  var key = "12345678";
  var url_image = req.body.url;
  var image_type = req.body.image_type;
  var h_logo = req.body.h_logo;
  var w_logo = req.body.width_div;
  var date = moment(req.body.date, 'YYYY-MM-DD').format("DD-MMM");
  var time = req.body.time;
  var ar = req.body.aspect_ratio;
  // var instituteName = req.body.instituteName;
  // var logo_name = req.body.logo;
  var logo_source = req.body.logo_source;
  var id = req.body.id;
  var pswd = req.body.password;
  var middle_url = req.body.middle_url;
  var footer_url = req.body.footer_url;
  var phone=req.body.phone;
  var address=req.body.address;
  var instagram=req.body.instagram;
  var facebook=req.body.facebook;
  var website=req.body.website;

  if (req.file) {
    var path = req.file.location;
  }
  console.log("Live Session - Prize")
  obj = {
    middle_url, date, time, id, pswd
  }
  console.log("obj", obj)

  var url;
  var n_h_logo = "";
  var n_w_logo = (w_logo > 150.047) ? "150.047" : w_logo;
  if (key === KEY) {
    //console.log(url);
    if (logo_source === "") {
      url = "";
    } else {
      if (url_image) {
        url = url_image;
        console.log(ar)
        n_h_logo = n_w_logo / ar;
        console.log(url, n_w_logo, n_h_logo)
      } else if (path) {
        url = path;
        n_h_logo = n_w_logo / ar;
        console.log(url, n_w_logo, n_h_logo)
      }
    }



    //footer -> zoom

    //api post
    axios.post('https://studio.pixelixe.com/api/graphic/automation/v2', {
      "document_uid": "c101301e9243504be55a1b09bc0be629",
      "api_key": "dd8SrZnkmnXbzcjjVu9lTUPJylA2",
      "format": "json",
      "image_type": "jpeg",
      "modifications": [
          {
              "name": "bg-img",
              "type": "image",
              "image_url": middle_url,
              "width": "1072.44px",
              "height": "1072.44px",
              "visible": "true"
          },
          {
              "name": "image-1",
              "type": "image",
              "image_url": url,
              "width": n_w_logo,
              "height": "auto",
              "visible": "true"
          },
          {
              "name": "phone",
              "type": "text",
              "text": phone,
              "color": "rgb(41, 148, 210)",
              "font-size": "19px",
              "visible": "true"
          },
          {
              "name": "address",
              "type": "text",
              "text": address,
              "color": "rgb(41, 148, 210)",
              "font-size": "19px",
              "visible": "true"
          },
          {
              "name": "facebook",
              "type": "image",
              "image_url": "default",
              "width": "31.9922px",
              "height": "31.9922px",
              "visible": facebook
          },
          {
              "name": "instagram",
              "type": "image",
              "image_url": "default",
              "width": "31.9922px",
              "height": "31.9922px",
              "visible": instagram
          },
          {
              "name": "website",
              "type": "image",
              "image_url": "default",
              "width": "31.9922px",
              "height": "31.9922px",
              "visible": website
          }
      ]
  }).then(function (response) {
      // console.log(response);
      image = response.data.image_url;
      date = response.data.created_at;
      //store activity of user in database
      var obj = {
        user_id: req.user.user_id1,
        date: date,
        url: image
      }
      var values = Object.values(obj);
      pool.getConnection(function (err, conn) {
        if (err) {
          console.log(err);
        } else {
          conn.query("INSERT INTO marketing_data (user_id,date,url) VALUES ?", [
            [values]
          ], function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully inserted data");
            }
          })
          pool.releaseConnection(conn);
        }
      })
      flag_n = 1;
      res.json(image);
    })
      .catch(function (error) {
        console.log(error);
      });


  } else {
    flag = 0;
    res.json("/form9");
  }

});

module.exports = router;