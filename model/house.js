const mongoose = require("mongoose");

const schema = mongoose.Schema;

const houseSchema = new schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    displayIconUrl: {
      type: String,
    },
    numberOfMembers: {
      type: Number,
      default: 1,
    },
    creator: {
      type: schema.Types.ObjectId,
      ref: "userHof"
    },
    membersOfHouse: [{
      type: schema.Types.ObjectId,
      ref: "userHof"
    }],

  },
  {
    timestamps: true,
  }
);

const houseModel = mongoose.model("HouseModel", houseSchema);
module.exports = houseModel;