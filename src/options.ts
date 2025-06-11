const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const fromLangInput = document.getElementById('fromLang') as HTMLInputElement;
const toLangInput = document.getElementById('toLang') as HTMLInputElement;

chrome.storage.local.get(['apiKey', 'fromLang', 'toLang'], items => {
  apiKeyInput.value = items.apiKey || '';
  fromLangInput.value = items.fromLang || '';
  toLangInput.value = items.toLang || '';
});

document.getElementById('save')?.addEventListener('click', () => {
  chrome.storage.local.set({
    apiKey: apiKeyInput.value,
    fromLang: fromLangInput.value,
    toLang: toLangInput.value,
  });
});
