const{TaskModel}= require("../Models/taskModel.js")

exports.viewAssignedTckets = async(req, res, next) => { // here we login userid and assign userid same is there or not check in database then outputwill come
    try {
        const userId = req.userInfo._id;
        console.log("user", userId);
        const allTickets = await TaskModel.find({
            assignTo:userId
        })
        if (allTickets.length === 0) {
            res.status(200).json({message:"no task"}) 
        }
            // .where({ assignTo: userId }).populate("createdBy", ["name", "username"]);
        res.status(200).json({ message: "your assigned tasks",  allTickets });
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

exports.addcommentToTicketByid =  async(req, res, next) => {
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
        res.json({message:"comment added successfully", data:task})


        
    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);
    }
}

exports.viewdcommetToTicketbyid = async(req, res, next) => {
    try {
        const { ticketID } = req.params;
        const task = await TaskModel.findById(ticketID)
        
        if (!task) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        res.json({message:"comments fetched successfully", data:task.comments})

    } catch (error) {
        console.log(error);
        const err = { statusCode: 400, message: error.message };
        next(err);
        
     }

}