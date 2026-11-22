import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const configuracao = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Sem configuração o app abre e explica a pendência, sem inventar login ou reportes.
export const firebaseConfigurado = Boolean(configuracao.apiKey && configuracao.authDomain
  && configuracao.projectId && configuracao.appId);
const app = firebaseConfigurado ? (getApps().length ? getApp() : initializeApp(configuracao)) : null;

function iniciarAuth(): Auth | null {
  if (!app) return null;
  if (Platform.OS === 'web') return getAuth(app);
  try {
    // O pacote resolve esta função apenas no bundle React Native.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (erro) {
    if ((erro as { code?: string }).code === 'auth/already-initialized') return getAuth(app);
    throw erro;
  }
}

// Eu uso auth para saber quem entrou na conta.
export const auth = iniciarAuth();
// Desafio 1: eu preparo o Firestore aqui para usar o mesmo banco ao salvar e ao consultar.
export const bancoDeDados = app ? getFirestore(app) : null;

// Usado apenas quando o teste/demo solicita explicitamente um projeto local demo-*.
// Nenhuma credencial real é criada para executar os testes automatizados.
const hostEmulador = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;
if (hostEmulador && auth && bancoDeDados) {
  if (!configuracao.projectId?.startsWith('demo-')) throw new Error('Emuladores exigem um projeto local demo-*.');
  connectAuthEmulator(auth, `http://${hostEmulador}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(bancoDeDados, hostEmulador, 8080);
}

export function exigirBanco() {
  if (!bancoDeDados) throw new Error('O Firebase ainda não foi configurado neste aplicativo.');
  return bancoDeDados;
}
