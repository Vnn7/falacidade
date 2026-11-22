import { exigirBanco } from '@/firebase-config';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { converterOcorrencia } from './dados-reporte';
import type { Coordenadas } from '@/context/cidade-context';

/** Desafio 2: consulta os 50 mais recentes. O centro fica reservado para proximidade. */
export async function buscarOcorrencias(_centro?: Coordenadas | null, idNotificante?: string) {
  // O filtro é feito no banco ANTES do limit: meus reportes não dependem dos 50 públicos.
  const filtros = idNotificante ? [where('idNotificante', '==', idNotificante)] : [];
  const consulta = query(collection(exigirBanco(), 'ocorrencias'), ...filtros,
    orderBy('criadoEm', 'desc'), limit(50));
  const resultado = await getDocs(consulta);
  return resultado.docs.flatMap((documento) => {
    const ocorrencia = converterOcorrencia(documento.id, documento.data());
    return ocorrencia ? [ocorrencia] : [];
  });
}

export async function buscarOcorrencia(id: string) {
  const documento = await getDoc(doc(exigirBanco(), 'ocorrencias', id));
  return documento.exists() ? converterOcorrencia(documento.id, documento.data()) : null;
}
