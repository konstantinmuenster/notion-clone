const { validationResult } = require("express-validator");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const transport = require("../emails/transport");

const {
  resetPasswordTemplate,
  emailConfirmationTemplate,
} = require("../emails/templates");

const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      const err = new Error(errArray[0].msg);
      err.statusCode = 422;
      err.data = errArray;
      throw err;
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const err = new Error("E-Mail address already exists.");
      err.statusCode = 422;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const activationToken = (await promisify(randomBytes)(20)).toString("hex");
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      activationToken: activationToken,
    });
    const savedUser = await user.save();

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: savedUser.email,
      subject: "Confirm Your Email Address",
      html: emailConfirmationTemplate(savedUser.activationToken),
    });

    // Automatically log in user after registration
    const token = jwt.sign(
      { userId: savedUser._id.toString() },
      process.env.JWT_KEY
    );

    // Set cookie in the browser to store authentication state
    const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: process.env.DOMAIN,
    });

    res.status(201).json({
      message: "User successfully created.",
      userId: savedUser._id,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("An user with this email could not be found.");
      err.statusCode = 404;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Wrong password.");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_KEY
    );

    // Set cookie in the browser to store authentication state
    const maxAge = 1000 * 60 * 60; // 1 hour
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: process.env.DOMAIN,
    });

    res.status(201).json({
      message: "User successfully logged in.",
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    const err = new Error("User is not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  res.clearCookie("token", { domain: process.env.DOMAIN });
  res.status(200).json({
    message: "User successfully logged out.",
    userId: userId,
  });
};

const getUser = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    res.status(200).json({
      message: "User successfully fetched.",
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      pages: user.pages,
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.userId;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    user.name = name;
    user.email = email;

    const savedUser = await user.save();

    res.status(201).json({
      message: "User successfully updated.",
      userId: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
    });
  } catch (err) {
    next(err);
  }
};

const getResetToken = async (req, res, next) => {
  const email = req.body.email;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("An user with this email could not be found.");
      err.statusCode = 404;
      throw err;
    }

    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour from now
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    const savedUser = await user.save();

    await transport.sendMail({
      from: process.env.MAIL_SENDER,
      to: savedUser.email,
      subject: "Your Password Reset Token",
      html: resetPasswordTemplate(resetToken),
    });

    res.status(200).json({
      message: "Password Reset successfully requested! Check your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const password = req.body.password;
  const resetToken = req.body.resetToken;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiry: { $gt: Date.now() - 1000 * 60 * 60 },
    });
    if (!user) {
      const err = new Error("The token is either invalid or expired.");
      err.statusCode = 422;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    const savedUser = await user.save();

    // Automatically sign in user after password reset
    const token = jwt.sign(
      { userId: savedUser._id.toString() },
      process.env.JWT_KEY
    );

    const maxAge = 1000 * 60 * 60; // 1 hour
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      domain: process.env.DOMAIN,
    });

    res.status(201).json({
      message: "Password successfully changed.",
      token: token,
      userId: savedUser._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

const activateAccount = async (req, res, next) => {
  const activationToken = req.body.activationToken;

  try {
    const user = await User.findOne({
      active: false,
      activationToken: activationToken,
    });
    if (!user) {
      const err = new Error("The activation code is invalid.");
      err.statusCode = 422;
      throw err;
    }

    user.active = true;
    user.activationToken = null;
    const savedUser = await user.save();

    res.status(201).json({
      message: "Account successfully activated.",
      userId: savedUser._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.getResetToken = getResetToken;
exports.resetPassword = resetPassword;
exports.activateAccount = activateAccount;
