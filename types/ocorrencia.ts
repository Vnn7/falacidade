export type StatusOcorrencia = 'aberto' | 'em_execucao' | 'resolvido';
export type TipoReporte = 'buraco' | 'calcada' | 'iluminacao' | 'outro';

export type Ocorrencia = {
  id: string;
  idNotificante: string;
  titulo: string;
  descricao?: string;
  status: StatusOcorrencia;
  tipo: TipoReporte;
  latitude: number;
  longitude: number;
  endereco?: string;
  criadoEm: Date | null;
};

export type DadosDoReporte = Pick<Ocorrencia,
  'idNotificante' | 'titulo' | 'latitude' | 'longitude' | 'tipo'> & {
  descricao: string;
  endereco?: string | null;
};
