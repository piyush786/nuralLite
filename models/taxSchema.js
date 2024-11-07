// const mongoose = require('mongoose');

// const taxSchema = new mongoose.Schema({
//   hsnCode: { type: String, required: true },
//   description: { type: String, required: true },
//   cgst: { type: Number, required: true },
//   sgst: { type: Number, required: true },
//   igst: { type: Number, required: true },
//   utgst: { type: Number, required: true },
// });

// module.exports = mongoose.model('Tax', taxSchema);

const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  hsnCode: { type: String, requried: true },
  description: { type: stringTag, required: true },
  cgst: { type: Number },
  sgst: { type: Number },
  igst: { type: Number },
  utgst: { type: Number },
});

module.exports = mongoose.model("Tax", taxSchema);
