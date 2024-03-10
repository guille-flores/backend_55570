import UserController from "../controllers/user.controller.js";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);

usersRouter.delete('/', UserController.deleteUsers);

export default usersRouter