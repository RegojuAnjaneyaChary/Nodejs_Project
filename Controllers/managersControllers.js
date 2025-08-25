const { UserModel } = require("../Models/authModel.js");
const{TaskModel}= require("../Models/taskModel.js")

exports.getAllemployees = async(req, res, next) => {
   try {
    //    const employees = await UserModel.find().where({ role: "employee" || "manager" });
const employees = await UserModel.find({
  role: { $in: ["employee", "manager"] }
}).select("name username role");

       res.json({ message: "employee information", data: employees });
   } catch (error) {
       console.log(error)
           const err = { statusCode: 400, message: error.message };
           next(err);
       }
    
   }
   
exports.createTicket = async(req, res, next) => {
    try {
        const { title, description, assignTo } = req.body;
        
        const userId = req.userInfo._id;
        console.log(userId);
        const createTask = await TaskModel.create({
            title: title,
            description: description,
            assignTo: assignTo,
            createdBy:userId,
        });
        res.status(200).json({ message: "Task created successfully", task: createTask });

    } catch (error) {
        const err = { statusCode: 400, message: error.message };
           next(err);
        
    }
};

exports.getAllTickets = async(req, res, next) => {
    try {
        const tickets = await TaskModel.find().where({
            createdBy: req.userInfo._id,
            
        }).populate("assignTo")
            .populate("createdBy");
        res.json({ message: "your assigned tasks", data: tickets });
    
   } catch (error) {
        console.log(error)
       const err = { statusCode: 400, message: error.message  };
           next(err);
        
   }
};

exports.getTicketsById = async(req, res, next) => {
    try {
        const ticketID = req.params.ticketID;
        console.log(ticketID)// user here only task ids not user ids
        const task = await TaskModel.findOne({_id:ticketID}).populate("createdBy").populate("assignTo");
      res.json({ message: "Task Information", task });
  } catch (error) {
        console.log(error)
        const err = { statusCode: 400, message: error.message  };
        next(err);
      }
    
};



 