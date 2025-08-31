const { TaskModel } = require("../Models/taskModel.js");

const mongoose = require("mongoose");

exports.viewAssignedTckets = async (req, res, next) => { // here we login userid and assign userid same is there or not check in database then outputwill come
    try {
        const userId = req.userInfo._id;
        console.log("user", userId);
        const allTickets = await TaskModel.find({
            assignTo: userId
        })
        if (allTickets.length === 0) {
            res.status(200).json({ message: "no task" })
        }
        // .where({ assignTo: userId }).populate("createdBy", ["name", "username"]);
        res.status(200).json({ message: "your assigned tasks", allTickets });
    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);
    }
}

exports.updateTicketStatusById = async (req, res, next) => {
    try {
        const { taskStatus } = req.body;
        const taskId = req.params.ticketID;
        const userId = req.userInfo._id;

        const task = await TaskModel.findByIdAndUpdate(taskId,
            {
                status: taskStatus,
            },
            { new: true }
        ).where({
            assignTo: userId,
        });
        if (task) {
            return res.json({ message: "Task updated successfully", data: task });

        } else {
            return res.status(404).json({ message: "no task found" });
        }

    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);
    }
};

exports.addcommentToTicketByid = async (req, res, next) => {
    try {
        const { ticketID } = req.params;
        const { comment } = req.body;
        const task = await TaskModel.findById(ticketID);
        if (!task) {
            res.status(404).json({ message: "Ticket not found" });

        }

        task.comments.push({
            comment,
            commentedBy: req.userInfo._id
        })
        await task.save();
        res.json({ message: "comment added successfully", data: task })



    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);
    }
}

exports.viewdcommetToTicketbyid = async (req, res, next) => {
    try {
        const { ticketID } = req.params;
        const task = await TaskModel.findById(ticketID)

        if (!task) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json({ message: "comments fetched successfully", data: task.comments })

    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);

    }

}
////////////////////////////


exports.editCommentById = async (req, res, next) => {
    try {
        let { ticketID, commentID } = req.params;
        const { comment } = req.body;

        // Clean IDs
        ticketID = ticketID.trim();
        commentID = commentID.trim();

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(ticketID) || !mongoose.Types.ObjectId.isValid(commentID)) {
            return res.status(400).json({ message: "Invalid ticketID or commentID" });
        }

        const task = await TaskModel.findById(ticketID);
        if (!task) return res.status(404).json({ message: "Ticket not found" });

        const commentObj = task.comments.id(commentID);
        if (!commentObj) return res.status(404).json({ message: "Comment not found" });

        // Authorization check
        if (commentObj.commentedBy.toString() !== req.userInfo._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own comment" });
        }

        commentObj.comment = comment; // Update comment
        await task.save(); // Save document

        res.json({ message: "Comment updated successfully", data: task });
    } catch (error) {
        console.error("Edit Comment Error:", error);
        next({ statusCode: 500, message: error.message });
    }

};







////////////////

exports.deleteCommentById = async (req, res, next) => {
    try {
        const { ticketID, commentID } = req.params;

        const cleanTicketID = ticketID.trim();
        const cleanCommentID = commentID.trim();

        if (!req.userInfo || !req.userInfo._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const task = await TaskModel.findById(cleanTicketID);
        if (!task) return res.status(404).json({ message: "Ticket not found" });

        const commentObj = task.comments.id(cleanCommentID);
        if (!commentObj) return res.status(404).json({ message: "Comment not found" });

        if (commentObj.commentedBy.toString() !== req.userInfo._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own comment" });
        }

        // ✅ Use deleteOne instead of remove()
        await commentObj.deleteOne();
        await task.save();

        res.json({ message: "Comment deleted successfully", data: task });
    } catch (error) {
        console.error(error);
        next({ statusCode: 400, message: error.message });
    }
};
