import { Router } from "express";
import { userSignUp, userLogin } from "../controllers/userController";

const router = Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);

export default router;
