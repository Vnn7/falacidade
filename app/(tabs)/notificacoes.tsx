import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, LoginStatus } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

const notificacoes = [
  ['construct-outline', 'Ocorrência #A1B2 atualizada', 'A prefeitura marcou a ocorrência como “Em execução”.', 'Hoje, 14:20'],
  ['checkmark-circle-outline', 'Ocorrência resolvida', 'A ocorrência da Av. Beira Rio foi marcada como resolvida.', 'Ontem, 09:11'],
  ['heart-outline', 'Novo apoio', '3 pessoas apoiaram uma ocorrência que você reportou.', '12/08, 18:40']
] as const;

export default function NotificacoesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Notificações</Text></View>
      <ScrollView contentContainerStyle={styles.content}>
        <LoginStatus />
        {notificacoes.map(([icon, title, text, time]) => (
          <Card key={title} style={styles.row}>
            <View style={styles.icon}><Ionicons name={icon} size={20} color={Colors.green} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{title}</Text>
              <Text style={styles.itemText}>{text}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 60, justifyContent: 'center', paddingHorizontal: 18, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 16, fontWeight: '900', color: Colors.text },
  content: { padding: 16, gap: 9 },
  row: { flexDirection: 'row', gap: 10 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { color: Colors.text, fontSize: 12.5, fontWeight: '800' },
  itemText: { marginTop: 3, color: Colors.muted, fontSize: 11, lineHeight: 16 },
  time: { marginTop: 6, color: Colors.faint, fontSize: 9.5 }
});
