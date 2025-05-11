import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { addActivity, deleteActivityById } from "../controllers/activityController";

const router = express.Router();

router.post("/add", authenticateToken, addActivity);
router.post("/remove/:id", authenticateToken, deleteActivityById);

// router.post("/login", login);

export default router;
