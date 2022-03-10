const mongoose = require("mongoose");
const validator = require("validator");

// modleing for users

const User = mongoose.model("User", {
  name: {
    type: String,
    requited: true,
    trim: true,
  },
  email: {
    type: String,
    requited: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can not contain the word password");
      }
    },
  },

  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
});

module.exports = User;
