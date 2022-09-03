const Joi = require("joi");
const { objectId } = require("../../helpers/common");

exports.changePhoneNumber = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
  }),
};

exports.sendOtpLogin = {
  body: Joi.object().keys({
    email: Joi.string().optional(),
    is_email: Joi.boolean().required(),
    mobile_number: Joi.string().required(),
  }),
};

exports.setPasswordAdminCreated = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.number().required(),
    receivedPassword: Joi.number().required(),
    newPassword: Joi.number().required(),
  }),
};

exports.getFeedbackDriver = {
  query: Joi.object().keys({
    skip: Joi.string().optional(),
    limit: Joi.string().optional(),
  }),
};

exports.createNewDocument = {
  body: Joi.object().keys({
    image: Joi.object()
      .keys({
        url: Joi.string().required(),
        secureUrl: Joi.string().required(),
        created_at: Joi.string().required(),
        format: Joi.string().required(),
      })
      .required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    docName: Joi.string().required(),
    validity: Joi.string().required(),
    forVehicle: Joi.bool().required(),
  }),
};

exports.deleteDocument = {
  body: Joi.object().keys({
    document_obj_id: Joi.string().custom(objectId).optional(),
  }),
};

exports.sendOtpForAdminCreatedDriver = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.number().required(),
  }),
};

exports.verifyOtpAdminCreatedDriver = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.number().required(),
    otp: Joi.number().required(),
  }),
};

exports.checkIfTheUserIsVerfiedExists = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.number().required(),
  }),
};

exports.verifyOtpChangePhonenumber = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
  }),
};

exports.sendOtpForChangePhoneNumber = {
  body: Joi.object().keys({
    country_code: Joi.string().required(),
    mobile_number: Joi.number().required(),
  }),
};

module.exports.register = {
  body: Joi.object().keys({
    display_name: Joi.string().required(),
    country_code: Joi.string().required(),
    display_pic: Joi.string().required(),
    mobile_number: Joi.string().required(),
    email: Joi.string().required(),
  }),
};

module.exports.sentotp = {
  body: Joi.object().keys({
    country_code: Joi.string().optional(),
    mobile_number: Joi.string().optional(),
    verification_type: Joi.string().required(),
    email: Joi.string().optional(),
  }),
};

exports.verifyOtp = {
  body: Joi.object().keys({
    country_code: Joi.string().optional(),
    mobile_number: Joi.string().optional(),
    verification_type: Joi.string().required(),
    email: Joi.string().optional(),
    otp: Joi.number().required(),
  }),
};

module.exports.login = {
  body: Joi.object().keys({
    email: Joi.string().optional(),
    is_email: Joi.boolean().required(),
    otp : Joi.string().required(),
    mobile_number: Joi.string().required(),
  }),
};

exports.updateProfile = {
  body: Joi.object().keys({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    profile_image: Joi.string().optional(),
    middle_name: Joi.string().optional(),
    legal_id: Joi.string().optional(),
    legal_id_type: Joi.string().optional(),
    license_number: Joi.string().optional().allow(""),
    validity_of_document: Joi.string().optional(),
    country_code_voice_phone: Joi.string().optional(),
    voice_phone: Joi.string().optional(),
    emergency_contact_person_name: Joi.string().optional().allow(""),
    phone_number: Joi.string().optional().allow(""),
    relationship: Joi.string().optional().allow(""),
    status: Joi.string().optional(),
    status_driver_app: Joi.string().optional().allow(""),
  }),
};
