const { test } = require('node:test');
const assert = require('node:assert/strict');
const { testApiOrigin } = require('./test-api-origin.cjs');

test('normalizes the temporary HTTPS origin', () => {
  assert.equal(testApiOrigin('https://suhat-test.example/'), 'https://suhat-test.example');
  assert.equal(testApiOrigin(undefined), undefined);
});

test('rejects URLs that cannot match the Android HTTPS origin', () => {
  for (const url of ['http://test.example', 'https://test.example:8443',
    'https://test.example/api', 'https://user:secret@test.example',
    'https://test.example?mode=test', 'https://test.example#test']) {
    assert.throws(() => testApiOrigin(url));
  }
});
