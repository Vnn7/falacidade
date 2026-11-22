import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '@/components/AppComponents';
import { STATUS, TIPOS } from '@/constants/status';
import { Colors } from '@/constants/theme';
import { buscarOcorrencia } from '@/services/ocorrencias';
import { mensagemDoErro } from '@/services/erros';
import type { Ocorrencia } from '@/types/ocorrencia';

export default function DetalheScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true); setErro(null); setOcorrencia(null);
    if (!id) { setErro('Reporte não informado.'); setCarregando(false); return; }
    buscarOcorrencia(id).then((item) => {
      if (ativo) { setOcorrencia(item); if (!item) setErro('Reporte não encontrado.'); }
    }).catch((falha) => { if (ativo) setErro(mensagemDoErro(falha)); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id]));
  return <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.content}>
      <Button title="Voltar" outline onPress={() => router.canGoBack() ? router.back() : router.replace('/lista-de-reportes')} />
      {carregando && <ActivityIndicator color={Colors.green} />}
      {erro && <Text accessibilityRole="alert" style={{ color: Colors.red }}>{erro}</Text>}
      {ocorrencia && <Card>
        <Text style={styles.titulo}>{ocorrencia.titulo}</Text>
        <Text style={[styles.texto, { color: STATUS[ocorrencia.status].cor, fontWeight: '700' }]}>{STATUS[ocorrencia.status].rotulo}</Text>
        <Text style={styles.texto}>{TIPOS[ocorrencia.tipo]}</Text>
        {ocorrencia.descricao && <Text style={styles.texto}>{ocorrencia.descricao}</Text>}
        {ocorrencia.endereco && <Text style={styles.texto}>{ocorrencia.endereco}</Text>}
        <Text style={styles.texto}>Latitude: {ocorrencia.latitude.toFixed(6)} · Longitude: {ocorrencia.longitude.toFixed(6)}</Text>
        <Text style={styles.texto}>{ocorrencia.criadoEm?.toLocaleString('pt-BR') || 'Data não informada'}</Text>
        <Text style={styles.id}>Identificador: {ocorrencia.id}</Text>
      </Card>}
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, content: { padding: 20, gap: 16 },
  titulo: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  texto: { color: Colors.muted, fontSize: 15, lineHeight: 22, marginTop: 12 },
  id: { color: Colors.faint, fontSize: 12, marginTop: 16 },
});
