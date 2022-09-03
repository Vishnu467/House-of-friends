const express = require('express');
const router = express.Router();

const houseController = require('./house.controller');
const { verifyJwtToken } = require('../../middleware/jwt');

router.post('/create_house', verifyJwtToken, houseController.createHouse);

router.post('/create-channel', verifyJwtToken, houseController.createChannel);

router.post('/get-all-channel', verifyJwtToken, houseController.getAlChannel)

router.post('/create-chat', verifyJwtToken, houseController.createChat)

router.post('/get-all-chat-based-on-channel-id', verifyJwtToken, houseController.getChannelChat)

router.post('/invitation_link', verifyJwtToken, houseController.getInvite);

router.post('/delete_house',verifyJwtToken,houseController.deleteHouse);

router.post("/get_all_house_for_a_user",verifyJwtToken,houseController.getAllHouseOfUser);

router.post('/get_members_of_house',verifyJwtToken,houseController.fetchMembersList);

router.post('/joinHouse',verifyJwtToken,houseController.permissionVote);

router.post('/remove_member',verifyJwtToken,houseController.removeMember);

router.post('/leave_house',verifyJwtToken,houseController.leaveHouse);

module.exports = router;
