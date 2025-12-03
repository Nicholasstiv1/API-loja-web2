import { PrismaClient } from "@prisma/client";
import { ProductDTO } from "./product.types";

const prisma = new PrismaClient();

export const productService = {
  async list() {
    return prisma.product.findMany();
  },

  async getById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  },

  async create(data: ProductDTO) {
    return prisma.product.create({ data });
  },

  async update(id: number, data: Partial<ProductDTO>) {
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  },
};
