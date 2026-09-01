import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Field, LoginStatus, MapBox, Pill, Pin } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { Colors } from '@/constants/theme';

const ocorrencias = [
  { id: 'A1B2', endereco: 'Rua das Palmeiras, 245', status: 'Em execução', severidade: 'Moderado', top: '20%' as const, left: '20%' as const, cor: Colors.red },
  { id: 'C3D4', endereco: 'Av. Getúlio Vargas, 12', status: 'Reconhecida', severidade: 'Moderado', top: '37%' as const, left: '58%' as const, cor: Colors.amber },
  { id: 'E5F6', endereco: 'Av. Beira Rio, 900', status: 'Resolvida', severidade: 'Leve', top: '63%' as const, left: '32%' as const, cor: Colors.blue },
  { id: 'G7H8', endereco: 'Rua 13 de Junho, 55', status: 'Aberta', severidade: 'Grave', top: '78%' as const, left: '75%' as const, cor: Colors.red }
];

export default function MapaScreen() {
  const params = useLocalSearchParams<{ login?: string }>();
  const { login, user } = useAuth();
  const [filtro, setFiltro] = useState('Todos');

  function abrirDetalhe(item: (typeof ocorrencias)[number]) {
    router.push({
      pathname: '/detalhe',
      params: {
        id: item.id,
        endereco: item.endereco,
        status: item.status,
        severidade: item.severidade
      }
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.city}>Cuiabá, MT</Text>
          <Text style={styles.loginInfo}>login local: {params.login ?? '-'} · global: {login}</Text>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/explore')} style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.initials ?? 'MA'}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LoginStatus />
        <Field icon="search-outline" placeholder="Buscar endereço, bairro..." />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {['Todos', 'Abertos', 'Em execução', 'Resolvidos'].map((item) => (
            <Pill key={item} text={item} active={filtro === item} onPress={() => setFiltro(item)} />
          ))}
        </ScrollView>

        <MapBox>
          {ocorrencias.map((item) => (
            <Pin key={item.id} top={item.top} left={item.left} color={item.cor} onPress={() => abrirDetalhe(item)} />
          ))}
          <View style={styles.legend}>
            <Text style={styles.legendText}>124 ocorrências nesta área — toque em um pino</Text>
          </View>
        </MapBox>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/reporte')}>
        <Ionicons name="add" size={30} color={Colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    minHeight: 60,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  city: { color: Colors.text, fontSize: 15, fontWeight: '800' },
  loginInfo: { marginTop: 2, color: Colors.faint, fontSize: 9.5 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.panel2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: { color: Colors.muted, fontSize: 11, fontWeight: '800' },
  content: { padding: 16, gap: 10, paddingBottom: 90 },
  filters: { gap: 6 },
  legend: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9
  },
  legendText: { color: Colors.muted, fontSize: 9.5 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 82,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  }
});
