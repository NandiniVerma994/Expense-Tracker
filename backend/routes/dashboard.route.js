import { getDashboardData } from "../controllers/dashboard.controller.js";
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate);
// Dashboard routes 
router.get("/getData", getDashboardData);

export default router;