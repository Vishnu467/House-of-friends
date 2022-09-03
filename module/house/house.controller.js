const House = require("../../model/house");
const userDb = require('../../model/user.model');
const ChannelDb = require('../../model/channel.model');
const ChatDB = require('../../model/chat.model');
const InvitationDb = require('../../model/invitationDb');
const RemovalDb = require('../../model/removalDb');
const mongoose = require('mongoose');

const houseServices = require('../house/house.services');

const commonFunctionForAuth = require("../../helpers/common");

const {
    authenticationFailed,
    sendActionFailedResponse,
    actionCompleteResponse,
    actionCompleteResponsePagination,
} = require("../../common/common");

let msg = "";

exports.getChannelChat = async (req, res, next) => {
    try {
        let { skip, limit, house_obj_id, channel_obj_id } = req.body
        let skipI = skip || 0
        let limitI = limit || 20

        if (!(house_obj_id && channel_obj_id)) {
            throw new Error("House feild & channel is required")
        }
        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let getChatCriteria = {
            house_obj_id: house_obj_id,
            channel_id: channel_obj_id,
        }

        let CHat = await ChatDB.find(getChatCriteria).skip(skipI).limit(limitI)

        let CHatTotal = await ChatDB.countDocuments(getChatCriteria)


        msg = "Chat data retrived";

        let result = {
            CHat,
            CHatTotal
        }

        actionCompleteResponse(res, result, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}

exports.createChat = async (req, res, next) => {
    try {
        let {
            msg_type,
            msg,
            attachment_type,
            attachment_url,
            channel_id,
            house_obj_id
        } = req.body;


        let user_ob_id = req.user_obj_id

        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)
        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let insertObjCHat = {
            msg_type,
            msg,
            attachment_type,
            attachment_url,
            channel_id,
            house_obj_id,
            msg_sent_by: req.user_obj_id
        }

        await new ChatDB(insertObjCHat).save()
        msg = "Chat created successfully";


        actionCompleteResponse(res, "", msg);


    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
}

exports.getAlChannel = async (req, res, next) => {
    try {
        let { skip, limit, house_obj_id } = req.body
        let skipI = skip || 0
        let limitI = limit || 20

        if (!house_obj_id) {
            throw new Error("House feild is required")
        }
        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let findCriChannelExistsWIthName = {
            house_obj_id: house_obj_id
        }

        let channelList = await ChannelDb.find(findCriChannelExistsWIthName).skip(skipI).limit(limitI)

        let channelListTotal = await ChannelDb.countDocuments(findCriChannelExistsWIthName)


        msg = "Channel data retrived";

        let result = {
            channelList,
            channelListTotal
        }

        actionCompleteResponse(res, result, msg);



    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}


exports.createChannel = async (req, res, next) => {
    try {

        let { name_of_chanel, house_obj_id, channel_icon } = req.body

        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let findCriChannelExistsWIthName = {
            name_of_chanel,
            house_obj_id: house_obj_id
        }

        let doesChannelExists = await ChannelDb.findOne(findCriChannelExistsWIthName)

        if (doesChannelExists) {
            throw new Error("Channel aldready exists with the name")
        }

        let insertObj = {
            name_of_chanel: name_of_chanel,
            house_obj_id: house_obj_id,
            channel_icon
        }

        let channelCreatedResult = await new ChannelDb(insertObj).save()

        msg = "Channel created successfully";

        actionCompleteResponse(res, channelCreatedResult, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}

exports.createHouse = async (req, res, next) => {
    try {
        const {
            name,
            displayIconUrl,
        } = req.body;

        await houseServices.checkIfHouseExistsWIththisName(name);

        const createObj = {
            name,
            displayIconUrl,
            creator: req.user_obj_id,
            membersOfHouse: [req.user_obj_id]
        }

        let detailsSaved = await new House(createObj).save();

        let insertObjChannel = {
            name_of_chanel: "Default Channel",
            house_obj_id: detailsSaved._id,
            channel_icon: displayIconUrl,

        }

        await new ChannelDb(insertObjChannel).save()

        msg = "House created successfully";

        actionCompleteResponse(res, detailsSaved, msg);
        console.log(detailsSaved);
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
};

exports.getInvite = async (req, res, next) => {
    try {
        const senderHouseId = req.body.houseId;

        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: senderHouseId
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let joiningLink = `http://${process.env.HOST_NAME || "localhost"}:${process.env.PORT || 8000}/joinHouse?houseId=${senderHouseId}`;

        msg = "Join the house through this link"

        actionCompleteResponse(res, joiningLink, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
};

exports.permissionVote = async (req, res, next) => {
    try {
        const senderHouseId = req.query.houseId;

        const waiting_member_id = req.body.waiting_member_id;

        const { voter_id: vote_value } = req.body.vote;

        let filter_for_house = {
            _id: senderHouseId
        }

        let house = await House.findOne(filter_for_house);

        let membersOfHouse = house.membersOfHouse;

        let permission_poll = [];

        let allowed_vote = [];

        for (let i = 0; i < membersOfHouse.length; i++) {
            if (vote_value = true) {
                allowed_vote.push(1);
            }
            permission_poll.push({
                choices: [
                    {
                        vote: vote_value,
                        voter_id: voter_id,
                        waiting_member_id: waiting_member_id,
                        house_id: senderHouseId
                    }
                ]
            })
        };

        let permission_result = await new InvitationDb(permission_poll).save();

        if (allowed_vote.length === membersOfHouse.length) {
            let new_members_of_house = membersOfHouse.push(waiting_member_id);

            let new_house = { ...house };

            new_house.memberOfHouse = new_members_of_house;

            await House.deleteOne(filter_for_house);

            let updated_house = await new House(new_house).save();

            await InvitationDb.deleteOne({ _id: permission_result._id });

            msg = 'New Member is Added to group';

            actionCompleteResponse(res, updated_house, msg);
        } else {
            throw new Error("Member is not allowed to be a part of this house");
        };
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message)
    }
};

exports.removeMember = async (req, res, next) => {
    try {
        const houseId = req.query.HouseId;

        const to_be_removed_member_id = req.body.user_id;

        const { voter_id: vote_value } = req.body.vote;

        let filter_for_house = {
            _id: houseId
        }

        let house = await House.findOne(filter_for_house);

        let membersOfHouse = house.membersOfHouse;

        let permission_poll = [];

        let allowed_vote = [];

        for (let i = 0; i < membersOfHouse.length; i++) {
            if (vote_value = true) {
                allowed_vote.push(1);
            }
            permission_poll.push({
                choices: [
                    {
                        vote: vote_value,
                        voter_id: voter_id,
                        house_obj_id: houseId,
                        to_be_removed_member_id: to_be_removed_member_id
                    }
                ]
            })
        };

        let removal_permission_result = await new RemovalDb(permission_poll).save();

        if (allowed_vote.length === membersOfHouse.length) {
            const index_of_to_be_removed_member = membersOfHouse.indexOf(to_be_removed_member_id);

            if (index_of_to_be_removed_member > -1) {
                membersOfHouse.splice(index_of_to_be_removed_member, 1);
            }

            let new_house = { ...house, memberOfHouse };

            // new_house.memberOfHouse = new_members_of_house;

            await House.deleteOne(filter_for_house);

            let updated_house = await new House(new_house).save();

            await RemovalDb.deleteOne({ _id: removal_permission_result._id });

            msg = 'New Member is removed from the group';

            actionCompleteResponse(res, updated_house, msg);
        } else {
            throw new Error("Member can't be removed as every member of the group doesn't want to remove this member");
        };
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message)
    }
};

exports.deleteHouse = async (req, res, next) => {
    try {
        const houseId = req.body.houseId;
        const userId = req.user_obj_id;

        let filter_for_house = {
            _id:houseId
        }

        let house = await House.findById(filter_for_house);

        if (house.creator == userId) {
            const deletedHouse = await House.findByIdAndDelete(houseId);

            msg = "House has been deleted successfully!";

            actionCompleteResponse(res, deletedHouse, msg);
        } else {
            throw new Error("User is not allowed to delete the group , only creator of the group could do that");
        };

    } catch (err) {
        console.log(err.message);
        sendActionFailedResponse(res, {}, err.message)
    }
};

exports.fetchMembersList = async (req, res, next) => {
    try {
        const houseId = req.body.houseId;

        let filter_for_house = {
            _id: houseId
        }

        let house = await House.findOne(filter_for_house);
        console.log(house);

        actionCompleteResponse(res, house.membersOfHouse, msg);
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message)
    }
};

exports.leaveHouse = async (req, res, next) => {
    try {
        const houseId = req.body.HouseId;

        const userId = req.body.userId;

        let filter_for_house = {
            _id: houseId
        }

        let house = await House.findOne(filter_for_house);

        let membersOfHouse = house.membersOfHouse;

        const index_of_to_be_removed_member = membersOfHouse.indexOf(userId);

        if (index_of_to_be_removed_member > -1) {
            membersOfHouse.splice(index_of_to_be_removed_member, 1);
        }

        let new_house = { ...house, membersOfHouse };

        await House.deleteOne(filter_for_house);

        let updated_house = await new House(new_house).save();

        await RemovalDb.deleteOne({ _id: removal_permission_result._id });

        msg = 'New Member is removed from the group';

        actionCompleteResponse(res, updated_house, msg);
    } catch (err) {
        console.log(err.message);
        sendActionFailedResponse(res, {}, err.message)
    }
};

exports.getAllHouseOfUser = async (req, res, next) => {
    try {
        const userId = req.user_obj_id;

        let checkIfUserBelongToHouse = {
            membersOfHouse: {
                $in: [userId]
            }
        }

        let HousesOfUser = await House.find(checkIfUserBelongToHouse)

        if (!HousesOfUser) {
            throw new Error(`User doesn't belong to any house`);
        };

        msg = "These are the house to which the user belongs"

        actionCompleteResponse(res, HousesOfUser, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    };
};