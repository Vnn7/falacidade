import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, LoginStatus } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const { entrar, visitante } = useAuth();

  function fazerLogin() {
    entrar();
    router.replace({
      pathname: '/(tabs)/mapa',
      params: { login: '1' }
    });
  }

  function entrarSemLogin() {
    visitante();
    router.replace({
      pathname: '/(tabs)/mapa',
      params: { login: '0' }
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FB</Text>
        </View>

        <Text style={styles.title}>Falaa Buraco!!</Text>
        <Text style={styles.subtitle}>
          Reporte, acompanhe e confirme a correção de buracos na sua cidade.
        </Text>

        <LoginStatus />

        <Button
          title="Entrar com Google"
          icon="logo-google"
          onPress={fazerLogin}
          style={styles.loginButton}
        />

        <Text style={styles.legal}>
          Ao continuar, você concorda com os Termos e a Política de Privacidade (LGPD).
        </Text>

        <Pressable style={styles.guest} onPress={entrarSemLogin}>
          <Text style={styles.guestText}>Ver mapa sem login</Text>
          <Ionicons name="chevron-forward" size={15} color={Colors.green} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green
  },
  logoText: { color: Colors.white, fontSize: 24, fontWeight: '900' },
  title: { marginTop: 17, color: Colors.text, fontSize: 23, fontWeight: '900' },
  subtitle: {
    maxWidth: 290,
    marginTop: 8,
    color: Colors.muted,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19
  },
  loginButton: { width: '100%', maxWidth: 300, marginTop: 16 },
  legal: {
    maxWidth: 270,
    marginTop: 13,
    color: Colors.faint,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15
  },
  guest: {
    marginTop: 17,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  guestText: { color: Colors.green, fontSize: 12, fontWeight: '700' }
});
