let responseMessages = {
    PARAMETER_MISSING: "Insufficient information was supplied. Please check and try again.",
    ACTION_COMPLETE: "Successful",
    BAD_REQUEST: "Invalid Request",
    AUTHENTICATION_FAILED: "Authentication failed",
    ACTION_FAILED: "Something went wrong.Please try again",
    INCORRECT_PASSWORD: "Incorrect Password"
};

exports.mongoUrl = {
    NEW: "mongodb://hello:hello@cluster0-shard-00-00.uatbf.mongodb.net:27017,cluster0-shard-00-01.uatbf.mongodb.net:27017,cluster0-shard-00-02.uatbf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-vn7m4d-shard-0&authSource=admin&retryWrites=true&w=majority",
    OLD: "mongodb://hello:hello@cluster0-shard-00-00.uatbf.mongodb.net:27017,cluster0-shard-00-01.uatbf.mongodb.net:27017,cluster0-shard-00-02.uatbf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-vn7m4d-shard-0&authSource=admin&retryWrites=true&w=majority"
}

exports.twilo = {
    TWILIO_SID: "AC27011995ab0321bcec8df7b56832f876",
    TWILIO_AUTH: "566d68d0f5cb606ffcaa10b841651118",
    TWILIO_SERVICE_ID: "MGb978fe8ad12c383b926b1921a42c22fe"
}


let responseFlags = {
    PARAMETER_MISSING: 100,
    ACTION_COMPLETE: 200,
    BAD_REQUEST: 400,
    AUTHENTICATION_FAILED: 401,
    ACTION_FAILED: 410,
    PERMISSION_NOT_ALLOWED: 403

};

exports.awsKeys = {
    SECRET_ACCESS_KEY: 'sdsdsd/Jb7nfCNftZHwdASUlRz40mMLaj',
    ACCESS_KEY_ID: 'AKIA3GVMKsdWQS2TBWUTKF',
    REGION: 'us-east-1'
}

exports.saltRoundForPasswordHash = 10

exports.tokenDetails = {
    TOKENSECRET: "HOUSEOFFRIENDS@$"

}

exports.getOtpCreation = function () {
    var otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    return {
        // otp: otp,
        otp: 1234,
        expires_in: expires
    }
}

exports.autoCreateSlug = function (text) {
    text = "" + text // toString
    text = text.replace(/[^a-zA-Z ]/g, ""); // replace all special char 
    text = text.replace(/\s\s+/g, ' ');

    text = text.trim() //trim text
    text = text.replace(/ /g, "-"); // replace all special char 
    text = text.toLowerCase();
    if (!text) {
        text = 'slg-' + Math.floor(Math.random() * (999 - 100 + 1) + 100);
    }
    return text;
}


exports.operationType = {
    PUSH: 1,
    PULL: 2,
    REPLACE: 3
}

exports.actionCompleteResponse = function (res, data, msg) {
    var response = {
        success: 1,
        message: msg || responseMessages.ACTION_COMPLETE,
        status: responseFlags.ACTION_COMPLETE,
        data: data || {}
    };
    res.status(responseFlags.ACTION_COMPLETE).send(JSON.stringify(response));
}

exports.authenticationFailed = function (res, msg, data) {
    var response = {
        success: 0,
        message: msg || 'Authentication Failed',
        status: responseFlags.AUTHENTICATION_FAILED,
        data: data || {}
    }
    res.status(responseFlags.AUTHENTICATION_FAILED).send(response);
}


exports.sendActionFailedResponse = function (res, data, msg) {
    var response = {
        success: 0,
        message: msg || responseMessages.ACTION_FAILED,
        status: responseFlags.ACTION_FAILED,
        data: data || {}
    }

    return res.status(responseFlags.ACTION_FAILED).send(response);
};

exports.actionCompleteResponsePagination = function (res, data, msg, totalCount) {
    var response = {
        success: 1,
        message: msg || responseMessages.ACTION_COMPLETE,
        status: responseFlags.ACTION_COMPLETE,
        totalCount: totalCount,
        data: data || {}
    };
    res.status(responseFlags.ACTION_COMPLETE).send(JSON.stringify(response));
}
