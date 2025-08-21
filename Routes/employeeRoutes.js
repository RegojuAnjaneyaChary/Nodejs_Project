const express = require("express");
const Router = express.Router();

const { viewAssignedTckets, updateTicketStatusById, addcommentToTicketByid, viewdcommetToTicketbyid } = require("../Controllers/employeeController.js");
const { tokenValidator, validateMiddleware } = require("../Validators/authValidators.js");
const { checkAuth, checkRole } = require("../Middlewares/authMiddleware.js");

Router.get("/viewAssignedTickets", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), viewAssignedTckets);
Router.put("/updateTicketStatus/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), updateTicketStatusById);
Router.post("/addcommetToTicket/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), addcommentToTicketByid);
Router.get("/viewcommetToTicket/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), viewdcommetToTicketbyid);

module.exports = Router;