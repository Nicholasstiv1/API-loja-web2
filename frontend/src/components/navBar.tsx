"use client";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Badge,
} from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../lib/cart.context";
import { useAuth } from "../lib/auth.context";
import { useState } from "react";

export function NavBar() {
  const router = useRouter();
  const { totalItems, subtotal, state, clear } = useCart();
  const { user, logout } = useAuth();

  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  async function handlePurchase() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      if (res.ok) {
        alert("Compra realizada com sucesso!");
        clear();
        router.push("/purchases");
      } else {
        alert("Erro ao realizar compra");
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setLogoutMessage("Você saiu da conta com sucesso!");
      router.push("/login");
      setTimeout(() => setLogoutMessage(null), 3000);
    } catch {
      setLogoutMessage("Erro ao fazer logout");
    }
  }

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <Image
          src="/next.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          WebII-Trabalho
        </span>
      </NavbarBrand>

      <div className="flex md:order-2 gap-2 items-center">
        {user && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              🛒 {totalItems} itens
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              R$ {subtotal.toFixed(2)}
            </span>
            <Button
              color="success"
              size="xs"
              disabled={totalItems === 0}
              onClick={handlePurchase}
            >
              Finalizar
            </Button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              👤 {user.name} ({user.userType})
            </span>
            <Button color="gray" size="xs" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <span className="text-sm text-red-600 dark:text-red-400">
            Não logado
          </span>
        )}

        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink href="/" active>
          Home
        </NavbarLink>
        {!user && <NavbarLink href="/login">Login</NavbarLink>}
        {!user && <NavbarLink href="/register">Register</NavbarLink>}
        {user?.userType === "admin" && (
          <>
            <NavbarLink href="/products">Produtos</NavbarLink>
          </>
        )}
        {user && <NavbarLink href="/purchases">Minhas Compras</NavbarLink>}
      </NavbarCollapse>

      {logoutMessage && (
        <div className="absolute top-2 right-2">
          <Badge color={logoutMessage.includes("Erro") ? "failure" : "success"}>
            {logoutMessage}
          </Badge>
        </div>
      )}
    </Navbar>
  );
}
