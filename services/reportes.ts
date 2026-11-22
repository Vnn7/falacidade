import { auth, exigirBanco } from '@/firebase-config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { DadosDoReporte } from '@/types/ocorrencia';
import { prepararReporte } from './dados-reporte';

export type { DadosDoReporte } from '@/types/ocorrencia';

/** Aqui eu salvo um reporte no Firestore e devolvo o código que o banco criou para ele. */
export async function criarReporte(dados: DadosDoReporte): Promise<string> {
  // Antes de salvar, eu confiro os dados e se o autor é a pessoa que está logada.
  const campos = prepararReporte(dados, auth?.currentUser?.uid);
  // Eu uso a coleção "ocorrencias". O addDoc cria o documento com um código automático.
  // O serverTimestamp guarda a hora do Firebase, sem depender do relógio do celular.
  const documento = await addDoc(collection(exigirBanco(), 'ocorrencias'), {
    ...campos, criadoEm: serverTimestamp(),
  });
  return documento.id;
}
