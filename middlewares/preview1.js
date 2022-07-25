const axios = require('axios').default;
const mysql = require("mysql2");

const preview1 =  function (url,id,pswd,user_id1,res,obj1){

  const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });


axios.post('https://studio.pixelixe.com/api/graphic/automation/v2', {
    template_name: "CS-Design3",
    api_key: "dd8SrZnkmnXbzcjjVu9lTUPJylA2",
    format: "json",
    modifications: [{
        name: "header-image",
        type: "image",
        image_url: "default",
        width: "1080px",
        height: "185px",
        visible: "true"
      },
      {
        name: "center-image",
        type: "image",
        image_url: "default",
        width: "1080px",
        height: "801px",
        visible: "true"
      },
      {
        name: "footer-image",
        type: "image",
        image_url: "default",
        width: "1080px",
        height: "97px",
        visible: "true"
      },
      {
        name: "client-logo-url",
        type: "image",
        image_url: url,
        width: "800px",
        height: "154px",
        visible: "true"
      },
      {
        name: "zoom-id-pass",
        type: "text",
        text: "Meeting id:" + id + " | Password:" + pswd,
        color: "black",
        "font-size": "37px",
        visible: "true"
      }
    ]
  })
  .then(function(response) {

    // console.log(response);
    image = response.data.image_url;
    date = response.data.created_at;
    obj1.image = image;
    obj1.date = date;
    console.log("inside");
    console.log(obj1);
    console.log("inside");
    var obj = {
      user_id : user_id1,
      date : date,
      url : image
    }
    var values = Object.values(obj);
    pool.getConnection(function(err,conn){
      if(err){
        console.log(err);
      }else{
        conn.query("INSERT INTO marketing_data (user_id,date,url) VALUES ?", [[values]],function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Successfully inserted data");
          }
        })
        pool.releaseConnection(conn);
      }
    })
    // console.log(image);
    res.redirect("/form");
  })
  .catch(function(error) {
    console.log(error);
  });
}
  exports.preview1 = preview1;
