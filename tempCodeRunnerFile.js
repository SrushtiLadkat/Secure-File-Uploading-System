Home route
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