const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationSchema = mongoose.Schema(
  {
    country_code: {
      type: String,
      default: "91",
    },
    mobile_number: {
      type: Number,
    },
    email: { type: String },
    verification_type: {
      type: String,
      enum: ["email", "phone"], 
    },
    is_for_login: { type: Boolean, default: false },
    otp: {
      type: Number,
    },
    expries_at: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const verificationhof = mongoose.model("verificationhof", verificationSchema);
module.exports = verificationhof;
