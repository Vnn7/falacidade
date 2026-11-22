import MapView, { Marker } from 'react-native-maps';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { Coordenadas } from '@/context/cidade-context';
import type { Ocorrencia } from '@/types/ocorrencia';
import { STATUS } from '@/constants/status';

export type PropsMapa = { coordenadas: Coordenadas | null; ocorrencias: Ocorrencia[];
  onSelecionar?: (id: string) => void; style?: StyleProp<ViewStyle> };
export function MapaView({ coordenadas, ocorrencias, onSelecionar, style }: PropsMapa) {
  return <MapView style={style} showsUserLocation={Boolean(coordenadas)} showsMyLocationButton
    initialRegion={coordenadas ? { ...coordenadas, latitudeDelta: 0.02, longitudeDelta: 0.02 }
      : { latitude: -14.235, longitude: -51.925, latitudeDelta: 35, longitudeDelta: 35 }}>
    {ocorrencias.map((item) => <Marker key={item.id} coordinate={{ latitude: item.latitude, longitude: item.longitude }}
      title={item.titulo} description={STATUS[item.status].rotulo} pinColor={STATUS[item.status].cor}
      onCalloutPress={() => onSelecionar?.(item.id)} />)}
  </MapView>;
}
