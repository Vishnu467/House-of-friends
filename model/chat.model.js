const mongoose = require("mongoose");

const schema = mongoose.Schema;

const ChatSchema = new schema(
    {
        msg_type: {
            type: String,
            enum: ["text", "attachment", "text_attachement"]
        },
        msg: {
            type: String,
        },
        attachment_type: {
            type: String,
            enum: ["Video", "Audio", "Image"]
        },
        attachment_url: {
            type: String
        },
        house_obj_id : {
            type: schema.Types.ObjectId,
            ref: "HouseModel"

        },
        read_by: [{
            user: {
                type: schema.Types.ObjectId,
                ref: "userHof"
            },
            date_on_read: {
                type: Date
            }
        }],
        msg_sent_by: {
            type: schema.Types.ObjectId,
            ref: "userHof"

        },
        channel_id: {
            type: schema.Types.ObjectId,
            ref: "channel"

        }
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model("chat", ChatSchema);
module.exports = ChatModel;
