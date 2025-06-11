const CACHE_TTL = 60 * 1000; // 1 minute
interface CacheEntry { result: string; timestamp: number; }
const cache = new Map<string, CacheEntry>();

function getFromCache(text: string): string | undefined {
  const entry = cache.get(text);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.result;
  }
  return undefined;
}

function setCache(text: string, result: string) {
  cache.set(text, { result, timestamp: Date.now() });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'translate-page', title: 'ページ翻訳', contexts: ['action'] });
  chrome.contextMenus.create({ id: 'translate-selection', title: '選択範囲翻訳', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'translate-x', title: 'X投稿翻訳', contexts: ['selection'] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !info.menuItemId) return;
  switch (info.menuItemId) {
    case 'translate-page':
      chrome.tabs.sendMessage(tab.id!, { type: 'PAGE_TRANSLATE' });
      break;
    case 'translate-selection':
      if (info.selectionText) {
        const result = await translateText(info.selectionText);
        chrome.tabs.sendMessage(tab.id!, { type: 'SHOW_TRANSLATION', text: result });
      }
      break;
    case 'translate-x':
      if (info.selectionText) {
        const result = await translateText(info.selectionText);
        chrome.tabs.sendMessage(tab.id!, { type: 'SHOW_TRANSLATION', text: result });
      }
      break;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE_TEXT') {
    translateText(message.text).then(result => sendResponse({ result }));
    return true; // async
  }
});

async function translateText(text: string): Promise<string> {
  const cached = getFromCache(text);
  if (cached) return cached;
  const key = await getApiKey();
  if (!key) throw new Error('API key not set');

  const body = JSON.stringify({
    contents: [{ parts: [{ text }] }],
  });

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.json();
  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  setCache(text, result);
  return result;
}

function getApiKey(): Promise<string | undefined> {
  return new Promise(resolve => {
    chrome.storage.local.get(['apiKey'], (items) => {
      resolve(items.apiKey);
    });
  });
}
