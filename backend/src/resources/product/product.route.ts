import { Router } from "express";
import { productController } from "./product.controller";
import { validate, productSchema } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";

const router = Router();

router.get("/", productController.list);
router.get("/:id", productController.getById);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate(productSchema),
  productController.create,
);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validate(productSchema),
  productController.update,
);
router.delete("/:id", requireAuth, requireAdmin, productController.delete);

export default router;
