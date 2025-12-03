"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
  userType: string;
} | null;

type AuthContextType = {
  user: User | undefined;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    userType: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário logado", err);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      throw new Error("Erro no login");
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    userType: string
  ) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, userType }),
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      throw new Error("Erro ao registrar");
    }
  }

  async function logout() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      setUser(null);
    } else {
      throw new Error("Erro ao fazer logout");
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
