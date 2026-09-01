import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Field, LoginStatus, SectionTitle } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

export default function DetalheScreen() {
  const params = useLocalSearchParams<{ id?: string; endereco?: string; status?: string; severidade?: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={22} color={Colors.muted} /></Pressable>
        <Text style={styles.title}>Ocorrência #{params.id ?? 'A1B2'}</Text>
        <Ionicons name="flag-outline" size={20} color={Colors.muted} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LoginStatus />
        <View style={styles.photo}><Ionicons name="image-outline" size={40} color={Colors.white} /><Text style={styles.photoLabel}>Foto 1/3 — buraco</Text></View>
        <View style={styles.statusRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{params.status ?? 'Em execução'}</Text></View>
          <Text style={styles.opened}>Severidade: {params.severidade ?? 'Moderado'}</Text>
        </View>

        <Field icon="location-outline" placeholder={params.endereco ?? 'Rua das Palmeiras, 245 — Secretaria de Obras'} />
        <SectionTitle>Histórico</SectionTitle>
        <History title="Prefeitura iniciou a execução — 12/08" text="Equipe agendada para esta semana." />
        <History title="Prefeitura reconheceu a ocorrência — 09/08" />
        <History title="Você reportou — 07/08" />

        <View style={styles.actions}>
          <Button title="Apoiar (34)" icon="heart-outline" outline onPress={() => {}} style={{ flex: 1 }} />
          <Button title="Comentar" icon="chatbubble-outline" outline onPress={() => {}} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function History({ title, text }: { title: string; text?: string }) {
  return (
    <Card style={styles.history}>
      <View style={styles.timelineDot} />
      <View style={{ flex: 1 }}><Text style={styles.historyTitle}>{title}</Text>{text ? <Text style={styles.historyText}>{text}</Text> : null}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 60, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: Colors.text, fontSize: 15, fontWeight: '900' },
  content: { padding: 16, gap: 10, paddingBottom: 28 },
  photo: { height: 190, borderRadius: 18, backgroundColor: '#aab8c8', alignItems: 'center', justifyContent: 'center' },
  photoLabel: { position: 'absolute', bottom: 10, alignSelf: 'center', color: Colors.white, fontSize: 10, backgroundColor: 'rgba(0,0,0,.4)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: Colors.amber, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5 },
  badgeText: { color: Colors.white, fontSize: 9.5, fontWeight: '900', textTransform: 'uppercase' },
  opened: { color: Colors.muted, fontSize: 10.5 },
  history: { flexDirection: 'row', gap: 9 },
  timelineDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: Colors.green, marginTop: 3 },
  historyTitle: { color: Colors.text, fontSize: 11.5, fontWeight: '800' },
  historyText: { marginTop: 3, color: Colors.muted, fontSize: 10.5 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 2 }
});
