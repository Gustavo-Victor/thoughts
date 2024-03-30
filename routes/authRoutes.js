import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";


const router = Router(); 


router.get("/login", AuthController.login);
router.get("/logout", AuthController.logout); 
router.get("/register", AuthController.register);
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser); 

export default router;

