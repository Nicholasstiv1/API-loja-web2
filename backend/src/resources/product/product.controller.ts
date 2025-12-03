import { Request, Response } from "express";
import { productService } from "./product.service";

export const productController = {
  async list(req: Request, res: Response) {
    const products = await productService.list();
    res.json(products);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = await productService.getById(id);

    if (!product) {
      throw new Error("product_not_found");
    }

    res.json(product);
  },

  async create(req: Request, res: Response) {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const product = await productService.update(id, req.body);

    if (!product) {
      throw new Error("product_not_found");
    }

    res.json(product);
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    const deleted = await productService.delete(id);

    if (!deleted) {
      throw new Error("product_not_found");
    }

    res.status(204).send();
  },
};
