import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, LoginStatus, Pill, SectionTitle } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

const fila = [
  ['G7H8', 'Rua 13 de Junho, 55', 'Grave · aberta há 32 dias'],
  ['C3D4', 'Av. Getúlio Vargas, 12', 'Moderado · aberta há 5 dias'],
  ['A1B2', 'Rua das Palmeiras, 245', 'Leve · aberta há 2 dias']
];

export default function PrefeituraScreen() {
  const [aba, setAba] = useState('Novas (14)');
  const [selecionada, setSelecionada] = useState(fila[0]);
  const [foto, setFoto] = useState(false);

  function resolver() {
    if (!foto) return;
    router.push({ pathname: '/detalhe', params: { id: selecionada[0], endereco: selecionada[1], status: 'Resolvida' } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={22} color={Colors.muted} /></Pressable>
        <Text style={styles.title}>Secretaria de Obras</Text>
        <View style={styles.official}><Text style={styles.officialText}>OFICIAL</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LoginStatus />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          {['Novas (14)', 'Em execução (6)', 'Resolvidas'].map((item) => <Pill key={item} text={item} active={aba === item} onPress={() => setAba(item)} />)}
        </ScrollView>

        {fila.map((item) => (
          <Pressable key={item[0]} onPress={() => setSelecionada(item)}>
            <Card style={[styles.row, selecionada[0] === item[0] ? styles.selected : {}]}>
              <View style={styles.thumb}><Ionicons name="image-outline" size={19} color={Colors.faint} /></View>
              <View style={{ flex: 1 }}><Text style={styles.address}>{item[1]}</Text><Text style={styles.meta}>{item[2]}</Text></View>
            </Card>
          </Pressable>
        ))}

        <SectionTitle>Ação rápida — ocorrência selecionada</SectionTitle>
        <Pressable style={[styles.photo, foto && styles.photoDone]} onPress={() => setFoto(!foto)}>
          <Ionicons name={foto ? 'checkmark-circle-outline' : 'camera-outline'} size={24} color={foto ? Colors.white : Colors.muted} />
          <Text style={[styles.photoText, foto && { color: Colors.white }]}>{foto ? 'Foto anexada' : 'Anexar foto do buraco tapado'}</Text>
        </Pressable>

        <View style={styles.actions}>
          <Button title="Reconhecer" outline onPress={() => {}} style={{ flex: 1 }} />
          <Button title="Em execução" outline onPress={() => {}} style={{ flex: 1 }} />
        </View>
        <Button title="Marcar resolvida" onPress={resolver} disabled={!foto} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 60, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: Colors.text, fontSize: 15, fontWeight: '900' },
  official: { backgroundColor: Colors.greenSoft, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5 },
  officialText: { color: Colors.green, fontSize: 9.5, fontWeight: '900' },
  content: { padding: 16, gap: 9, paddingBottom: 28 },
  pills: { gap: 7 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 9 },
  selected: { borderColor: Colors.green },
  thumb: { width: 44, height: 44, borderRadius: 9, backgroundColor: Colors.panel2, alignItems: 'center', justifyContent: 'center' },
  address: { color: Colors.text, fontSize: 11.5, fontWeight: '800' },
  meta: { marginTop: 2, color: Colors.muted, fontSize: 10 },
  photo: { minHeight: 78, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: Colors.panel },
  photoDone: { backgroundColor: '#aebdca', borderColor: '#aebdca', borderStyle: 'solid' },
  photoText: { color: Colors.muted, fontSize: 10.5 },
  actions: { flexDirection: 'row', gap: 7 }
});
