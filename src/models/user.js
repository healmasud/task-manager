const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

// schema for user

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requited: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

// genarating public profile to hide hased password and tokens from loggedin user

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// genarate auth tokens

userSchema.methods.generateAuthToken = async function () {
  const user = this; // easy to navigate the code
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewapp"); // secret 'thisismynewapp'
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// login to userSchema

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// hash the plain text password before saving

userSchema.pre("save", async function (next) {
  const user = this; // easy to navigate the code

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// delete user tasks when user us remove

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// modeling for user

const User = mongoose.model("User", userSchema);

module.exports = User;
