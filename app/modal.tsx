import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, LoginStatus } from '@/components/AppComponents';
import { Colors } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Falaa Buraco!!</Text>
      <LoginStatus />
      <Text style={styles.text}>Tela modal mantida na estrutura original do projeto.</Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 14, backgroundColor: Colors.background },
  title: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  text: { color: Colors.muted, fontSize: 13, lineHeight: 19 }
});
