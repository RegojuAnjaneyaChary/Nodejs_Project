const express = require("express");
const Router = express.Router()
const {signupController, loginController}=require("../Controllers/authControllers.js")
const { signupValidator , loginValidator} = require("../Validators/authValidators.js");



Router.post("/signup", signupValidator, signupController)
Router.post("/login", loginValidator, loginController);

module.exports = Router;