// Variáveis globais para controlar o estado da gravação
let recording = false;

// Listener para monitorar atualizações nas guias
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Verifica se a URL corresponde ao Google Meet e se a página foi completamente carregada
  if (tab.url && tab.url.includes('https://meet.google.com/') && changeInfo.status === 'complete') {
    // Verifica se o e-mail está salvo no armazenamento local
    chrome.storage.local.get("userEmail", (result) => {
      if (result.userEmail) {
        // Injetar o content script na guia atual
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      } else {
        // Abre o popup para solicitar o e-mail
        chrome.action.setPopup({ popup: "popup/popup.html" });
        chrome.action.openPopup();
      }
    });
  }
});

// Listener para mensagens vindas do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    recording = true;
    console.log('Gravação iniciada pelo content script');
  } else if (message.action === 'stopRecording') {
    recording = false;
    console.log('Gravação parada pelo content script');
  } else if (message.action === 'openPopup') {
    chrome.action.setPopup({ popup: "popup/popup.html" });
    chrome.action.openPopup();
  }
});
