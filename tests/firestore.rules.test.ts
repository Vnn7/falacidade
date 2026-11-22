import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';

let ambiente: RulesTestEnvironment;
const dados = { idNotificante: 'ana', titulo: 'Buraco na avenida', descricao: null, status: 'aberto', tipo: 'buraco',
  latitude: -15.6, longitude: -56.1, endereco: null };
before(async () => {
  ambiente = await initializeTestEnvironment({ projectId: 'demo-falaa-buraco',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') } });
});
after(async () => { await ambiente?.cleanup(); });

test('visitante pode consultar, mas não pode criar', async () => {
  const banco = ambiente.unauthenticatedContext().firestore();
  await assertSucceeds(getDocs(collection(banco, 'ocorrencias')));
  await assertFails(setDoc(doc(banco, 'ocorrencias', 'sem-login'), { ...dados, criadoEm: serverTimestamp() }));
});
test('usuário autenticado grava e visitante lê o documento persistido', async () => {
  const banco = ambiente.authenticatedContext('ana').firestore();
  await assertSucceeds(setDoc(doc(banco, 'ocorrencias', 'valido'), { ...dados, criadoEm: serverTimestamp() }));
  const salvo = await assertSucceeds(getDoc(doc(ambiente.unauthenticatedContext().firestore(), 'ocorrencias', 'valido')));
  assert.equal(salvo.data()?.titulo, dados.titulo);
  assert.ok(salvo.data()?.criadoEm instanceof Timestamp);
});
test('usuário não pode se passar por outro notificante', async () => {
  const banco = ambiente.authenticatedContext('bruno').firestore();
  await assertFails(setDoc(doc(banco, 'ocorrencias', 'falso-uid'), { ...dados, criadoEm: serverTimestamp() }));
});
test('regras recusam título vazio, GPS inválido, categoria e status forjados', async () => {
  const banco = ambiente.authenticatedContext('ana').firestore();
  for (const [indice, alteracao] of [{ titulo: '' }, { titulo: '   ' }, { latitude: 91 }, { longitude: -181 },
    { tipo: 'invalido' }, { status: 'resolvido' }, { titulo: 'a'.repeat(121) }, { descricao: 15 }, { endereco: 5 }].entries()) {
    await assertFails(setDoc(doc(banco, 'ocorrencias', 'invalido-' + indice), { ...dados, ...alteracao, criadoEm: serverTimestamp() }));
  }
});
test('regras recusam data inventada e campos inesperados', async () => {
  const banco = ambiente.authenticatedContext('ana').firestore();
  await assertFails(setDoc(doc(banco, 'ocorrencias', 'data-falsa'), { ...dados, criadoEm: Timestamp.fromMillis(0) }));
  await assertFails(setDoc(doc(banco, 'ocorrencias', 'campo-extra'), { ...dados, admin: true, criadoEm: serverTimestamp() }));
});
test('edição e exclusão continuam bloqueadas para o cidadão', async () => {
  const referencia = doc(ambiente.authenticatedContext('ana').firestore(), 'ocorrencias', 'valido');
  await assertFails(updateDoc(referencia, { status: 'resolvido' }));
  await assertFails(deleteDoc(referencia));
});
test('consulta retorna os 50 mais novos; filtro meus inclui reportes antigos fora dos 50 públicos', async () => {
  await ambiente.withSecurityRulesDisabled(async (contexto) => {
    await Promise.all(Array.from({ length: 55 }, (_, indice) => setDoc(doc(contexto.firestore(), 'ocorrencias', 'ordem-' + indice), {
      ...dados, idNotificante: indice === 0 ? 'carla' : 'bruno', criadoEm: Timestamp.fromMillis((indice + 1) * 1000),
    })));
  });
  const colecao = collection(ambiente.unauthenticatedContext().firestore(), 'ocorrencias');
  const lista = await getDocs(query(colecao, orderBy('criadoEm', 'desc'), limit(50)));
  assert.equal(lista.size, 50);
  const tempos = lista.docs.map((documento) => documento.data().criadoEm.toMillis());
  assert.deepEqual(tempos, [...tempos].sort((a, b) => b - a));
  assert.equal(lista.docs.some((documento) => documento.id === 'ordem-0'), false);
  const meus = await getDocs(query(colecao, where('idNotificante', '==', 'carla'), orderBy('criadoEm', 'desc'), limit(50)));
  assert.equal(meus.size, 1); assert.equal(meus.docs[0].id, 'ordem-0');
});
