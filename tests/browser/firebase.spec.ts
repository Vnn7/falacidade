import { test, expect } from '@playwright/test';

test('conta real no emulador cria dois reportes, atualiza ao voltar e lista por data/autor', async ({ page, request }) => {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto('/');
  await page.getByLabel('E-mail', { exact: true }).fill('teste-' + Date.now() + '@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('senha-local-123');
  await page.getByText('Criar conta', { exact: true }).click();
  await expect(page.getByText('Cada reporte faz a diferença')).toBeVisible();
  await expect(page.getByText('Buscando sua localização...')).not.toBeVisible();

  for (const titulo of ['Primeiro reporte do teste', 'Segundo reporte do teste']) {
    await page.getByLabel('Novo reporte', { exact: true }).click();
    await page.getByLabel('Título do reporte').fill(titulo);
    await page.getByLabel('Descrição do reporte').fill('Descrição criada pelo teste automatizado.');
    await page.getByText('Iluminação', { exact: true }).click();
    await page.getByText('Enviar reporte', { exact: true }).click();
    await expect(page.getByText('Reporte enviado!', { exact: true })).toBeVisible({ timeout: 15000 });
    await page.getByText('Voltar ao mapa', { exact: true }).click();
  }
  await expect(page.getByText('2 reporte(s) encontrado(s).')).toBeVisible();
  await page.getByText('Ver reportes', { exact: true }).click();
  const cartoes = page.getByRole('button', { name: /^Ver reporte:/ });
  await expect(cartoes).toHaveCount(2);
  await expect(cartoes.nth(0)).toContainText('Segundo reporte do teste');
  await expect(cartoes.nth(1)).toContainText('Primeiro reporte do teste');
  await page.getByText('Meus reportes', { exact: true }).click();
  await expect(cartoes).toHaveCount(2);
  await page.getByLabel('Atualizar reportes').click();
  await expect(cartoes).toHaveCount(2);

  // Confere persistência, GPS, categoria e timestamp diretamente na API local.
  const resposta = await request.get('http://127.0.0.1:8080/v1/projects/demo-falaa-buraco/databases/(default)/documents/ocorrencias');
  expect(resposta.ok()).toBeTruthy();
  const { documents } = await resposta.json();
  expect(documents).toHaveLength(2);
  for (const documento of documents) {
    expect(documento.fields.status.stringValue).toBe('aberto');
    expect(documento.fields.tipo.stringValue).toBe('iluminacao');
    expect(Number(documento.fields.latitude.doubleValue)).toBe(-15.6);
    expect(Number(documento.fields.longitude.doubleValue)).toBe(-56.1);
    expect(documento.fields.idNotificante.stringValue).toBeTruthy();
    expect(documento.fields.criadoEm.timestampValue).toBeTruthy();
  }
  await page.screenshot({ path: 'test-results/lista-emulador.png', fullPage: true });
  await cartoes.nth(0).click();
  await expect(page.getByText('Identificador:', { exact: false })).toBeVisible();
  expect(erros).toEqual([]);
});
