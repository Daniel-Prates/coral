let currentSongTitle = null;
let currentSongData = null;

function selectSong(title, tracks) {
  const playerSection = document.getElementById("playerSection");
  const audio = document.getElementById("audioPlayer");

  // Se clicar na MESMA música que já está aberta: recolhe e para o som
  if (currentSongTitle === title) {
    audio.pause();
    audio.src = "";
    playerSection.classList.add("hidden");
    currentSongTitle = null;
    currentSongData = null;
    return;
  }

  // Se clicar em uma música NOVA ou se o player estiver fechado: abre
  currentSongTitle = title;
  currentSongData = tracks;

  document.getElementById("selectedTitle").innerText = title;
  document.getElementById("trackLabel").innerText =
    "Selecione um naipe ou playback";

  // Limpa o áudio anterior ao trocar de música
  audio.pause();
  audio.src = "";

  playerSection.classList.remove("hidden");
}

function playTrack(type) {
  if (!currentSongData) return;
  const audio = document.getElementById("audioPlayer");
  const label = document.getElementById("trackLabel");

  const caminhoAudio = currentSongData[type];

  if (caminhoAudio) {
    label.innerText = `Tocando: ${type.toUpperCase()}`;
    audio.src = caminhoAudio;

    // Tentativa de dar o play garantindo compatibilidade com navegadores de celular
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log(
          "Bloqueio de áudio mobile ou arquivo não encontrado:",
          error,
        );
        label.innerText = `Clique no Play para ouvir (${type.toUpperCase()})`;
      });
    }
  } else {
    label.innerText = `Faixa de ${type} não disponível.`;
  }
}
