const { spawnSync } = require('node:child_process');

const env = { ...process.env,
  EXPO_NO_DOTENV: '1',
  EXPO_PUBLIC_FIREBASE_API_KEY: 'demo-api-key',
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'demo-falaa-buraco.firebaseapp.com',
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'demo-falaa-buraco',
  EXPO_PUBLIC_FIREBASE_APP_ID: '1:123456789:web:demo',
  EXPO_PUBLIC_FIREBASE_EMULATOR_HOST: '127.0.0.1',
};
// Usa o código real do app com Auth/Firestore locais, sem mocks dos serviços.
for (const args of [
  ['node_modules/expo/bin/cli', 'export', '--platform', 'web', '--output-dir', 'dist-emulator', '--clear'],
  ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.emulator.config.ts'],
]) {
  const resultado = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (resultado.status !== 0) process.exit(resultado.status || 1);
}
