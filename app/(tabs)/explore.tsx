import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, LoginStatus } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { Colors } from '@/constants/theme';
import { mensagemDoErro } from '@/services/erros';

export default function PerfilScreen() {
  const { user, sair } = useAuth();
  const [erro, setErro] = useState<string | null>(null);
  async function logout() {
    try { await sair(); router.replace('/(tabs)'); }
    catch (falha) { setErro(mensagemDoErro(falha)); }
  }
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <Text style={styles.title}>Perfil</Text>
    <ScrollView contentContainerStyle={styles.content}>
      <LoginStatus />
      <Card><View style={styles.profile}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.initials || 'VI'}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.name}>{user?.name || 'Visitante'}</Text>
          <Text style={styles.email}>{user?.email || 'Entre para criar e acompanhar seus reportes.'}</Text></View>
      </View></Card>
      <Button title="Ver reportes" icon="list-outline" onPress={() => router.push('/lista-de-reportes')} />
      {user ? <>
        <Button title="Meus reportes" outline onPress={() => router.push({ pathname: '/lista-de-reportes', params: { meus: '1' } })} />
        <Button title="Criar reporte" outline onPress={() => router.push('/novo-reporte')} />
        <Button title="Sair da conta" icon="log-out-outline" outline onPress={() => void logout()} />
      </> : <Button title="Entrar na conta" outline onPress={() => router.push('/(tabs)')} />}
      {erro && <Text accessibilityRole="alert" style={{ color: Colors.red }}>{erro}</Text>}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  title: { padding: 18, backgroundColor: Colors.white, fontSize: 22, fontWeight: '800', color: Colors.text },
  content: { padding: 16, gap: 14 }, profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.green, fontWeight: '800' }, name: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  email: { marginTop: 5, color: Colors.muted, fontSize: 14 },
});
