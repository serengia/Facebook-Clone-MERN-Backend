const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const generateUsername = require("../utils/generateUsername");
const Email = require("../utils/Email");

const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

exports.register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    bYear,
    bMonth,
    bDay,
    gender,
  } = req.body;

  try {
    const tempUsername = firstName + lastName;
    const userName = await generateUsername(tempUsername);

    const createdUser = await User.create({
      firstName,
      lastName,
      username: userName,
      email,
      password,
      passwordConfirm,
      bYear,
      bMonth,
      bDay,
      gender,
    });

    let url;
    const token = generateToken(
      { email },
      process.env.JWT_ACCOUNT_VERIFICATION_SECRET,
      {
        expiresIn: "10m",
      }
    );

    if (req.header("Referer")) {
      url = `${req.header("Referer")}verify-account/${token}`;
    } else {
      url = `${req.protocol}://${req.get(
        "host"
      )}/users/activate-account/${token}`;
    }

    const emailUserData = {
      name: firstName,
      email,
    };

    await new Email(emailUserData, url).sendAccountVerification();

    res.status(200).json({
      status: "success",
      data: {
        user: createdUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAccount = () => {};
