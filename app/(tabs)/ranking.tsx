import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, LoginStatus } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

const ranking = [
  ['1', 'Ana Paula', '28 reportes', '790 pts'],
  ['2', 'Carlos M.', '24 reportes', '710 pts'],
  ['3', 'Rafael S.', '21 reportes', '655 pts'],
  ['4', 'Marcelo A.', '12 reportes', '420 pts'],
  ['5', 'João V.', '11 reportes', '390 pts']
];

export default function RankingScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Ranking</Text></View>
      <ScrollView contentContainerStyle={styles.content}>
        <LoginStatus />
        <Text style={styles.subtitle}>Usuários que mais colaboraram com reportes na cidade.</Text>
        {ranking.map(([posicao, nome, reportes, pontos]) => (
          <Card key={posicao} style={styles.row}>
            <View style={styles.position}><Text style={styles.positionText}>{posicao}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{nome}</Text>
              <Text style={styles.meta}>{reportes}</Text>
            </View>
            <Text style={styles.points}>{pontos}</Text>
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
  subtitle: { color: Colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  position: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  positionText: { color: Colors.green, fontWeight: '900' },
  name: { color: Colors.text, fontWeight: '800', fontSize: 13 },
  meta: { marginTop: 2, color: Colors.muted, fontSize: 10.5 },
  points: { color: Colors.green, fontWeight: '800', fontSize: 12 }
});
