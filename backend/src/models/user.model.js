import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

},
{timestamps:true}
);


userSchema.pre("save", async function () {
  // only hash if password exists AND is modified
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.pre("save", function (next) {
  if (this.role === "doctor") {
    if (!this.specialization || !this.licenseNumber) {
      return next(new Error("Doctor profile incomplete"));
    }
  }

  if (this.role === "ranger") {
    // optional: clear doctor fields automatically
    this.specialization = undefined;
    this.licenseNumber = undefined;
    this.experience = undefined;
  }


});


userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);







