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
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') { setStatus('negado'); return; }
      const posicao = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const aqui = { latitude: posicao.coords.latitude, longitude: posicao.coords.longitude };
      setCoordenadas(aqui);
      setStatus('pronto');
      // O nome da cidade é opcional; falha no endereço não invalida o GPS.
      try {
        const [local] = await Location.reverseGeocodeAsync(aqui);
        setCidade(local?.city ?? local?.subregion ?? null);
      } catch { setCidade(null); }
    } catch { setStatus('erro'); }
  }, []);
  useEffect(() => { void atualizar(); }, [atualizar]);
  return <CidadeContext.Provider value={{ coordenadas, cidade, status, atualizar }}>{children}</CidadeContext.Provider>;
}
