import { Router } from 'express';
import ProfileController from "../controllers/profile.controller.js";

const profileRouter = Router();

profileRouter.get('/', ProfileController.homePage);

profileRouter.get('/register', ProfileController.registrationPage);

profileRouter.get('/login', ProfileController.loginPage);

profileRouter.get('/profile', ProfileController.profilePage);

export default profileRouter