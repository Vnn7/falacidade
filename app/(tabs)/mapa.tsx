import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, Pill } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { MapaView } from '@/components/mapa-view';
import { STATUS } from '@/constants/status';
import { Colors } from '@/constants/theme';
import { useCidade } from '@/hooks/use-cidade';
import { useOcorrencias } from '@/hooks/use-ocorrencias';
import type { StatusOcorrencia } from '@/types/ocorrencia';

export default function MapaScreen() {
  const { user } = useAuth();
  const { cidade, coordenadas, status, atualizar } = useCidade();
  const { ocorrencias, carregando, erro, recarregar } = useOcorrencias(coordenadas);
  const [filtro, setFiltro] = useState<StatusOcorrencia | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const termo = normalizar(busca.trim());
  const visiveis = ocorrencias.filter((o) => (filtro === 'todos' || o.status === filtro)
    && normalizar(o.titulo + ' ' + (o.descricao ?? '') + ' ' + (o.endereco ?? '')).includes(termo));
  return <SafeAreaView style={styles.safe} edges={['top']}>
    <View style={styles.header}>
      <View><Text style={styles.city}>{cidade || 'Sua cidade'}</Text><Text style={styles.subtitulo}>Cada reporte faz a diferença</Text></View>
      <Pressable accessibilityLabel="Abrir perfil" onPress={() => router.push('/(tabs)/explore')} style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.initials || 'VI'}</Text>
      </Pressable>
    </View>
    <View style={styles.content}>
      <Field icon="search-outline" placeholder="Buscar título ou endereço..." value={busca} onChangeText={setBusca} />
      <ScrollView horizontal style={{ flexGrow: 0 }} contentContainerStyle={styles.filters} showsHorizontalScrollIndicator={false}>
        <Pill text="Todos" active={filtro === 'todos'} onPress={() => setFiltro('todos')} />
        {(Object.keys(STATUS) as StatusOcorrencia[]).map((chave) => <Pill key={chave} text={STATUS[chave].rotulo}
          active={filtro === chave} onPress={() => setFiltro(chave)} />)}
      </ScrollView>
      {carregando && <ActivityIndicator accessibilityLabel="Carregando reportes" color={Colors.green} />}
      {erro && <View style={styles.aviso}><Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>
        <Button title="Tentar novamente" outline onPress={() => void recarregar()} /></View>}
      <View style={styles.mapa}>
        <MapaView key={coordenadas ? 'com-gps' : 'sem-gps'} coordenadas={coordenadas} ocorrencias={visiveis}
          style={{ flex: 1 }} onSelecionar={(id) => router.push({ pathname: '/detalhe', params: { id } })} />
        <View style={styles.legenda}>
          {Object.entries(STATUS).map(([chave, item]) => <Text key={chave} style={{ color: item.cor, fontSize: 12 }}>● {item.rotulo}</Text>)}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Novo reporte" style={styles.fab} onPress={() => router.push('/novo-reporte')}>
          <Ionicons name="add" size={30} color={Colors.white} />
        </Pressable>
      </View>
      {status === 'carregando' && <Text style={styles.subtitulo}>Buscando sua localização...</Text>}
      {(status === 'negado' || status === 'erro') && <View style={styles.aviso}>
        <Text style={styles.subtitulo}>Ative a localização para criar reportes na sua posição.</Text>
        <Button title="Tentar localização novamente" outline onPress={() => void atualizar()} />
      </View>}
      {!carregando && !erro && <Text style={styles.subtitulo}>{visiveis.length ? visiveis.length + ' reporte(s) encontrado(s).' : 'Nenhum reporte encontrado.'}</Text>}
      <Button title="Ver reportes" icon="list-outline" outline onPress={() => router.push('/lista-de-reportes')} />
    </View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white },
  city: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  subtitulo: { color: Colors.muted, fontSize: 13, lineHeight: 19 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.green, fontWeight: '800' },
  content: { flex: 1, padding: 16, gap: 10 }, filters: { gap: 7 },
  mapa: { flex: 1, minHeight: 180, borderRadius: 20, overflow: 'hidden', backgroundColor: '#e5eddf' },
  legenda: { position: 'absolute', top: 12, left: 12, padding: 10, gap: 4, borderRadius: 12, backgroundColor: Colors.white },
  fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  aviso: { padding: 10, gap: 8, borderRadius: 12, backgroundColor: Colors.white }, erro: { color: Colors.red, lineHeight: 20 },
});
