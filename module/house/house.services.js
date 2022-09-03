const House = require('../../model/house');
const userDb = require('../../model/house');

module.exports.checkIfHouseExistsWIththisName = async (name) => {
    try {
      let findCriteria = {
        "house.name": name,
      };
  
      let isHouseFound = await House.findOne(findCriteria);
  
      if (isHouseFound) {
        throw new Error("House aldready exists with this name");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };