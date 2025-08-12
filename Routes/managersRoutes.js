const express = require("express");
const Router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketByID,
} = require("../Controllers/managersController.js");
const { checkAuth, checkRole } = require("../Middlewares/authMiddleware.js");
const {
  tokenValidator,
  validateMiddleware,
} = require("../Validators/authValidators.js");
Router.post(
  "/create",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("manager"),
  createTicket
);
Router.get(
  "/allTickets",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("manager"),
  getAllTickets
);
Router.get(
  "/ticketByID/:ticketID",
  tokenValidator,
  validateMiddleware,
  checkAuth,
  checkRole("manager"),
  getTicketByID
);

module.exports = Router;