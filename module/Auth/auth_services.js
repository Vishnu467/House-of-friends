const verificationDb = require("../../model/VerificationDb");
const userDb = require("../../model/user.model");

const bcrypt = require("bcrypt");
const saltRounds = require("../../common/common").saltRoundForPasswordHash;

exports.checkIFTheOtpIsVerifiedForThisNumber = async (
  country_code,
  mobile_number
) => {
  try {
    let findCriteria = {
      country_code,
      mobile_number,
      verification_type: "phone",
      is_for_login: false,
    };
    let verificationFound = await verificationDb
      .find(findCriteria)
      .limit(1)
      .exec();
    if (
      verificationFound &&
      Array.isArray(verificationFound) &&
      verificationFound.length
    ) {
      if (verificationFound[0].expries_at < Date.now()) {
        throw new Error("your otp is expired");
      }
      if (verificationFound[0].verified == false) {
        throw new Error("Verify your otp before you register");
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.checkIFTheOtpIsVerifiedForThisEmail = async (email) => {
  try {
    let findCriteria = {
      email,
      verification_type: "email",
      is_for_login: false,
    };
    let verificationFound = await verificationDb
      .find(findCriteria)
      .limit(1)
      .exec();
    if (
      verificationFound &&
      Array.isArray(verificationFound) &&
      verificationFound.length
    ) {
      if (verificationFound[0].expries_at < Date.now()) {
        throw new Error("your otp is expired");
      }
      if (verificationFound[0].verified == false) {
        throw new Error("Verify your otp before you register");
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.checkIfTheOtpIsValidLogin = async (
  country_code,
  mobile_number,
  otp,
  is_email,
  email
) => {
  try {
    let findCriteria = {
      is_for_login: true,
    };

    if (!is_email) {
      findCriteria = {
        country_code,
        mobile_number,
        verification_type: "phone",
      };
    } else {
      findCriteria = {
        email,
        verification_type: "email",
      };
    }

    let verificationFound = await verificationDb
      .find(findCriteria)
      .limit(1)
      .exec();
    if (
      verificationFound &&
      Array.isArray(verificationFound) &&
      verificationFound.length
    ) {
      if (verificationFound[0].verified) {
        throw new Error("Your otp has been verified aldready");
      } else if (verificationFound[0].otp != otp) {
        throw new Error("Your otp is not correct");
      } else if (verificationFound[0].otp == otp) {
        if (verificationFound[0].expries_at < Date.now()) {
          throw new Error("Your otp is expired aldready , try again");
        }
      }

      return verificationFound[0];
    } else {
      throw new Error("Invalid Otp");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.checkIfTheOtpIsValid = async (
  country_code,
  mobile_number,
  otp,
  verification_type,
  email
) => {
  try {
    let findCriteria = {
      is_for_login: false,
    };

    if (verification_type == "phone") {
      findCriteria = {
        country_code,
        mobile_number,
        verification_type,
      };
    } else if (verification_type == "email") {
      findCriteria = {
        email,
        verification_type,
      };
    } else {
      throw new Error("Invalid verification type");
    }

    let verificationFound = await verificationDb
      .find(findCriteria)
      .limit(1)
      .exec();
    if (
      verificationFound &&
      Array.isArray(verificationFound) &&
      verificationFound.length
    ) {
      if (verificationFound[0].verified) {
        throw new Error("Your otp has been verified aldready");
      } else if (verificationFound[0].otp != otp) {
        throw new Error("Your otp is not correct");
      } else if (verificationFound[0].otp == otp) {
        if (verificationFound[0].expries_at < Date.now()) {
          throw new Error("Your otp is expired aldready , try again");
        }
      }

      return verificationFound[0];
    } else {
      throw new Error("Invalid Otp");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};


module.exports.returnHashPassword = async (password) => {
  try {
    let passwordN = password.toString();
    return await bcrypt.hash(passwordN, saltRounds);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports.comparePassword = async (passwordEntered, existingPassword) => {
  try {
    let passwordEnteredN = passwordEntered.toString();
    console.log(passwordEnteredN, existingPassword);
    let isMatched = await bcrypt.compare(passwordEnteredN, existingPassword);
    if (!isMatched) {
      throw new Error("Password did not match");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports.checkIfUserExistsWithThisMobile = async (
  country_code,
  phone_number
) => {
  try {
    let findCriteria = {
      "user_details.phone.number": country_code,
      "user_details.phone.country_code": phone_number,
    };

    let isUserFound = await userDb.findOne(findCriteria);

    if (isUserFound) {
      throw new Error("User aldready exists with this number");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports.checkIfUserExistsWIththisemail = async (email) => {
  try {
    let findCriteria = {
      "user_details.email": email,
    };

    let isUserFound = await userDb.findOne(findCriteria);

    if (isUserFound) {
      throw new Error("User aldready exists with this number");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};