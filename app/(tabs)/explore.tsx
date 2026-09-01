import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, LoginStatus, SectionTitle } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { Colors } from '@/constants/theme';

export default function PerfilScreen() {
  const { user, login, role, sair, abrirPrefeitura } = useAuth();

  function logout() {
    sair();
    router.replace('/(tabs)');
  }

  function prefeitura() {
    abrirPrefeitura();
    router.push('/prefeitura');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}><Text style={styles.headerTitle}>Perfil</Text><Ionicons name="settings-outline" size={20} color={Colors.muted} /></View>
      <ScrollView contentContainerStyle={styles.content}>
        <LoginStatus />
        <View style={styles.profile}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.initials ?? 'MA'}</Text></View>
          <View>
            <Text style={styles.name}>{user?.name ?? 'Marcelo A.'}</Text>
            <Text style={styles.email}>{user?.email ?? 'malveslinck@gmail.com'}</Text>
            <Text style={styles.session}>login global: {login} · perfil: {role}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          {[['12', 'reportes'], ['8', 'resolvidos'], ['6 dias', 'tempo médio']].map(([number, label]) => (
            <Card key={label} style={styles.stat}><Text style={styles.number}>{number}</Text><Text style={styles.label}>{label}</Text></Card>
          ))}
        </View>

        <SectionTitle>Meus reportes</SectionTitle>
        <Report statusColor={Colors.amber} title="Rua das Palmeiras, 245" text="Em execução · 07/08" />
        <Report statusColor={Colors.blue} title="Av. Beira Rio, 900" text="Confirmada · 22/07" />
        <Report statusColor={Colors.red} title="Rua 13 de Junho, 55" text="Aberta · 15/07" />

        <Pressable style={styles.cityHall} onPress={prefeitura}>
          <Ionicons name="business-outline" size={17} color={Colors.green} />
          <Text style={styles.cityHallText}>Sou da prefeitura — abrir painel oficial</Text>
          <Ionicons name="chevron-forward" size={15} color={Colors.green} />
        </Pressable>

        <Button title="Sair da conta" icon="log-out-outline" outline onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Report({ statusColor, title, text }: { statusColor: string; title: string; text: string }) {
  return (
    <Card style={styles.report}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <View><Text style={styles.reportTitle}>{title}</Text><Text style={styles.reportText}>{text}</Text></View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 60, paddingHorizontal: 18, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: Colors.text },
  content: { padding: 16, gap: 11, paddingBottom: 30 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.panel2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.muted, fontWeight: '800' },
  name: { color: Colors.text, fontSize: 14, fontWeight: '900' },
  email: { marginTop: 2, color: Colors.muted, fontSize: 10.5 },
  session: { marginTop: 2, color: Colors.faint, fontSize: 9.5 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  number: { color: Colors.text, fontSize: 16, fontWeight: '900' },
  label: { marginTop: 2, color: Colors.muted, fontSize: 9.5 },
  report: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  reportTitle: { color: Colors.text, fontSize: 11.5, fontWeight: '800' },
  reportText: { marginTop: 2, color: Colors.muted, fontSize: 10 },
  cityHall: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9 },
  cityHallText: { flex: 1, color: Colors.green, fontSize: 12, fontWeight: '700' }
});
