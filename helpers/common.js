const jwt = require("jsonwebtoken");
const commonFunctions = require('../common/common')


module.exports.objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};


module.exports.generateAccessToken = (details) => {

    try {
        return jwt.sign(details, commonFunctions.tokenDetails.TOKENSECRET, {
            expiresIn: "3600s",
        });
    } catch (e) {
        throw new Error(e.message)
    }


}
