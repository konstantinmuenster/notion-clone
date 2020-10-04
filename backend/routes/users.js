const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const usersController = require("../controllers/users");

const router = express.Router();

const emailValidator = body("email").isEmail().normalizeEmail();
const passwordValidator = body("password").trim().isLength({ min: 6 });
const nameValidator = body("name").trim().notEmpty();

// POST /users/signup
router.post(
  "/signup",
  [emailValidator, passwordValidator, nameValidator],
  usersController.signup
);

// POST /users/login
router.post(
  "/login",
  [emailValidator, passwordValidator],
  usersController.login
);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

// PUT /users/account
router.put("/account", isAuth, usersController.updateUser);

module.exports = router;
