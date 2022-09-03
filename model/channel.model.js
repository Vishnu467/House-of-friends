const mongoose = require("mongoose");

const schema = mongoose.Schema;

const ChannelSchema = new schema(
    {
        name_of_chanel: {
            type: String,
            required: true,
            unique: true
        },
        house_obj_id: {
            type: schema.Types.ObjectId,
            ref: "HouseModel"
        },
        channel_icon: {
            type: String,
        },
        latest_msg_of_channel: {
            type: schema.Types.ObjectId,
            ref: "channel"
        }
    },
    {
        timestamps: true,
    }
);

const CHannelModel = mongoose.model("channel", ChannelSchema);
module.exports = CHannelModel;