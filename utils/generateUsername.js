const User = require("../models/userModel");

module.exports = async (username) => {
  let uName = username;
  let test = false;
  do {
    // eslint-disable-next-line no-await-in-loop
    const existingUser = await User.findOne({ username: uName });

    if (existingUser) {
      uName += Math.trunc(Math.random() * 10000).toString();
      test = true;
    } else {
      test = false;
    }
  } while (test);

  return uName;
};
