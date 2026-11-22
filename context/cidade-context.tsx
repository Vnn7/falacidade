import * as Location from 'expo-location';
import { createContext, type ReactNode, useCallback, useEffect, useState } from 'react';

export type Coordenadas = { latitude: number; longitude: number };
type StatusCidade = 'carregando' | 'pronto' | 'negado' | 'erro';
type Cidade = { coordenadas: Coordenadas | null; cidade: string | null; status: StatusCidade; atualizar: () => Promise<void> };
export const CidadeContext = createContext<Cidade | null>(null);

export function CidadeProvider({ children }: { children: ReactNode }) {
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusCidade>('carregando');
  const atualizar = useCallback(async () => {
    setStatus('carregando');
    setCoordenadas(null);
    try {
      // Primeiro eu peço autorização para usar a localização do aparelho.
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') { setStatus('negado'); return; }
      // Depois eu pego a posição atual e guardo a latitude e a longitude.
      const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const aqui = { latitude: posicao.coords.latitude, longitude: posicao.coords.longitude };
      setCoordenadas(aqui);
      setStatus('pronto');
      // Eu também tento pegar o nome da cidade, mas o GPS funciona mesmo sem esse nome.
      try {
        const [local] = await Location.reverseGeocodeAsync(aqui);
        setCidade(local?.city ?? local?.subregion ?? null);
      } catch { setCidade(null); }
    } catch { setStatus('erro'); }
  }, []);
  useEffect(() => { void atualizar(); }, [atualizar]);
  return <CidadeContext.Provider value={{ coordenadas, cidade, status, atualizar }}>{children}</CidadeContext.Provider>;
}
