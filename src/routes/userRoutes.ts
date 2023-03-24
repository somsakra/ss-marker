import { Router } from "express";
import checkAuth from "../middleware/auth";
import {
  userSignUp,
  userLogin,
  getUserInfo,
} from "../controllers/userController";

const router = Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.post("/info", checkAuth, getUserInfo);

export default router;
