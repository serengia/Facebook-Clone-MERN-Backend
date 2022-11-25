const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(userController.getUsers);
router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/verify-account/:token").post(authController.verifyAccount);

module.exports = router;
