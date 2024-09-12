const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: { type: String, lowercase: true },
  favorites: [String]
});

module.exports = mongoose.model("User", UserSchema);
