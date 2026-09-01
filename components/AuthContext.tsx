import { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  name: string;
  email: string;
  initials: string;
} | null;

type AuthContextType = {
  login: number;
  user: User;
  role: string;
  entrar: () => void;
  visitante: () => void;
  sair: () => void;
  abrirPrefeitura: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [login, setLogin] = useState(0);
  const [user, setUser] = useState<User>(null);
  const [role, setRole] = useState('cidadao');

  function entrar() {
    setLogin(1);
    setUser({
      name: 'Marcelo A.',
      email: 'malveslinck@gmail.com',
      initials: 'MA'
    });
    setRole('cidadao');
  }

  function visitante() {
    setLogin(0);
    setUser({
      name: 'Visitante',
      email: 'Sem login',
      initials: 'VI'
    });
    setRole('visitante');
  }

  function sair() {
    setLogin(0);
    setUser(null);
    setRole('cidadao');
  }

  function abrirPrefeitura() {
    setRole('prefeitura');
  }

  return (
    <AuthContext.Provider
      value={{ login, user, role, entrar, visitante, sair, abrirPrefeitura }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext não encontrado');
  }

  return context;
}
