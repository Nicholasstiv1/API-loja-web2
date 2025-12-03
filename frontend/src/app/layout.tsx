import type { Metadata } from "next";
import { CartProvider } from "../lib/cart.context";
import { AuthProvider } from "../lib/auth.context";
import "./globals.css";
import { NavBar } from "@/components/navBar";

export const metadata: Metadata = {
  title: "Minha Loja",
  description: "Aplicação de carrinho",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            <NavBar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
