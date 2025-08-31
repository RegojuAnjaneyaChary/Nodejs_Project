const jwt = require("jsonwebtoken");
require("dotenv").config();
const {UserModel}= require("../Models/authModel.js")

// exports.checkAuth = async(req, res, next) => {
//     console.log(req.headers);
//     const { authorization } = req.headers;
//     // console.log(authorization);
//     const token = authorization.split(" ")[1]
//     try {
//         const decodeToken = await jwt.verify(token, process.env.jwt_secret_key);
//         // console.log(decodeToken)
//         const check = await UserModel.findById(decodeToken.id).select(["-password", "-__v", "-createdAt", "-updatedAt"]);
//         if (check) {
//             req.userInfo = check;

//             console.log("userinfo", req.userInfo)
//             next();
//         } else {
//             next({ statusCode: 403, message: "invalid token" });
//           }


//     } catch (error) {
//         console.log(error);
//         next({ statusCode: 403, message: error.message });
        
//     }
// }

// new code


exports.checkAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if header exists and starts with Bearer
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authorization.split(" ")[1];

    // Verify JWT
    const decodeToken = await jwt.verify(token, process.env.jwt_secret_key);

    // Find user in DB
    const user = await UserModel.findById(decodeToken.id).select([
      "-password",
      "-__v",
      "-createdAt",
      "-updatedAt",
    ]);

    if (!user) {
      return res.status(403).json({ message: "Invalid token, user not found" });
    }

    // Set user info for downstream controllers
    req.userInfo = user;
    console.log("userinfo", req.userInfo); // should show _id and other details
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: error.message });
  }
};













exports.checkRole = (...roles) => {
    return  async(req, res, next) => {
        const checkUser = req.userInfo;
        const data = await UserModel.findById(checkUser.id).select("role");
        if (roles.includes(data.role)) {
            next();

        } else {
            next({ statusCode: 403, message: "only managers can access to the api" });
        }
   
    };
};