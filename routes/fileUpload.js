const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');


aws.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'ap-south-1',
})

// const BUCKET = process.env.S3_BUCKET
// var s3Bucket = new aws.S3( { params: {Bucket: 'admintestbuckets', Key:"Name.jpeg"} } );
// const s3 = new aws.S3();
// const upload = multer({
//     storage: multerS3({
//         bucket: BUCKET,
//         s3: s3,
//         acl: "public-read",
//         key: (req, file, cb) => {
//             cb(null, file.originalname);
//         }

//     })
// })

router.post("/upload", (req, res) => {

  const d = new Date();
  let time = d.getTime();
  const newFileName = `SLpixel_${time}.jpg`;
  var s3Bucket = new aws.S3({ params: { Bucket: 'admintestbuckets', Key: newFileName } });

  var buf = Buffer.from(req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')

  var data = {
    Key: req.body.userId,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };
  s3Bucket.putObject(data, function (err, data) {
    if (err) {
      console.log(err);
      res.send({ flag: 0, url: '' });
      console.log('Error uploading data: ', data);
    } else {
      res.send({ flag: 1, url: `https://admintestbuckets.s3.ap-south-1.amazonaws.com/${newFileName}` });
    }
  });
})

router.get("/list", async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise()
  let x = r.Contents.map(item => item.Key);
  res.send(x)
})

router.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename
  let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise()
  // let x=r.Contents.map(item=>item.Key);
  res.send(x)
})

router.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise()
  res.send("File delete")

})

module.exports = router;