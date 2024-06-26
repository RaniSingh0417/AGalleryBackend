const bcrypt = require("bcryptjs");

// it will be used while login to verify that user is entering a correct password

const verifyPassword = async (inputPassword, encryptedPassword) => {
  try {
    const CheckPassword = await bcrypt.compare(
      inputPassword,
      encryptedPassword
    );
    return CheckPassword;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyPassword };
