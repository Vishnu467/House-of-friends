const mongoose = require("mongoose");

const schema = mongoose.Schema;

const invitationDb = new schema(
  {
    choices: [
      {
        vote: Boolean,
        voter_id: {
          type: schema.Types.ObjectId,
          ref: "userHof"
        },
        waiting_member_id:{
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

const invitationModel = mongoose.model("InvitationDb", invitationDb);

module.exports = invitationModel;