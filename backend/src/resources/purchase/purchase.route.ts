import { Router } from "express";
import { purchaseController } from "./purchase.controller";

const router = Router();

router.post("/", purchaseController.create);
router.get("/user/:userId", purchaseController.getByUser);
router.get("/me", purchaseController.getMe);

export default router;
