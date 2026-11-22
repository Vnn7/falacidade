import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Pill, SectionTitle } from '@/components/AppComponents';
import { useAuth } from '@/components/AuthContext';
import { TIPOS } from '@/constants/status';
import { Colors } from '@/constants/theme';
import { useCidade } from '@/hooks/use-cidade';
import { criarReporte } from '@/services/reportes';
import { mensagemDoErro } from '@/services/erros';
import type { TipoReporte } from '@/types/ocorrencia';

export default function NovoReporte() {
  const { user } = useAuth();
  const { coordenadas, status, atualizar } = useCidade();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<TipoReporte>('buraco');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [semEndereco, setSemEndereco] = useState(false);
  const bloqueado = useRef(false);

  async function enviar() {
    if (bloqueado.current || enviado) return;
    setErro(null);
    if (!titulo.trim()) { setErro('Título obrigatório. Diga onde está o problema.'); return; }
    if (!user) { setErro('Login necessário. Entre na sua conta para reportar.'); return; }
    if (!coordenadas) { setErro('Localização indisponível. Ative a localização do aparelho.'); return; }
    // A ref bloqueia dois toques no mesmo instante, antes do React redesenhar o botão.
    bloqueado.current = true; setEnviando(true);
    try {
      let endereco: string | null = null;
      try {
        // Extra: o endereço é útil, mas uma falha neste serviço não perde o reporte.
        const [local] = await Location.reverseGeocodeAsync(coordenadas);
        if (local) endereco = [local.street, local.streetNumber, local.district,
          local.city ?? local.subregion, local.region].filter(Boolean).join(', ') || null;
      } catch { /* O GPS continua válido mesmo sem endereço legível. */ }
      await criarReporte({
        idNotificante: user.uid, titulo, descricao, tipo,
        latitude: coordenadas.latitude, longitude: coordenadas.longitude, endereco,
      });
      setSemEndereco(!endereco);
      setEnviado(true);
    } catch (falha) { setErro(mensagemDoErro(falha)); }
    finally { bloqueado.current = false; setEnviando(false); }
  }

  return <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Pressable accessibilityLabel="Fechar reporte" disabled={enviando} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/mapa')}>
        <Ionicons name="close" size={26} color={Colors.muted} />
      </Pressable>
      <Text style={styles.title}>Novo reporte</Text><View style={{ width: 26 }} />
    </View>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {enviado ? <>
          <Ionicons name="checkmark-circle" size={56} color={Colors.green} />
          <Text accessibilityRole="alert" style={styles.title}>Reporte enviado!</Text>
          <Text style={styles.texto}>Obrigado por ajudar a cidade. Seu reporte foi gravado no Firebase.</Text>
          {semEndereco && <Text style={styles.texto}>Salvamos as coordenadas. O serviço de endereço estava indisponível.</Text>}
          <Button title="Voltar ao mapa" onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/mapa')} />
        </> : <>
          <Text style={styles.texto}>Descreva o problema. Vamos usar a posição atual do seu aparelho.</Text>
          {!user && <View style={styles.aviso}><Text style={styles.texto}>Entre para enviar um reporte.</Text>
            <Button title="Ir para o login" outline onPress={() => router.push('/(tabs)')} /></View>}
          <SectionTitle>Título obrigatório</SectionTitle>
          <TextInput accessibilityLabel="Título do reporte" placeholder="Ex.: Buraco na Rua das Palmeiras"
            value={titulo} onChangeText={setTitulo} maxLength={120} editable={!enviando} style={styles.campo} />
          <SectionTitle>Tipo de problema</SectionTitle>
          <View style={styles.tipos}>
            {(Object.keys(TIPOS) as TipoReporte[]).map((chave) => <Pill key={chave} text={TIPOS[chave]} active={tipo === chave}
              onPress={() => { if (!enviando) setTipo(chave); }} />)}
          </View>
          <SectionTitle>Descrição (opcional)</SectionTitle>
          <TextInput accessibilityLabel="Descrição do reporte" placeholder="Conte mais detalhes..."
            value={descricao} onChangeText={setDescricao} maxLength={2000} multiline editable={!enviando} style={[styles.campo, styles.grande]} />
          <SectionTitle>Localização atual</SectionTitle>
          <Text style={styles.texto}>{coordenadas
            ? 'Latitude: ' + coordenadas.latitude.toFixed(6) + ' · Longitude: ' + coordenadas.longitude.toFixed(6)
            : status === 'carregando' ? 'Buscando localização...' : 'Localização indisponível.'}</Text>
          {!coordenadas && <Button title="Buscar localização" outline disabled={enviando || status === 'carregando'} onPress={() => void atualizar()} />}
          {erro && <Text accessibilityRole="alert" style={styles.erro}>{erro}</Text>}
          {enviando && <ActivityIndicator accessibilityLabel="Enviando reporte" color={Colors.green} />}
          <Button title={enviando ? 'Enviando...' : 'Enviar reporte'} disabled={enviando} onPress={() => void enviar()} />
          <Button title="Cancelar" outline disabled={enviando} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/mapa')} />
        </>}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white },
  title: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  content: { padding: 20, gap: 14 }, texto: { color: Colors.muted, fontSize: 14, lineHeight: 21 },
  campo: { borderRadius: 12, padding: 14, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, color: Colors.text, fontSize: 15 },
  grande: { minHeight: 120, textAlignVertical: 'top' }, tipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aviso: { padding: 14, gap: 10, backgroundColor: Colors.greenSoft, borderRadius: 12 },
  erro: { color: Colors.red, fontSize: 14, lineHeight: 21 },
});
