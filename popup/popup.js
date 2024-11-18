document.addEventListener('DOMContentLoaded', () => {
    const saveEmailBtn = document.getElementById('saveEmailBtn');
  
    if (saveEmailBtn) {
      saveEmailBtn.addEventListener('click', () => {
        const email = document.getElementById('emailInput').value;
        
        if (email) {
          chrome.storage.local.set({ userEmail: email }, () => {
            alert("E-mail salvo com sucesso!");
  
            // Fecha o popup e reinicia o fluxo da extensão
            chrome.storage.local.get("activeTabId", (result) => {
              if (result.activeTabId) {
                chrome.runtime.sendMessage({ action: "startExtensionFlow", tabId: result.activeTabId });
              }
            });
            window.close();
          });
        } else {
          alert("Por favor, insira um e-mail válido.");
        }
      });
    } else {
      console.error("Elemento saveEmailBtn não encontrado.");
    }
  });
  