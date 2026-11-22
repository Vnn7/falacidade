import { auth, exigirBanco } from '@/firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { DadosDoReporte } from '@/types/ocorrencia';
import { prepararReporte } from './dados-reporte';

export type { DadosDoReporte } from '@/types/ocorrencia';

/** addDoc gera o id. O horário vem do servidor, não do relógio do aparelho. */
export async function criarReporte(dados: DadosDoReporte): Promise<string> {
  const campos = prepararReporte(dados, auth?.currentUser?.uid);
  const documento = await addDoc(collection(exigirBanco(), 'ocorrencias'), {
    ...campos, criadoEm: serverTimestamp(),
  });
  return documento.id;
}
