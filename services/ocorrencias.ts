import { exigirBanco } from '@/firebase-config';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { converterOcorrencia } from './dados-reporte';
import type { Coordenadas } from '@/context/cidade-context';

/** Aqui eu busco os reportes que foram salvos no Firebase, no lugar dos dados de exemplo. */
export async function buscarOcorrencias(_centro?: Coordenadas | null, idNotificante?: string) {
  // Quando recebo o código de um usuário, eu busco só os reportes feitos por ele.
  // Eu filtro antes de limitar a busca para não deixar os reportes antigos dele de fora.
  const filtros = idNotificante ? [where('idNotificante', '==', idNotificante)] : [];
  // Eu peço os 50 reportes mais recentes: "desc" coloca o mais novo primeiro.
  const consulta = query(collection(exigirBanco(), 'ocorrencias'), ...filtros,
    orderBy('criadoEm', 'desc'), limit(50));
  // O getDocs faz a consulta. Depois eu preparo os dados para o mapa e a lista usarem.
  const resultado = await getDocs(consulta);
  return resultado.docs.flatMap((documento) => {
    const ocorrencia = converterOcorrencia(documento.id, documento.data());
    return ocorrencia ? [ocorrencia] : [];
  });
}

export async function buscarOcorrencia(id: string) {
  // Na tela de detalhes, eu uso o código do reporte para buscar apenas aquele documento.
  const documento = await getDoc(doc(exigirBanco(), 'ocorrencias', id));
  return documento.exists() ? converterOcorrencia(documento.id, documento.data()) : null;
}
