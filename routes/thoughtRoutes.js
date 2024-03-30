import { Router } from "express"; 
import { ThoughtController } from "../controllers/ThoughtController.js";
import { checkAuth } from "../helpers/auth.js";

const router = Router(); 


router.get("/", ThoughtController.showThoughts); 
router.get("/add", checkAuth, ThoughtController.register); 
router.get("/edit/:id", checkAuth, ThoughtController.edit); 
router.post("/add", checkAuth, ThoughtController.registerThought); 
router.post("/edit", checkAuth, ThoughtController.editThought); 
router.post("/delete", checkAuth, ThoughtController.deleteThought); 
router.get("/dashboard", checkAuth, ThoughtController.dashboard); 


export default router;
