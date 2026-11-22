import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { firebaseConfigurado } from '@/firebase-config';
import { buscarOcorrencias } from '@/services/ocorrencias';
import { mensagemDoErro } from '@/services/erros';
import type { Ocorrencia } from '@/types/ocorrencia';
import type { Coordenadas } from '@/context/cidade-context';

/** Busca ao voltar à tela e descarta respostas antigas após sair ou trocar de filtro. */
export function useOcorrencias(_coordenadas?: Coordenadas | null, idNotificante?: string) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const geracao = useRef(0);
  const focada = useRef(false);

  const recarregar = useCallback(async () => {
    if (!focada.current) return;
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
      // A lista pode ser consultada sem GPS: localização é obrigatória só ao criar.
      const lista = await buscarOcorrencias(null, idNotificante);
      if (atual === geracao.current) setOcorrencias(lista);
    } catch (falha) {
      if (atual === geracao.current) setErro(mensagemDoErro(falha));
    } finally {
      if (atual === geracao.current) setCarregando(false);
    }
  }, [idNotificante]);

  useFocusEffect(useCallback(() => {
    focada.current = true;
    setOcorrencias([]);
    void recarregar();
    return () => { focada.current = false; geracao.current += 1; };
  }, [recarregar]));
  return { ocorrencias, carregando, erro, recarregar };
}
