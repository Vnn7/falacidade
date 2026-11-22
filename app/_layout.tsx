import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/components/AuthContext';
import { CidadeProvider } from '@/context/cidade-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CidadeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reporte" options={{ presentation: 'modal' }} />
        <Stack.Screen name="novo-reporte" options={{ presentation: 'modal' }} />
        <Stack.Screen name="lista-de-reportes" />
        <Stack.Screen name="detalhe" />
        <Stack.Screen name="prefeitura" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      </CidadeProvider>
    </AuthProvider>
  );
}
