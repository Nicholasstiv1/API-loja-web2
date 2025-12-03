import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../../middlewares/validate";

const router = Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

router.post("/logout", requireAuth, userController.logout);
router.get("/me", requireAuth, userController.getMe);

router.get("/", requireAuth, requireAdmin, userController.list);

router.get("/:id", requireAuth, userController.getById);
router.put("/:id", requireAuth, userController.update);
router.delete("/:id", requireAuth, requireAdmin, userController.delete);

export default router;
