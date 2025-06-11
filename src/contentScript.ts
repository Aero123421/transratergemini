function createOverlay(text: string) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '10px';
  overlay.style.right = '10px';
  overlay.style.backgroundColor = 'white';
  overlay.style.border = '1px solid #ccc';
  overlay.style.padding = '10px';
  overlay.style.zIndex = '10000';
  overlay.innerText = text;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 5000);
}

async function translatePage() {
  const text = document.body.innerText;
  const response = await chrome.runtime.sendMessage({ type: 'TRANSLATE_TEXT', text });
  createOverlay(response.result);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_TRANSLATE') {
    translatePage();
  } else if (message.type === 'SHOW_TRANSLATION') {
    createOverlay(message.text);
  } else if (message.type === 'GET_SELECTION') {
    const selection = window.getSelection()?.toString() || '';
    sendResponse({ text: selection });
  }
});
