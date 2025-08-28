// const { UserModel } = require("../Models/authModel.js");
// const { TaskModel } = require("../Models/taskModel.js")
// const mongoose = require("mongoose");

// exports.getAllemployees = async(req, res, next) => {
//    try {
//        const employees = await UserModel.find().where({ role: "employee" });
//               res.json({ message: "employee information", data: employees });
       
//    } catch (error) {
//        console.log(error)
//            const err = { statusCode: 400, message: error.message };
//            next(err);
//        }

    
//    }
   
// exports.createTicket = async(req, res, next) => {
//     try {
//         const { title, description, assignTo } = req.body;
        
//         const userId = req.userInfo._id;
//         console.log(userId);
//         const createTask = await TaskModel.create({
//             title: title,
//             description: description,
//             assignTo: assignTo,
//             createdBy:userId,
//         });
//         res.status(200).json({ message: "Task created successfully", task: createTask });

//     } catch (error) {
//         const err = { statusCode: 400, message: error.message };
//            next(err);
        
//     }
// };

// exports.getAllTickets = async(req, res, next) => {
//     try {
//         const tickets = await TaskModel.find().where({
//             createdBy: req.userInfo._id,
            
//         }).populate("assignTo")
//             .populate("createdBy");
//         res.json({ message: "your assigned tasks", data: tickets });
    
//    } catch (error) {
//         console.log(error)
//        const err = { statusCode: 400, message: error.message  };
//            next(err);
        
//    }
// };

// exports.getTicketsById = async(req, res, next) => {
//     try {
//         const ticketID = req.params.ticketID;
//         console.log(ticketID)// user here only task ids not user ids
//         const task = await TaskModel.findOne({_id:ticketID}).populate("createdBy").populate("assignTo");
//       res.json({ message: "Task Information", task });
//   } catch (error) {
//         console.log(error)
//         const err = { statusCode: 400, message: error.message  };
//         next(err);
//       }
    
// };



const { UserModel } = require("../Models/authModel.js");
const { TaskModel } = require("../Models/taskModel.js");
const mongoose = require("mongoose");

exports.getAllemployees = async (req, res, next) => {
  try {
    const employees = await UserModel.find({ role: "employee" });
    res.json({ message: "employee information", data: employees });
  } catch (error) {
    console.log(error);
    const err = { statusCode: 400, message: error.message };
    next(err);
  }
};

// ✅ Manager deletes an employee profile
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { employeeID } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeID)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Check if employee exists (role must be employee)
    const employee = await UserModel.findOne({ _id: employeeID, role: "employee" });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete employee
    await UserModel.findByIdAndDelete(employeeID);

    res.status(200).json({ message: "Employee profile deleted successfully" });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, assignTo } = req.body;
    const userId = req.userInfo._id;

    const createTask = await TaskModel.create({
      title,
      description,
      assignTo,
      createdBy: userId,
    });

    res.status(200).json({ message: "Task created successfully", task: createTask });
  } catch (error) {
    const err = { statusCode: 400, message: error.message };
    next(err);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await TaskModel.find({ createdBy: req.userInfo._id })
      .populate("assignTo")
      .populate("createdBy");

    res.json({ message: "your assigned tasks", data: tickets });
  } catch (error) {
    console.log(error);
    const err = { statusCode: 400, message: error.message };
    next(err);
  }
};

exports.getTicketsById = async (req, res, next) => {
  try {
    const ticketID = req.params.ticketID;
    const task = await TaskModel.findOne({ _id: ticketID })
      .populate("createdBy")
      .populate("assignTo");

    res.json({ message: "Task Information", task });
  } catch (error) {
    console.log(error);
    const err = { statusCode: 400, message: error.message };
    next(err);
  }
};
