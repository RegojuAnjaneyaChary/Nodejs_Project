const {UserModel} = require("../Models/authModel.js")
const bcryptjs = require("bcryptjs");
const {cloudnaryFileUpload} = require("../Utils/cloudinary.js");
const fs = require("fs");

exports.getProfile = async(req, res, next) => {
    try {
        const user = await UserModel.findById(req.userInfo.id);
        res.json(user);
        console.log(user)
    } catch (error) {
        next({statusCode: 400, message:error.message})
    }
};

exports.editProfile = async (req, res) => {
    try {
        const { name, username, password, email } = req.body;
        const profileImage = req.file;
        // console.log(profileImage);
        const fileurl = await cloudnaryFileUpload(profileImage.path);
        // console.log(fileurl);
        fs.unlinkSync(profileImage.path);
        const userId = req.userInfo.id;

        console.log(userId)
        if (name || username || password || email) {
            const hashPassword = await bcryptjs.hash(password, 12);
            const updateUser = await UserModel.findByIdAndUpdate(userId, {
                name,
                password: hashPassword,
                email,
                username,
                profilePic:fileurl,
            }, { new: true });
            console.log(updateUser);

            res.json({ message: "profile updated", updateUser });
        } 
    } catch (error) {
        console.log(error);
        res.json(error);
    }

}