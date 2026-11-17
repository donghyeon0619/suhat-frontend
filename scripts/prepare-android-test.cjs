const { spawnSync } = require('node:child_process');
const { resolve } = require('node:path');
const { testApiOrigin } = require('./test-api-origin.cjs');

const origin = testApiOrigin(process.env.SUHAT_TEST_API_URL);
if (!origin) throw new Error('SUHAT_TEST_API_URL에 테스트 서버의 HTTPS 주소를 설정하세요.');

const env = { ...process.env, VITE_API_URL: origin, SUHAT_TEST_API_URL: origin };
const commands = [
  ['vue-tsc/bin/vue-tsc.js'],
  ['vite/bin/vite.js', 'build'],
  ['@capacitor/cli/bin/capacitor', 'sync', 'android'],
];

for (const [script, ...args] of commands) {
  const result = spawnSync(process.execPath, [resolve('node_modules', script), ...args], {
    env, stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
