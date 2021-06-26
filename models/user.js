const mongoose = require('mongoose');
const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  _id: ObjectId,
  name: {
    type: String,
    required: true,
  },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
