const express = require("express");
const Router = express.Router();

const { viewAssignedTckets, updateTicketStatusById, addcommentToTicketByid, viewdcommetToTicketbyid, editCommentById, deleteCommentById } = require("../Controllers/employeeController.js");
const { tokenValidator, validateMiddleware } = require("../Validators/authValidators.js");
const { checkAuth, checkRole } = require("../Middlewares/authMiddleware.js");

Router.get("/viewAssignedTickets", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), viewAssignedTckets);
Router.put("/updateTicketStatus/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), updateTicketStatusById);
Router.post("/addcommetToTicket/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), addcommentToTicketByid);
Router.get("/viewcommetToTicket/:ticketID", tokenValidator, validateMiddleware, checkAuth, checkRole("employee"), viewdcommetToTicketbyid);

Router.put(
  "/comment/edit/:ticketID/:commentID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  editCommentById
);

Router.delete(
  "/comment/delete/:ticketID/:commentID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  deleteCommentById
);


module.exports = Router;