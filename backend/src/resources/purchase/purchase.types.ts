export interface PurchaseItemDTO {
  productId: number;
  quantity: number;
}

export interface CreatePurchaseDTO {
  userId: number;
  items: PurchaseItemDTO[];
}

export interface PurchaseResponse {
  id: number;
  userId: number;
  items: {
    id: number;
    productId: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  }[];
}
