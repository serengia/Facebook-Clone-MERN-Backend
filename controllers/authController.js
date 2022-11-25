const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const generateUsername = require("../utils/generateUsername");
const Email = require("../utils/Email");
const AppErrorHandler = require("../utils/AppErrorHandler");

const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

const signSendToken = (res, user) => {
  const newToken = generateToken({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", newToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    status: "success",
    token: newToken,
    data: {
      data: {
        firstName: user.firstName,
        userName: user.username,
        email: user.email,
      },
    },
  });
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

    await User.create({
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
      message: `Please verify your account. Verification email sent to: ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify token
    let decoded;
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_VERIFICATION_SECRET,
      function (err, decodedObj) {
        if (err) {
          return next(
            new AppErrorHandler(
              "Invalid or Expired token. Please signup again.",
              401
            )
          );
        }

        decoded = decodedObj;
      }
    );

    const { email } = decoded;

    const verifiedUser = await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );

    signSendToken(res, verifiedUser);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppErrorHandler("Please provide email and password.", 400)
      );
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return next(
        new AppErrorHandler(
          "Provided email is not connected to any account.",
          400
        )
      );
    }

    const correct = await bcrypt.compare(password, existingUser.password);

    if (!correct) {
      return next(new AppErrorHandler("Email or password incorrect.", 401));
    }

    signSendToken(res, existingUser);
  } catch (error) {
    next(error);
  }
};
