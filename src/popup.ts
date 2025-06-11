let originalText = '';

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (tabs[0].id !== undefined) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_SELECTION' }, async response => {
      if (response?.text) {
        originalText = response.text;
        const result = await translate(response.text);
        (document.getElementById('result') as HTMLTextAreaElement).value = result;
      }
    });
  }
});

async function translate(text: string): Promise<string> {
  const res = await chrome.runtime.sendMessage({ type: 'TRANSLATE_TEXT', text });
  return res.result;
}

document.getElementById('reload')?.addEventListener('click', async () => {
  if (originalText) {
    const result = await translate(originalText);
    (document.getElementById('result') as HTMLTextAreaElement).value = result;
  }
});

document.getElementById('show-original')?.addEventListener('click', () => {
  (document.getElementById('result') as HTMLTextAreaElement).value = originalText;
});
