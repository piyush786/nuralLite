const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

 const userMdl = new Schema({
  _id: ObjectId,
  name: { type: String },
  email: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

exports.module =  mongoose.model('userMdl', userMdl);