import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { firebaseConfigurado } from '@/firebase-config';
import { buscarOcorrencias } from '@/services/ocorrencias';
import { mensagemDoErro } from '@/services/erros';
import type { Ocorrencia } from '@/types/ocorrencia';
import type { Coordenadas } from '@/context/cidade-context';

/** Aqui eu junto a busca dos reportes com os avisos de carregamento e de erro da tela. */
export function useOcorrencias(_coordenadas?: Coordenadas | null, idNotificante?: string) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const geracao = useRef(0);
  const focada = useRef(false);

  const recarregar = useCallback(async () => {
    if (!focada.current) return;
    // Eu marco cada busca para não mostrar uma resposta antiga depois de uma busca mais nova.
    const atual = ++geracao.current;
    if (!firebaseConfigurado) {
      setOcorrencias([]);
      setErro('O Firebase ainda não foi configurado. Consulte o guia no repositório.');
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      // Eu deixo consultar a lista sem GPS. A posição é necessária quando vou criar um reporte.
      const lista = await buscarOcorrencias(null, idNotificante);
      if (atual === geracao.current) setOcorrencias(lista);
    } catch (falha) {
      if (atual === geracao.current) setErro(mensagemDoErro(falha));
    } finally {
      if (atual === geracao.current) setCarregando(false);
    }
  }, [idNotificante]);

  // Eu uso useFocusEffect para buscar de novo sempre que volto para esta tela.
  // Assim, o reporte que acabei de criar aparece sem precisar fechar o aplicativo.
  useFocusEffect(useCallback(() => {
    focada.current = true;
    setOcorrencias([]);
    void recarregar();
    // Ao sair da tela, eu paro de aproveitar as respostas das buscas anteriores.
    return () => { focada.current = false; geracao.current += 1; };
  }, [recarregar]));
  return { ocorrencias, carregando, erro, recarregar };
}
