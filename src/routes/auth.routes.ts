import express from "express";
const router = express.Router();
import { ValidateBody } from "../middleware/validat";
import { admin_user_schema } from "../schemas/auth.schemas";
import { signup } from "../controler/auth.controler";
import { login } from "../controler/auth.controler";

router.post("/signup", ValidateBody(admin_user_schema), signup);
router.post("/login", ValidateBody(admin_user_schema), login);

export default router;
