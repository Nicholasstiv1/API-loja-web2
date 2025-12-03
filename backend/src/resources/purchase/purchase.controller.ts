import { Request, Response } from "express";
import { PurchaseService } from "./purchase.service";

export const purchaseController = {
  async create(req: Request, res: Response) {
    const userId = req.session.userId;
    const { items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      throw new Error("invalid_data");
    }

    const purchase = await PurchaseService.createPurchase({ userId, items });
    res.status(201).json(purchase);
  },

  async getByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      throw new Error("invalid_user_id");
    }

    const purchases = await PurchaseService.getPurchasesByUser(userId);
    res.json(purchases);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new Error("invalid_purchase_id");
    }

    const purchase = await PurchaseService.getPurchaseById(id);

    if (!purchase) {
      throw new Error("purchase_not_found");
    }

    res.json(purchase);
  },

  async getMe(req: Request, res: Response) {
    const userId = req.session.userId;
    if (!userId) throw new Error("not_authenticated");
    const purchases = await PurchaseService.getPurchasesByUser(userId);
    res.json(purchases);
  },
};
