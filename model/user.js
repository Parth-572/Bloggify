const mongoose = require("mongoose");
const crypto = require("crypto");
const { createTokenForUser } = require("../services/auth");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImageURL: {
      type: String,
      default: "/images/user1.jpg",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPass = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPass;
  user.salt = salt;

  next();
});


userSchema.statics.matchPasswordAndGenerateToken = async function ({ email, password }) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found!!!");
  }

  const salt = user.salt;
  const hashedPassword = user.password;

  const userpass = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (userpass !== hashedPassword) {
    throw new Error("Password is incorrect!!!");
  }

  const token = createTokenForUser(user);

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
