const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

// Multer settings
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/myupload");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({
  storage: storage
}).single("profilepic");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("./public"));

// Home route
app.get("/", (req, res) => {
  fs.readdir("./public/myupload", (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("index", { files: files });
    }
  });
});
// Home route
// app.get("/", (req, res) => {
//   res.render("index");
// });


// Upload route
app.post("/upload", (req, res) => {
  upload(req, res, error => {
    if (error) {
      res.render("index", {
        message: error
      });
    } else {
        res.render('index',{
            message: '',
            filename: `myupload/${req.file.filename}`
        });
    }
  });
});

// View uploaded files route
app.get("/files", (req, res) => {
  fs.readdir("./public/myupload", (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("files", { files: files });
    }
  });
});


app.post('/delete/:filename', (req, res) => {
  let { filename } = req.params;
  const filePath = `uploads/${filename}`;

  // Normalize filename to lowercase
  filename = filename.toLowerCase();

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      if (err.code === 'ENOENT') {
        return res.status(404).send('File not found');
      }
      return res.status(500).send('Failed to delete file');
    }
    res.redirect('/files'); // Redirect to the files page after deletion
  });
});




app.listen(port, () => {
  console.log("Server Running at " + port + "....");
});
