import { test, expect } from '@playwright/test';

// Estes testes validam o estado SEM credenciais; nenhum login é simulado.
test('visitante navega entre mapa, lista e perfil sem erros de execução', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto('/');
  await expect(page.getByText('Falaa Buraco!!', { exact: true })).toBeVisible();
  await expect(page.getByText('O Firebase ainda precisa ser configurado para ativar o login e os reportes.')).toBeVisible();
  await page.getByText('Ver mapa sem login', { exact: true }).click();
  await expect(page.getByText('Cada reporte faz a diferença')).toBeVisible();
  await page.getByText('Ver reportes', { exact: true }).click();
  await expect(page.getByText('O Firebase ainda não foi configurado. Consulte o guia no repositório.').last()).toBeVisible();
  await page.getByText('Meus reportes', { exact: true }).click();
  await expect(page.getByText('Entre na sua conta para ver seus reportes.')).toBeVisible();
  await page.getByLabel('Voltar', { exact: true }).click();
  await page.getByLabel('Abrir perfil', { exact: true }).click();
  await expect(page.getByText('Entre para criar e acompanhar seus reportes.')).toBeVisible();
  expect(erros).toEqual([]);
});

test('formulário recusa título vazio e envio de visitante', async ({ page }) => {
  const erros: string[] = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  await page.goto('/novo-reporte');
  await page.getByText('Enviar reporte', { exact: true }).click();
  await expect(page.getByText('Título obrigatório. Diga onde está o problema.')).toBeVisible();
  await page.getByLabel('Título do reporte').fill('Buraco na rua');
  await page.getByText('Enviar reporte', { exact: true }).click();
  await expect(page.getByText('Login necessário. Entre na sua conta para reportar.')).toBeVisible();
  await expect(page.getByText('Reporte enviado!', { exact: true })).not.toBeVisible();
  await page.screenshot({ path: 'test-results/formulario-visitante.png', fullPage: true });
  expect(erros).toEqual([]);
});
