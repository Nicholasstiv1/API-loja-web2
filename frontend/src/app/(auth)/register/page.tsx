"use client";
import { useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useAuth } from "../../../lib/auth.context";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("cliente");
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    try {
      await register(name, email, password, userType);
      alert("Usuário registrado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      setUserType("cliente");
      router.push("/login");
    } catch (err) {
      console.log(err);
      alert("Erro ao registrar");
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Registrar</h1>
      <div>
        <Label htmlFor="name">Nome</Label>
        <TextInput
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <div>
        <Label htmlFor="userType">Tipo de usuário</Label>
        <Select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </Select>
      </div>
      <Button color="blue" onClick={handleRegister}>
        Registrar
      </Button>
    </div>
  );
}
