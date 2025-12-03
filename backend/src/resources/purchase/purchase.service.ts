import { PrismaClient } from "@prisma/client";
import { CreatePurchaseDTO, PurchaseResponse } from "./purchase.types";

const prisma = new PrismaClient();

export class PurchaseService {
  static async createPurchase(
    data: CreatePurchaseDTO,
  ): Promise<PurchaseResponse> {
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) throw new Error("Usuário não encontrado");

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error(`Produto ${item.productId} não encontrado`);
      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para produto ${product.name}`);
      }
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: data.userId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return purchase;
  }

  static async getPurchasesByUser(userId: number): Promise<PurchaseResponse[]> {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  static async getPurchaseById(id: number): Promise<PurchaseResponse | null> {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
