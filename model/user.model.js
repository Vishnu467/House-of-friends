const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    user_details: {
      email: { type: String, unique: true },
      phone: {
        country_code: { type: String, default: "91" },
        number: { type: String, unique: true },
      },
      display_name: { type: String },
      display_picture: { type: String },
    },

    verification_status: {
      is_email_verified: { type: Boolean, default: false },
      is_mobile_verified: { type: Boolean, default: false }
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("userHof", userSchema);
module.exports = userModel;
