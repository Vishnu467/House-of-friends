const mongoose = require("mongoose");
const schema = mongoose.Schema;

const removalDb = new schema(
  {
    choices: [
      {
        vote: Boolean,
        voter_id: {
          type: schema.Types.ObjectId,
          ref: "userHof"
        },
        to_be_removed_member_id:{
          type:schema.Types.ObjectId,
          ref:'userHof'
        },
        house_id:{
          type:schema.Types.ObjectId,
          ref:'HouseModel'
        }
      }
    ]
  }
);

const removalModel = mongoose.model("RemovalDb", removalDb);

module.exports = removalModel;