const mongoose = require("mongoose");
exports.module = mongoose
  .connect("mongodb://localhost/test")
  .then(() => console.log("Connected!"))
  .catch((e) => {
    console.log(e);
  });
