const bcryptjs = require("bcryptjs");
const { UserModel } = require("../Models/authModel.js");
const {generateToken}=require("../Utils/token.js");

const signupController = async(req, res, next) => {
    try {
        const { name, username, email, password, role } = req.body
        const hashPassword = await bcryptjs.hash(password, 12);
         
        const user = await UserModel.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword,
            role:role
            
        })

        res.json(user);
        console.log(res.json(user))
    

    } catch (error) {
        
        const err = { statusCode: 400, message: error.message };
        next(err);
        
        
    }


};


const loginController = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const findUser = await UserModel.findOne({ email: email });
        const decryptPassword = await bcryptjs.compare(password, findUser.password);
        if (decryptPassword) {
            const token = await generateToken(findUser); 
           const user = await UserModel.findById(findUser._id).select(["-password","-__v", "-createdAt", "-updatedAt"])
            return res.status(200).json({ message: "login successfully",  user, token });
        } else {
            return res.status(429).json({ message: " invalid email/password " }); 
    }
   
   
    } catch (error) {
          const err = { statusCode: 400, message: error.message };
        next(err);
        
    }
};

module.exports = {signupController, loginController}