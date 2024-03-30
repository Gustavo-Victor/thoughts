import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { checkAuth } from "../helpers/auth.js";

const router = Router(); 


router.get("/", checkAuth, ProfileController.getUser); 
router.get("/edit", checkAuth, ProfileController.editUserForm); 
router.get("/edit-password", checkAuth, ProfileController.editPasswordForm); 
router.post("/edit", checkAuth, ProfileController.editUser); 
router.post("/edit-password", checkAuth, ProfileController.editPassword); 
router.post("/delete", checkAuth, ProfileController.deleteUser); 

export default router;

