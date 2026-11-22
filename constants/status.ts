import { Colors } from './theme';
import type { StatusOcorrencia, TipoReporte } from '@/types/ocorrencia';

// Mapa e lista usam os mesmos rótulos e cores para a situação do reporte.
export const STATUS: Record<StatusOcorrencia, { rotulo: string; cor: string }> = {
  aberto: { rotulo: 'Aberto', cor: Colors.red },
  em_execucao: { rotulo: 'Em execução', cor: Colors.amber },
  resolvido: { rotulo: 'Resolvido', cor: Colors.green },
};

export const TIPOS: Record<TipoReporte, string> = {
  buraco: 'Buraco', calcada: 'Calçada', iluminacao: 'Iluminação', outro: 'Outro',
};
