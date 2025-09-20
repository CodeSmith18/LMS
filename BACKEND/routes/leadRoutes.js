import express from 'express';
import {
  createLeads,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadControllers.js";
import authMiddleWare from '../middlewares/authMiddleWare.js';

const leadRouter = express.Router();


leadRouter.route("/")
.post(createLeads,authMiddleWare)
.get(getLeads,authMiddleWare)


leadRouter.route("/:id")
.get(getLeadById,authMiddleWare)
.put(updateLead,authMiddleWare)
.delete(deleteLead,authMiddleWare)

export default leadRouter;