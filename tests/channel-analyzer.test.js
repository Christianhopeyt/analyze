'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/channel-analyzer');

test('channel endpoint rejects invalid identifiers before API access', async () => {
  const response = await handler({
    httpMethod: 'GET',
    headers: { 'x-forwarded-for': 'test-invalid' },
    queryStringParameters: { type: 'handle', value: '!' }
  });

  assert.equal(response.statusCode, 400);
  assert.equal(JSON.parse(response.body).code, 'INVALID_CHANNEL');
});

test('channel endpoint never exposes or requires a browser API key', async () => {
  const originalKey = process.env.YT_API_KEY;
  delete process.env.YT_API_KEY;

  try {
    const response = await handler({
      httpMethod: 'GET',
      headers: { 'x-forwarded-for': 'test-no-key' },
      queryStringParameters: { type: 'handle', value: 'norcanto' }
    });

    assert.equal(response.statusCode, 503);
    assert.equal(JSON.parse(response.body).code, 'API_NOT_CONFIGURED');
  } finally {
    if (originalKey === undefined) delete process.env.YT_API_KEY;
    else process.env.YT_API_KEY = originalKey;
  }
});
