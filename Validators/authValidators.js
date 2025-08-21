const { body, validationResult, header } = require("express-validator");

exports.signupValidator = [
  body("name")
    .isLength({ min: 3, max: 30 })
    .trim()
    .isString()
    .withMessage("required name"),

  body("username")
    .isLength({ min: 3, max: 30 })
    .trim()
    .isString()
    .withMessage("required username"),

  body("email")
    .trim()
    .isLength({ max: 40 })
    .isEmail()
    .withMessage("required email"),

  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .isAlphanumeric()
  .withMessage("required password"),
    

  // (req, res, next) => {
  //   const results = validationResult(req);
  //   if (!results.isEmpty()) {
  //     const err = {
  //       statusCode: 400,
  //       message: "validation error",
  //       errors: results.errors,
  //     };
  //     return next(err);
  //   }
  //   next();
  // }
];


  exports.loginValidator = [
    body("email").trim().isEmail().withMessage("required email"),
    body("password").isString().withMessage("required password"),
    // (req, res, next) => {
    //   const results = validationResult(req)
    //   if (!results.isEmpty()) {
    //     const err = {
    //       statusCode: 400,
    //       message: "validation error",
    //       errors: results.errors,
    //     }
    //     next(err);
    //   }
    //   next();
    // }
  ];


exports.tokenValidator = [
  header("authorization").isString().withMessage("required token")
];

exports.editProfileValidator = [
  body("name").optional()
    .isLength({ min: 3, max: 30 })
    .trim()
    .isString()
    .withMessage("required name"),

  body("username").optional()
    .isLength({ min: 3, max: 30 })
    .trim()
    .isString()
    .withMessage("required username"),

  body("email").optional()
    .trim()
    .isLength({ max: 40 })
    .isEmail()
    .withMessage("required email"),

  body("password").optional()
    .notEmpty()
    .isLength({ min: 6 })
    .isAlphanumeric()
    .withMessage("Password required"),

];



exports.validateMiddleware = (req, res, next) => { 

  const results = validationResult(req)
      if (!results.isEmpty()) {
        const err = {
          statusCode: 400,
          message: "validations error",
          errors: results.errors,
        };
        next(err);
      }
      next();
};