"use client";
import { useEffect, useState } from "react";
import { Card, TextInput, Button } from "flowbite-react";
import { useCart } from "../lib/cart.context";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { addItem, updateQuantity, state } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Erro ao carregar produtos");
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().startsWith(search.toLowerCase()) ||
      (p.description?.toLowerCase().startsWith(search.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Produtos disponíveis
      </h1>

      <div className="flex justify-center mb-8">
        <TextInput
          type="text"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const cartItem = state.items.find((i) => i.productId === product.id);

          return (
            <Card
              key={product.id}
              className="shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {product.name}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {product.description || "Sem descrição"}
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Estoque: {product.stock}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  color="gray"
                  size="xs"
                  onClick={() =>
                    cartItem ? updateQuantity(product.id, -1) : null
                  }
                  disabled={!cartItem}
                >
                  -
                </Button>
                <span className="px-2 text-gray-900 dark:text-white">
                  {cartItem?.quantity ?? 0}
                </span>
                <Button
                  color="gray"
                  size="xs"
                  onClick={() =>
                    cartItem
                      ? updateQuantity(product.id, +1)
                      : addItem(
                          {
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            stock: product.stock,
                          },
                          1
                        )
                  }
                  disabled={cartItem?.quantity === product.stock}
                >
                  +
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
