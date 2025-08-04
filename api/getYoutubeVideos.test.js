import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './getYoutubeVideos.js';

class MockResponse {
  constructor() {
    this.statusCode = null;
    this.jsonData = null;
  }
  status(code) {
    this.statusCode = code;
    return this;
  }
  json(data) {
    this.jsonData = data;
    return this;
  }
}

test('retorna erro 500 quando YOUTUBE_API_KEY não está configurada', async () => {
  const originalKey = process.env.YOUTUBE_API_KEY;
  delete process.env.YOUTUBE_API_KEY;

  const req = {};
  const res = new MockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.jsonData, { error: 'Chave de API do YouTube não configurada.' });

  if (originalKey === undefined) {
    delete process.env.YOUTUBE_API_KEY;
  } else {
    process.env.YOUTUBE_API_KEY = originalKey;
  }
});

test('retorna dados do YouTube quando YOUTUBE_API_KEY existe', async () => {
  const originalKey = process.env.YOUTUBE_API_KEY;
  process.env.YOUTUBE_API_KEY = 'fake-key';

  const fakeData = { items: [{ id: 'abc123' }] };
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => fakeData,
  });

  const req = {};
  const res = new MockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.jsonData, fakeData);

  global.fetch = originalFetch;
  if (originalKey === undefined) {
    delete process.env.YOUTUBE_API_KEY;
  } else {
    process.env.YOUTUBE_API_KEY = originalKey;
  }
});
