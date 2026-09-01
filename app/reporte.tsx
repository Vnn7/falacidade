import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Field, LoginStatus, MapBox, Pill, Pin, SectionTitle } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

export default function ReporteScreen() {
  const [severidade, setSeveridade] = useState('Moderado');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(true);
  const [referencia, setReferencia] = useState(false);

  function enviar() {
    router.replace({
      pathname: '/detalhe',
      params: {
        id: 'N9X1',
        endereco: 'Rua das Palmeiras, 245',
        status: 'Aberta',
        severidade
      }
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.close}><Ionicons name="close" size={23} color={Colors.muted} /></Pressable>
        <Text style={styles.title}>Novo reporte</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LoginStatus />
        <SectionTitle>1. Foto do buraco *</SectionTitle>
        <Pressable style={[styles.photo, foto && styles.photoFilled]} onPress={() => setFoto(!foto)}>
          <Ionicons name={foto ? 'checkmark-circle-outline' : 'camera-outline'} size={25} color={foto ? Colors.white : Colors.muted} />
          <Text style={[styles.photoText, foto && { color: Colors.white }]}>{foto ? 'Foto adicionada — toque para trocar' : 'Adicionar foto'}</Text>
        </Pressable>

        <SectionTitle>2. Foto de referência (opcional)</SectionTitle>
        <Pressable style={[styles.photo, styles.photoSmall, referencia && styles.photoFilled]} onPress={() => setReferencia(!referencia)}>
          <Ionicons name={referencia ? 'checkmark-circle-outline' : 'camera-outline'} size={23} color={referencia ? Colors.white : Colors.muted} />
          <Text style={[styles.photoText, referencia && { color: Colors.white }]}>Ponto próximo para localizar o buraco</Text>
        </Pressable>

        <SectionTitle>3. Localização</SectionTitle>
        <MapBox small><Pin top="55%" left="50%" color={Colors.red} /></MapBox>
        <Field icon="location-outline" placeholder="Rua das Palmeiras, 245 — Bairro Jardim" />

        <SectionTitle>Severidade</SectionTitle>
        <View style={styles.pills}>
          {['Leve', 'Moderado', 'Grave'].map((item) => <Pill key={item} text={item} active={severidade === item} onPress={() => setSeveridade(item)} />)}
        </View>

        <SectionTitle>Descrição (opcional)</SectionTitle>
        <Field placeholder="Conte mais detalhes sobre o buraco..." value={descricao} onChangeText={setDescricao} multiline />

        <Button title="Enviar reporte" onPress={enviar} disabled={!foto} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 60, paddingHorizontal: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { color: Colors.text, fontSize: 15, fontWeight: '900' },
  content: { padding: 16, gap: 10, paddingBottom: 28 },
  photo: { minHeight: 118, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, borderRadius: 18, backgroundColor: Colors.panel, alignItems: 'center', justifyContent: 'center', gap: 7, padding: 14 },
  photoSmall: { minHeight: 82 },
  photoFilled: { backgroundColor: '#aebdca', borderStyle: 'solid', borderColor: '#aebdca' },
  photoText: { color: Colors.muted, fontSize: 10.5, textAlign: 'center' },
  pills: { flexDirection: 'row', gap: 7 }
});
