
const { authenticationFailed, sendActionFailedResponse, actionCompleteResponse, actionCompleteResponsePagination } = require('../../common/common');

exports.uploadFile = async (req, res, next) => {
    try {
        let responseObj = {
            fileSavedUrl: req.file.location,
            destination: req.file.location,
            fileName: req.file.originalname
        }
        return actionCompleteResponse(res, responseObj)

    } catch (err) {
        console.log(err)
        sendActionFailedResponse(res, {}, err.message)

    }
}