import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged,
  signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth } from '@/firebase-config';

type Usuario = User & { name: string; initials: string };
type AuthContextType = {
  login: number; user: Usuario | null; pronto: boolean;
  entrar: () => Promise<void>;
  entrarEmail: (email: string, senha: string, criar?: boolean) => Promise<void>;
  visitante: () => Promise<void>; sair: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);
function exigirAuth() {
  if (!auth) throw new Error('O Firebase ainda não foi configurado neste aplicativo.');
  return auth;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(!auth);
  useEffect(() => {
    if (!auth) return;
    // Só o Firebase decide se existe sessão. O botão não simula um usuário logado.
    return onAuthStateChanged(auth, (usuario) => {
      if (!usuario) setUser(null);
      else {
        const name = usuario.displayName || usuario.email?.split('@')[0] || 'Cidadão';
        setUser(Object.assign(usuario, {
          name, initials: name.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase(),
        }));
      }
      setPronto(true);
    });
  }, []);
  async function entrar() {
    const sessao = exigirAuth();
    if (Platform.OS === 'web') {
      await signInWithPopup(sessao, new GoogleAuthProvider());
      return;
    }
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      throw new Error('No Expo Go, entre com e-mail e senha. O Google no Android/iOS precisa de uma build de desenvolvimento configurada.');
    }
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) throw new Error('Configure o Client ID do Google no projeto.');
    // O módulo nativo não existe no Expo Go; só é importado na build do aplicativo.
    const { GoogleSignin, isSuccessResponse } = await import('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
    await GoogleSignin.hasPlayServices();
    const resultado = await GoogleSignin.signIn();
    if (!isSuccessResponse(resultado) || !resultado.data.idToken) throw new Error('Login Google cancelado.');
    await signInWithCredential(sessao, GoogleAuthProvider.credential(resultado.data.idToken));
  }
  async function entrarEmail(email: string, senha: string, criar = false) {
    if (criar) await createUserWithEmailAndPassword(exigirAuth(), email.trim(), senha);
    else await signInWithEmailAndPassword(exigirAuth(), email.trim(), senha);
  }
  async function sair() { if (auth) await signOut(auth); }
  return <AuthContext.Provider value={{ login: user ? 1 : 0, user, pronto, entrar, entrarEmail, visitante: sair, sair }}>
    {children}
  </AuthContext.Provider>;
}
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('AuthProvider não encontrado.');
  return contexto;
}
