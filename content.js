let mediaRecorder;
let audioChunks = [];

const API_URL = 'https://api.fireflies.ai/graphql';
const API_KEY = '4529bfc9-2fad-4290-b139-7c04f96cad70'; // Insira aqui sua chave de API

// Função para iniciar a gravação de áudio do usuário
async function startRecording() {
  try {
    const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(userStream);
    audioChunks = []; // Reinicia os chunks de áudio

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      console.log('Gravação do usuário parada');
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });

      // Obtem o email e o ID do Meet para o título
      chrome.storage.local.get(['userEmail', 'meetId'], async (result) => {
        const email = result.userEmail;
        const meetId = result.meetId || 'UnknownID';
        const title = `${meetId} ${email}`;

        // Faz o upload do arquivo de áudio para o servidor

        // ATENÇÃO!!!
        // Falta Converter audioBlob em audioURl
        console.log('ATENÇÂO!!!')
        console.log('Falta converter audioBlob em audioURL')
        if (audioUrl) {
          await uploadAudioToAPI(audioBlob, title, email);
        }
      });
    };

    mediaRecorder.start();
    console.log("Gravação do usuário iniciada");
  } catch (err) {
    console.error("Erro ao capturar áudio:", err);
  }
}

// Função para parar a gravação
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    console.log("Parando gravação do usuário");
    mediaRecorder.stop();
  }
}

// Função para fazer o upload do áudio para o Fireflies usando a URL do áudio
async function uploadAudioToAPI(audioUrl, title, email) {
  try {
    const input = {
      url: audioUrl,
      title: title,
      attendees: [
        {
          displayName: 'Attendee',
          email: email
        }
      ]
    };
    const data = {
      query: `
        mutation($input: AudioUploadInput) {
          uploadAudio(input: $input) {
            success
            title
            message
          }
        }
      `,
      variables: { input }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Resultado do upload:", result);

  } catch (error) {
    console.error("Erro ao fazer upload do áudio:", error);
  }
}

// Função para obter o ID do Meet a partir da URL
function getMeetIdFromUrl(url) {
  const match = url.match(/meet.google.com\/([a-z\-]+)/);
  return match ? match[1] : null;
}

// Observa mudanças no DOM para detectar início e fim da reunião
function observeMeeting() {
  let isRecording = false;

  const observer = new MutationObserver(() => {
    const isInMeeting = document.querySelector('button[jsname="A5il2e"]') !== null;

    if (isInMeeting && !isRecording) {
      // Reunião iniciada
      console.log('Reunião iniciada');
      const meetId = getMeetIdFromUrl(window.location.href);
      if (meetId) {
        chrome.storage.local.set({ meetId }, () => {
          console.log("Meet ID salvo:", meetId);
        });
      }
      startRecording();
      isRecording = true;
    } else if (!isInMeeting && isRecording) {
      // Reunião encerrada
      console.log('Reunião encerrada');
      stopRecording();
      isRecording = false;
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Inicia a observação quando o content script é executado
observeMeeting();

// Verifica se o e-mail do usuário está armazenado; se não, abre o popup para solicitá-lo
chrome.storage.local.get("userEmail", (result) => {
  if (!result.userEmail) {
    chrome.runtime.sendMessage({ action: 'openPopup' });
  }
});

// Detecta quando o usuário sai da página e para a gravação
window.addEventListener("unload", () => {
  stopRecording();
});
