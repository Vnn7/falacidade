import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, LoginStatus } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { Colors } from '@/constants/theme';
import { firebaseConfigurado } from '@/firebase-config';
import { mensagemDoErro } from '@/services/erros';

export default function LoginScreen() {
  const { entrar, entrarEmail, visitante, pronto, user } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  async function executar(acao: () => Promise<void>) {
    if (ocupado) return;
    setOcupado(true); setErro(null);
    try { await acao(); router.replace('/(tabs)/mapa'); }
    catch (falha) { setErro(mensagemDoErro(falha)); }
    finally { setOcupado(false); }
  }
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.logo}><Text style={styles.logoText}>FB</Text></View>
      <Text style={styles.title}>Falaa Buraco!!</Text>
      <Text style={styles.subtitle}>Sua cidade melhora quando você participa. Reporte e acompanhe problemas perto de você.</Text>
      <LoginStatus />
      {!firebaseConfigurado && <Text style={styles.aviso}>O Firebase ainda precisa ser configurado para ativar o login e os reportes.</Text>}
      {erro && <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>}
      {ocupado || !pronto ? <ActivityIndicator color={Colors.green} /> : null}
      {user && <Button title="Continuar no mapa" onPress={() => router.replace('/(tabs)/mapa')} />}
      <Button title="Entrar com Google" icon="logo-google" disabled={ocupado || !pronto || !firebaseConfigurado} onPress={() => void executar(entrar)} />
      <Text style={styles.subtitle}>Ou use sua conta de e-mail</Text>
      <TextInput accessibilityLabel="E-mail" placeholder="E-mail" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" autoComplete="email" style={styles.campo} />
      <TextInput accessibilityLabel="Senha" placeholder="Senha (mínimo 6 caracteres)" value={senha} onChangeText={setSenha}
        secureTextEntry autoComplete="current-password" style={styles.campo} />
      <Button title="Entrar" disabled={ocupado || !pronto || !firebaseConfigurado || !email.trim() || !senha}
        onPress={() => void executar(() => entrarEmail(email, senha))} />
      <Button title="Criar conta" outline disabled={ocupado || !pronto || !firebaseConfigurado || !email.trim() || senha.length < 6}
        onPress={() => void executar(() => entrarEmail(email, senha, true))} />
      <Button title="Ver mapa sem login" outline disabled={ocupado || !pronto} onPress={() => void executar(visitante)} />
      <Text style={styles.legal}>A localização é usada para posicionar seus reportes. Títulos, descrições e locais ficam visíveis aos visitantes; evite incluir informações pessoais.</Text>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, justifyContent: 'center', alignSelf: 'center', width: '100%', maxWidth: 440, padding: 28, gap: 12 },
  logo: { width: 70, height: 70, alignSelf: 'center', borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.green },
  logoText: { color: Colors.white, fontSize: 24, fontWeight: '900' },
  title: { color: Colors.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: Colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  campo: { backgroundColor: Colors.white, color: Colors.text, borderWidth: 1, borderColor: Colors.border, padding: 14, borderRadius: 12, fontSize: 15 },
  erro: { color: Colors.red, lineHeight: 20 }, aviso: { color: Colors.amber, lineHeight: 20 },
  legal: { color: Colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
