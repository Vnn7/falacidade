import type { DadosDoReporte, Ocorrencia, StatusOcorrencia, TipoReporte } from '../types/ocorrencia';

const tipos: TipoReporte[] = ['buraco', 'calcada', 'iluminacao', 'outro'];
const estados: StatusOcorrencia[] = ['aberto', 'em_execucao', 'resolvido'];

export function coordenadasValidas(latitude: unknown, longitude: unknown): boolean {
  return typeof latitude === 'number' && Number.isFinite(latitude) && Math.abs(latitude) <= 90
    && typeof longitude === 'number' && Number.isFinite(longitude) && Math.abs(longitude) <= 180;
}

/** Também valido no serviço: outra tela não pode enviar dados inválidos por engano. */
export function prepararReporte(dados: DadosDoReporte, uid: string | undefined) {
  if (!uid || dados.idNotificante !== uid) throw new Error('Entre na sua conta para reportar.');
  const titulo = dados.titulo.trim();
  if (!titulo) throw new Error('Informe o título do problema.');
  if (titulo.length > 120) throw new Error('O título deve ter até 120 caracteres.');
  if (dados.descricao.trim().length > 2000) throw new Error('A descrição deve ter até 2000 caracteres.');
  if (!coordenadasValidas(dados.latitude, dados.longitude)) throw new Error('Localização inválida.');
  if (!tipos.includes(dados.tipo)) throw new Error('Escolha um tipo de problema.');
  const endereco = dados.endereco?.trim() || null;
  if (endereco && endereco.length > 500) throw new Error('O endereço deve ter até 500 caracteres.');
  return {
    idNotificante: uid, titulo, descricao: dados.descricao.trim() || null,
    status: 'aberto' as const, tipo: dados.tipo,
    latitude: dados.latitude, longitude: dados.longitude, endereco,
  };
}

/** Um documento antigo ou inválido não deve derrubar os pinos e a lista inteira. */
export function converterOcorrencia(id: string, dados: Record<string, unknown>): Ocorrencia | null {
  if (typeof dados.titulo !== 'string' || !dados.titulo.trim()
    || !coordenadasValidas(dados.latitude, dados.longitude)
    || !estados.includes(dados.status as StatusOcorrencia)) return null;
  let criadoEm: Date | null = null;
  if (dados.criadoEm && typeof (dados.criadoEm as { toDate?: unknown }).toDate === 'function') {
    const data = (dados.criadoEm as { toDate: () => Date }).toDate();
    if (data instanceof Date && Number.isFinite(data.getTime())) criadoEm = data;
  }
  return {
    id, titulo: dados.titulo.trim(),
    idNotificante: typeof dados.idNotificante === 'string' ? dados.idNotificante : '',
    descricao: typeof dados.descricao === 'string' ? dados.descricao : undefined,
    status: dados.status as StatusOcorrencia,
    tipo: tipos.includes(dados.tipo as TipoReporte) ? dados.tipo as TipoReporte : 'outro',
    latitude: dados.latitude as number, longitude: dados.longitude as number,
    endereco: typeof dados.endereco === 'string' ? dados.endereco : undefined, criadoEm,
  };
}
