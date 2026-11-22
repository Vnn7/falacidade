import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Pill } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { STATUS, TIPOS } from '@/constants/status';
import { Colors } from '@/constants/theme';
import { useOcorrencias } from '@/hooks/use-ocorrencias';

export default function ListaDeReportes() {
  const { meus } = useLocalSearchParams<{ meus?: string }>();
  const { user } = useAuth();
  const [soMeus, setSoMeus] = useState(meus === '1');
  const semLogin = soMeus && !user;
  const { ocorrencias, carregando, erro, recarregar } = useOcorrencias(null, soMeus ? user?.uid : undefined);
  return <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Pressable accessibilityLabel="Voltar" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/mapa')}>
        <Ionicons name="chevron-back" size={24} color={Colors.text} />
      </Pressable><Text style={styles.titulo}>Reportes</Text>
      <Pressable accessibilityLabel="Atualizar reportes" onPress={() => void recarregar()} disabled={carregando}>
        <Ionicons name="refresh-outline" size={24} color={Colors.green} />
      </Pressable>
    </View>
    <View style={styles.filtros}>
      <Pill text="Todos" active={!soMeus} onPress={() => setSoMeus(false)} />
      <Pill text="Meus reportes" active={soMeus} onPress={() => setSoMeus(true)} />
    </View>
    {semLogin ? <View style={styles.aviso}><Text style={styles.texto}>Entre na sua conta para ver seus reportes.</Text>
      <Button title="Ir para login" onPress={() => router.push('/(tabs)')} /></View> : <>
      {erro && <View style={styles.aviso}><Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>
        <Button title="Tentar novamente" outline onPress={() => void recarregar()} /></View>}
      <FlatList data={ocorrencias} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={() => void recarregar()} tintColor={Colors.green} />}
        ListEmptyComponent={carregando ? <ActivityIndicator color={Colors.green} /> : !erro ? <Text style={styles.vazio}>Nenhum reporte ainda.</Text> : null}
        renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={'Ver reporte: ' + item.titulo}
          onPress={() => router.push({ pathname: '/detalhe', params: { id: item.id } })} style={styles.cartao}>
          <View style={[styles.bolinha, { backgroundColor: STATUS[item.status].cor }]} />
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={styles.tituloItem}>{item.titulo}</Text>
            {item.descricao && <Text style={styles.texto}>{item.descricao}</Text>}
            {item.endereco && <Text style={styles.texto}>{item.endereco}</Text>}
            <Text style={{ color: STATUS[item.status].cor, fontWeight: '700' }}>{STATUS[item.status].rotulo} · {TIPOS[item.tipo]}</Text>
            <Text style={styles.data}>{item.criadoEm ? item.criadoEm.toLocaleString('pt-BR') : 'Data não informada'}</Text>
          </View><Ionicons name="chevron-forward" size={20} color={Colors.faint} />
        </Pressable>} />
    </>}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, backgroundColor: Colors.white },
  titulo: { flex: 1, color: Colors.text, fontSize: 22, fontWeight: '800' },
  filtros: { flexDirection: 'row', gap: 10, padding: 16 }, lista: { padding: 16, paddingTop: 0, flexGrow: 1 },
  cartao: { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: Colors.white, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  bolinha: { width: 11, height: 11, borderRadius: 6 }, tituloItem: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  texto: { color: Colors.muted, fontSize: 14, lineHeight: 20 }, data: { color: Colors.muted, fontSize: 12 },
  vazio: { textAlign: 'center', color: Colors.muted, marginTop: 32, fontSize: 16 },
  aviso: { margin: 16, gap: 12 }, erro: { color: Colors.red, lineHeight: 20 },
});
