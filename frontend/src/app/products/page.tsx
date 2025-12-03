"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth.context";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      alert("Você precisa estar logado para acessar esta página.");
      router.push("/login");
    } else if (user.userType !== "admin") {
      alert("Você não tem permissão para acessar esta página.");
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }

    loadProducts();
  }, []);

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
    } else {
      setEditingProduct(null);
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
    }
    setShowModal(true);
  }

  async function reloadProducts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro ao recarregar produtos:", error);
    }
  }

  async function handleSave() {
    const payload = { name, description, price, stock };

    if (editingProduct) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      if (res.ok) {
        alert("Produto atualizado com sucesso!");
        await reloadProducts();
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (res.ok) {
        alert("Produto criado com sucesso!");
        await reloadProducts();
      }
    }

    setShowModal(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      alert("Produto excluído com sucesso!");
      await reloadProducts();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Produtos</h1>

      <button
        onClick={() => openModal()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        + Novo Produto
      </button>

      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <h2 className="text-lg font-bold">{p.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {p.description}
            </p>
            <p className="mt-2">R$ {p.price.toFixed(2)}</p>
            <p>Estoque: {p.stock}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openModal(p)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Preço"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
