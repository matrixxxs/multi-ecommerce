import express from "express";
import { ValidateBody } from "../middleware/validat";
import {
  forget_password,
  reset_password_schema,
} from "../schemas/reset.schema";
import { resetToken, reset_password } from "../controler/reset.controler";

const routes = express.Router();

routes.post("/forget-password", ValidateBody(forget_password), resetToken);

routes.post(
  "/reset-password",
  ValidateBody(reset_password_schema),
  reset_password,
);

export default routes;
