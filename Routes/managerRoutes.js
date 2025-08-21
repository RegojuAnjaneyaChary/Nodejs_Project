const express = require("express");
const Router = express.Router();
const {createTicket, getAllTickets, getTicketsById, getAllemployees}= require("../Controllers/managersControllers.js") 
const{checkAuth, checkRole}= require("../Middlewares/authMiddleware.js")
const {tokenValidator, validateMiddleware}= require("../Validators/authValidators.js")

Router.get("/getAllemployeeList", tokenValidator, validateMiddleware, checkAuth, checkRole("managers"), getAllemployees)
Router.post("/create", tokenValidator, validateMiddleware, checkAuth, checkRole("managers"), createTicket);
Router.get("/allTickets", tokenValidator, validateMiddleware, checkAuth, checkRole("managers"), getAllTickets);
Router.get("/ticketByID/:ticketID", tokenValidator, validateMiddleware,  checkAuth, checkRole("managers"), getTicketsById);
module.exports = Router;
