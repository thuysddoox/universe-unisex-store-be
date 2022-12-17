const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Phone number is invalid!");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value) {
        if (!validator.isLength(value, { min: 8, max: undefined })) {
          throw new Error("Password must be greater than 8 characters");
        }
        if (value.toLowerCase().includes("password")) {
          throw new Error("Please choose a different password");
        }
      },
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: Number,
      required: true,
      default: 1,
      // 1: user, 2: admin,= 3: staff 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dob: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role, isAdmin: user?.isAdmin ?? false },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "2d" }
  );
  return token;
};

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;

  return userObject;
};

UserSchema.statics.findByCredentials = async (username, password, res) => {
  const user = await User.findOne({ username }) || await User.findOne({ email: username });

  if (!user) {
    throw new Error("Username or password is not correct!!!");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Username or password is not correct!!!");
  }
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
