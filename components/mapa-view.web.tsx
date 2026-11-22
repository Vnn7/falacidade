import { Text, View } from 'react-native';
import { Colors } from '@/constants/theme';
import type { PropsMapa } from './mapa-view';

// react-native-maps é nativo. A lista continua consultando o Firestore no navegador.
export function MapaView({ style }: PropsMapa) {
  return <View style={[style, { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }]}>
    <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '700' }}>Mapa no Android e iOS</Text>
    <Text style={{ color: Colors.muted, textAlign: 'center', lineHeight: 20 }}>No navegador, toque em Ver reportes para consultar a lista com os dados do Firebase.</Text>
  </View>;
}
