"use client";
import { useEffect, useState } from "react";
import { Card } from "flowbite-react";

interface PurchaseItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface Purchase {
  id: number;
  items: PurchaseItem[];
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/purchase/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setPurchases(data);
        } else {
          console.error("Erro ao carregar compras");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Carregando compras...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Minhas Compras
      </h1>

      {purchases.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Você ainda não realizou nenhuma compra.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="shadow-md">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                Compra #{purchase.id}
              </h5>
              <ul className="mt-2 space-y-2">
                {purchase.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
