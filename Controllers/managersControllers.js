
const { UserModel } = require("../Models/authModel.js");
const { TaskModel } = require("../Models/taskModel.js");
const mongoose = require("mongoose");
const transporter  = require("../Utils/mailer.js");


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

// exports.createTicket = async (req, res, next) => {
//     try {
//         const { title, description, assignTo } = req.body;
//         const userId = req.userInfo._id;

//         const createTask = await TaskModel.create({
//             title,
//             description,
//             assignTo,
//             createdBy: userId,
//         });

//         res.status(200).json({ message: "Task created successfully", task: createTask });
//     } catch (error) {
//         const err = { statusCode: 400, message: error.message };
//         next(err);
//     }
// };


//add mail

// exports.createTicket = async (req, res, next) => {
//   try {
//     const { title, description, assignTo, employeeEmail } = req.body;
//     const userId = req.userInfo._id;

//     // Check if assigned employee exists
//     const employee = await UserModel.findOne({ _id: assignTo, role: "employee" });
//     if (!employee) return res.status(404).json({ message: "Assigned employee not found" });

//     // Create Task
//     const createTask = await TaskModel.create({
//       title,
//       description,
//       assignTo,
//       createdBy: userId,
//     });

//     // Prepare recipients
//     const recipients = [employee.email]; // always send to employee
//     if (employeeEmail && !recipients.includes(employeeEmail)) recipients.push(employeeEmail);

//     // Mail options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: recipients,
//       subject: `📌 New Task Assigned: ${title}`,
//       html: `
//         <h2>Hello ${employee.name},</h2>
//         <p>You have been assigned a new task by your manager.</p>
//         <p><b>Title:</b> ${title}</p>
//         <p><b>Description:</b> ${description}</p>
//         <p>Please login to the Task Manager to view details.</p>
//         <br/>
//         <p>Regards,<br/>Task Manager System</p>
//       `,
//     };

//     // Send Email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       message: "Task created successfully & email sent",
//       task: createTask,
//     });

//   } catch (error) {
//     console.error("Error creating task:", error);
//     next({ statusCode: 400, message: error.message });
//   }
// };



exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, assignTo, employeeEmail } = req.body;
    const userId = req.userInfo._id;

    // Find employee
    const employee = await UserModel.findOne({ _id: assignTo, role: "employee" });
    if (!employee) return res.status(404).json({ message: "Assigned employee not found" });

    // Create task
    const createTask = await TaskModel.create({
      title,
      description,
      assignTo,
      createdBy: userId,
    });

      // Prepare recipients
      const recipients = [employee.email];
if (employeeEmail && employeeEmail.trim() !== "" && !recipients.includes(employeeEmail)) {
  recipients.push(employeeEmail);
}
    // const recipients = [employee.email];
    // if (employeeEmail && !recipients.includes(employeeEmail)) recipients.push(employeeEmail);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: `📌 New Task Assigned: ${title}`,
      html: `
        <h2>Hello ${employee.name},</h2>
        <p>You have been assigned a new task by your manager.</p>
        <p><b>Title:</b> ${title}</p>
        <p><b>Description:</b> ${description}</p>
        <p>Please login to the Task Manager to view details.</p>
        <br/>
        <p>Regards,<br/>Task Manager System</p>
      `,
    });

    res.status(200).json({
      message: "Task created successfully & email sent",
      task: createTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    next({ statusCode: 400, message: error.message });
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
