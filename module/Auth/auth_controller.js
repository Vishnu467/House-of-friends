const {
  authenticationFailed,
  sendActionFailedResponse,
  actionCompleteResponse,
  actionCompleteResponsePagination,
} = require("../../common/common");
const verificationDb = require("../../model/VerificationDb");

const userDb = require("../../model/user.model");

const commonFolder = require("../../common/common");

const authServices = require("./auth_services");
const notificationService = require("../../helpers/NotificationService");

const commonFunctionForAuth = require("../../helpers/common");

let msg = "";

exports.updateProfile = async (req, res, next) => {
  try {
    let driverDetails = req.driverDetails;

    let payload = req.body;
    let updateObj = {};

    payload.first_name
      ? (updateObj["personal_details.first_name"] = payload.first_name)
      : "";
    payload.last_name
      ? (updateObj["personal_details.last_name"] = payload.last_name)
      : "";
    payload.middle_name
      ? (updateObj["personal_details.middle_name"] = payload.middle_name)
      : "";
    payload.profile_image
      ? (updateObj["personal_details.profile_image"] = payload.profile_image)
      : "";

    payload.legal_id
      ? (updateObj["legal_documentation.legal_id"] = payload.legal_id)
      : "";
    payload.legal_id_type
      ? (updateObj["legal_documentation.legal_id_type"] = payload.legal_id_type)
      : "";
    payload.license_number
      ? (updateObj["legal_documentation.license_number"] =
        payload.license_number)
      : "";
    payload.validity_of_document
      ? (updateObj["legal_documentation.validity_of_document"] =
        payload.validity_of_document)
      : "";

    payload.country_code_voice_phone
      ? (updateObj["mobile_details.country_code_voice_phone"] =
        payload.country_code_voice_phone)
      : "";
    payload.voice_phone
      ? (updateObj["mobile_details.voice_phone"] = payload.voice_phone)
      : "";

    payload.emergency_contact_person_name
      ? (updateObj["emergency_details.emergency_contact_person_name"] =
        payload.emergency_contact_person_name)
      : "";
    payload.phone_number
      ? (updateObj["emergency_details.phone_number"] = payload.phone_number)
      : "";
    payload.relationship
      ? (updateObj["emergency_details.relationship"] = payload.relationship)
      : "";
    payload.status_driver_app
      ? (updateObj["status_driver_app"] = payload.status_driver_app)
      : "";

    payload.status ? (updateObj["status"] = payload.status) : "";

    let updateCri = {
      _id: driverDetails._id,
    };

    const updatedData = await userDb.findOneAndUpdate(updateCri, updateObj, {
      new: true,
    });

    msg = "Profile has been updated successfully";
    let resData = updatedData;
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    let { country_code, mobile_number, verification_type, email, otp } =
      req.body;

    let verificationResult = await authServices.checkIfTheOtpIsValid(
      country_code || 91,
      mobile_number,
      otp,
      verification_type,
      email
    );

    let updateCri = {
      verified: true,
    };

    await verificationDb.findOneAndUpdate(
      { _id: verificationResult._id },
      updateCri,
      { new: true }
    );

    msg = "Otp has been verified successfully";
    let resData = {};
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.sentotp = async (req, res, next) => {
  try {
    let { country_code, mobile_number, verification_type, email } = req.body;

    if (verification_type == "email") {
      if (!email) {
        throw new Error("Email is required");
      }

      await authServices.checkIfUserExistsWIththisemail(email);
    } else if (verification_type == "phone") {
      if (!mobile_number) {
        throw new Error("Mobile number required");
      }

      await authServices.checkIfUserExistsWithThisMobile(
        country_code || 91,
        mobile_number
      );
    } else {
      throw new Error("Invalid verification type");
    }

    let deleteCri = {};

    if (verification_type == "email") {
      deleteCri = {
        email,
        verification_type: "email",
      };
    } else {
      deleteCri = {
        country_code: 91 || country_code,
        mobile_number,
        verification_type: "phone",
      };
    }

    await verificationDb.deleteMany(deleteCri);

    let otpDetails = commonFolder.getOtpCreation();

    let otp = otpDetails.otp;
    let expires_in = otpDetails.expires_in;

    let msgToSend = `Hii  your otp is ${otp} and your otp expires in next 5 min `;

    // await notificationService.sentMessageViaTwilio(msgToSend, country_code, mobile_number)

    let insertObj = {
      country_code,
      mobile_number,
      otp,
      expries_at: expires_in,
      verification_type: "phone",
      is_for_login: false,
    };

    await new verificationDb(insertObj).save();

    msg = "Otp has been sent successfully";
    let resData = {};
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    let { display_name, country_code, mobile_number, email, display_pic } =
      req.body;

    await authServices.checkIfUserExistsWIththisemail(email);
    await authServices.checkIfUserExistsWithThisMobile(
      country_code,
      mobile_number
    );

    await authServices.checkIFTheOtpIsVerifiedForThisNumber(
      country_code,
      mobile_number
    );

    await authServices.checkIFTheOtpIsVerifiedForThisEmail(email);

    let createObj = {
      user_details: {
        email,
        phone: {
          country_code: country_code,
          number: mobile_number,
        },
        display_name: display_name,
        display_picture: display_pic,
      },
      verification_status: {
        is_email_verified: true,
        is_mobile_verified: true,
      },
    };

    let detailsSaved = await new userDb(createObj).save();
    let tokenEmbed = {
      _id: detailsSaved._id,
      user_details: detailsSaved.user_details,
    };

    let token = commonFunctionForAuth.generateAccessToken(tokenEmbed);

    let deleteCri = {
      country_code: country_code,
      mobile_number,
    };

    let deleteCriEMail = {
      email: email,
    };
    await verificationDb.deleteMany(deleteCri);
    await verificationDb.deleteMany(deleteCriEMail);

    msg = "Registration done successfully";
    let resData = { token, detailsSaved };
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.sendOtpLogin = async (req, res, next) => {
  try {
    let { email, is_email, mobile_number } = req.body;

    let user_details = {};
    if (is_email) {
      let isUserExists = await userDb.findOne({ "user_details.email": email });

      if (!isUserExists) {
        throw new Error("User doesnt exists");
      }
    } else {
      let isUserExists = await userDb.findOne({
        "user_details.phone": mobile_number,
      });

      if (!isUserExists) {
        throw new Error("User doesnt exists");
      }
    }

    let otpDetails = commonFolder.getOtpCreation();

    let otp = otpDetails.otp;
    let expires_in = otpDetails.expires_in;

    let msgToSend = `Hii  your otp is ${otp} and your otp expires in next 5 min `;

    let insertOb = {
      is_for_login: true,
      mobile_number,
      otp,
      expries_at: expires_in,
      email,
    };

    if (is_email) {
      insertOb = {
        ...insertOb,
        verification_type: "email",
      };
    } else {
      insertOb = {
        ...insertOb,
        verification_type: "phone",
      };
    }

    let deleteCri = {
      is_for_login: true,
    };

    if (is_email) {
      deleteCri = {
        email,
        verification_type: "email",
      };
    } else {
      deleteCri = {
        country_code: 91 || country_code,
        mobile_number,
        verification_type: "phone",
      };
    }

    await verificationDb.deleteMany(deleteCri);
    await new verificationDb(insertOb).save();

    msg = "Otp has been sent successfully";
    let resData = {};
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    let { email, is_email, otp, mobile_number, country_code } = req.body;

    let verificationResult = await authServices.checkIfTheOtpIsValidLogin(
      country_code || 91,
      mobile_number,
      otp,
      is_email,
      email
    );

    let deleteCri = {
      country_code: "91",
      mobile_number,
      is_for_login: true,
    };

    let deleteCriEMail = {
      email: email,
      is_for_login: true,
    };
    await verificationDb.deleteMany(deleteCri);
    await verificationDb.deleteMany(deleteCriEMail);

    let isUserExists = {};
    if (is_email) {
      isUserExists = await userDb.findOne({ "user_details.email": email });

      if (!isUserExists) {
        throw new Error("User doesnt exists");
      }
    } else {
      isUserExists = await userDb.findOne({
        "user_details.phone": mobile_number,
      });

      if (!isUserExists) {
        throw new Error("User doesnt exists");
      }
    }

    let tokenEmbed = {
      _id: isUserExists._id,
      user_details: isUserExists.user_details,
    };

    let token = commonFunctionForAuth.generateAccessToken(tokenEmbed);

    msg = "Login done successfully";
    let resData = { token, userDetails: isUserExists };
    actionCompleteResponse(res, resData, msg);
  } catch (err) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};
