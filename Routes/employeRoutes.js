const express = require("express");
const Router = express.Router();
const {
  viewAssignedTickets,
  updateTicketStatusById,
  addCommentToTicketById,
  viewCommentsTicketById,
} = require("../Controllers/employeeController.js");
const {
  tokenValidator,
  validateMiddleware,
} = require("../Validators/authValidators.js");
const { checkAuth, checkRole } = require("../Middlewares/authMiddleware.js");

Router.get(
  "/viewTickets",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  viewAssignedTickets
);
Router.put(
  "/updateTicketStatus/:ticketID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  updateTicketStatusById
);
Router.post(
  "/addCommentToTicket/:ticketID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  addCommentToTicketById
);
Router.get(
  "/viewCommentsTicket/:ticketID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("employee"),
  viewCommentsTicketById
);
module.exports = Router;