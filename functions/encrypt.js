const bcrypt = require("bcryptjs");

//this will be used when a user will signup to store his/her password
// securely in database

const encryptPassword = async (originalPassword) => {
  try {
    const encryptedPassword = await bcrypt.hash(originalPassword, 11);
    return encryptedPassword;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { encryptPassword };
