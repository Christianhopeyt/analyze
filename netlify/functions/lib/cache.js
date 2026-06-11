'use strict';

const memory = new Map();
let blobStorePromise;

async function getBlobStore() {
  if (!blobStorePromise) {
    blobStorePromise = import('@netlify/blobs')
      .then(({ getStore }) => getStore('niche-insights-cache'))
      .catch(() => null);
  }
  return blobStorePromise;
}

async function getCached(key, allowStale = false) {
  let entry = memory.get(key);
  const store = await getBlobStore();
  if (store) {
    try {
      entry = await store.get(key, { type: 'json' }) || entry;
    } catch (_) {}
  }
  if (!entry) return null;
  const stale = Date.now() > entry.expiresAt;
  if (stale && !allowStale) return null;
  return { value: entry.value, stale };
}

async function setCached(key, value, ttlMs) {
  const entry = { value, expiresAt: Date.now() + ttlMs };
  memory.set(key, entry);
  const store = await getBlobStore();
  if (store) {
    try { await store.setJSON(key, entry); } catch (_) {}
  }
}

module.exports = { getCached, setCached };
