import assert from 'node:assert/strict';
import { test } from 'node:test';
import { converterOcorrencia, coordenadasValidas, prepararReporte } from '../services/dados-reporte';
import type { DadosDoReporte } from '../types/ocorrencia';

const dados: DadosDoReporte = { idNotificante: 'ana', titulo: '  Buraco na avenida  ', descricao: '  ',
  latitude: -15.6, longitude: -56.1, tipo: 'buraco' };

test('remove espaços, mantém coordenadas e normaliza campos opcionais', () => {
  assert.deepEqual(prepararReporte(dados, 'ana'), { idNotificante: 'ana', titulo: 'Buraco na avenida',
    descricao: null, status: 'aberto', tipo: 'buraco', latitude: -15.6, longitude: -56.1, endereco: null });
});
test('recusa criação sem login ou usando uid de outra pessoa', () => {
  assert.throws(() => prepararReporte(dados, undefined), /conta/);
  assert.throws(() => prepararReporte(dados, 'bruno'), /conta/);
});
test('recusa título vazio e textos acima dos limites', () => {
  assert.throws(() => prepararReporte({ ...dados, titulo: '   ' }, 'ana'), /título/);
  assert.throws(() => prepararReporte({ ...dados, titulo: 'a'.repeat(121) }, 'ana'), /120/);
  assert.throws(() => prepararReporte({ ...dados, descricao: 'a'.repeat(2001) }, 'ana'), /2000/);
  assert.throws(() => prepararReporte({ ...dados, endereco: 'a'.repeat(501) }, 'ana'), /500/);
});
test('recusa latitude/longitude ausentes, fora do planeta ou não finitas', () => {
  for (const [lat, lng] of [[NaN, 0], [0, Infinity], [91, 0], [0, -181], ['-15', 0], [null, 0]]) {
    assert.equal(coordenadasValidas(lat, lng), false);
  }
  assert.equal(coordenadasValidas(0, 0), true);
  assert.equal(coordenadasValidas(-90, 180), true);
  assert.throws(() => prepararReporte({ ...dados, latitude: NaN }, 'ana'), /Localização/);
});
test('recusa categoria que não faz parte do formulário', () => {
  assert.throws(() => prepararReporte({ ...dados, tipo: 'invalido' as DadosDoReporte['tipo'] }, 'ana'), /tipo/);
});
test('converte Timestamp do Firestore para data e preserva os extras', () => {
  const data = new Date('2026-11-22T12:00:00Z');
  const item = converterOcorrencia('id-1', { ...dados, status: 'aberto', endereco: 'Rua A',
    criadoEm: { toDate: () => data } });
  assert.equal(item?.id, 'id-1'); assert.equal(item?.criadoEm, data);
  assert.equal(item?.endereco, 'Rua A'); assert.equal(item?.tipo, 'buraco');
});
test('documentos do desafio básico, sem extras, continuam aparecendo', () => {
  const item = converterOcorrencia('antigo', { titulo: 'Poste', status: 'em_execucao', latitude: 0, longitude: 0,
    descricao: null, criadoEm: null });
  assert.equal(item?.tipo, 'outro'); assert.equal(item?.criadoEm, null);
  assert.equal(item?.descricao, undefined);
});
test('ignora documento inválido em vez de quebrar o mapa', () => {
  assert.equal(converterOcorrencia('x', { ...dados, status: 'desconhecido' }), null);
  assert.equal(converterOcorrencia('x', { ...dados, status: 'aberto', latitude: 'texto' }), null);
  assert.equal(converterOcorrencia('x', { ...dados, status: 'aberto', titulo: '' }), null);
});
