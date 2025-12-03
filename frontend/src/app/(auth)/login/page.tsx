"use client";
import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../../lib/auth.context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    try {
      await login(email, password);
      alert("Login realizado com sucesso!");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      console.log(err);
      alert("Erro no login");
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <div>
        <Label htmlFor="email">Email</Label>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button color="blue" onClick={handleLogin}>
        Entrar
      </Button>
    </div>
  );
}
