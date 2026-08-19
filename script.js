// 1. BANCO DE DADOS DAS MÚSICAS
// Para adicionar novas músicas, basta adicionar um novo bloco aqui!
const repertorio = [
  {
    id: 1,
    titulo: "1. Graça Excelsa",
    audios: {
      soprano: "audios/graca_soprano.mp3",
      contralto: "audios/graca_contralto.mp3",
      tenor: "audios/graca_tenor.mp3",
      baixo: "audios/graca_baixo.mp3",
      playback: "audios/graca_playback.mp3",
    },
  },
  {
    id: 2,
    titulo: "2. Castelo Forte",
    audios: {
      soprano: "audios/castelo_soprano.mp3",
      contralto: "audios/castelo_contralto.mp3",
      tenor: "audios/castelo_tenor.mp3",
      baixo: "audios/castelo_baixo.mp3",
      playback: "audios/castelo_playback.mp3",
    },
  },
  {
    id: 3,
    titulo: "3. Via Dolorosa",
    audios: {
      soprano: "audios/via_soprano.mp3",
      contralto: "audios/via_contralto.mp3",
      tenor: "audios/via_tenor.mp3",
      baixo: "audios/via_baixo.mp3",
      playback: "audios/via_playback.mp3",
    },
  },
];

let currentSongId = null;
let currentSongData = null;

// 2. FUNÇÃO QUE RENDERIZA A LISTA NA TELA AUTOMATICAMENTE
function renderizarMusicas(lista) {
  const songList = document.getElementById("songList");
  songList.innerHTML = "";

  if (lista.length === 0) {
    songList.innerHTML =
      '<p class="text-center text-slate-400 py-4">Nenhuma música encontrada.</p>';
    return;
  }

  lista.forEach((musica) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "song-card w-full text-left p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 active:bg-slate-600 transition-colors";

    // Passa o ID da música ao clicar
    button.onclick = () => togglePlayer(musica);

    button.innerHTML = `<h3 class="font-semibold text-white pointer-events-none">${musica.titulo}</h3>`;
    songList.appendChild(button);
  });
}

// 3. LÓGICA DE ABRIR/RECOLHER (TOGGLE)
function togglePlayer(musica) {
  const playerSection = document.getElementById("playerSection");
  const audio = document.getElementById("audioPlayer");

  // Se clicar na MESMA música: recolhe
  if (currentSongId === musica.id) {
    audio.pause();
    audio.src = "";
    playerSection.classList.add("hidden");
    currentSongId = null;
    currentSongData = null;
    return;
  }

  // Se clicar em uma NOVA música: abre
  currentSongId = musica.id;
  currentSongData = musica.audios;

  document.getElementById("selectedTitle").innerText = musica.titulo;
  document.getElementById("trackLabel").innerText =
    "Selecione um naipe ou playback";

  audio.pause();
  audio.src = "";

  playerSection.classList.remove("hidden");
}

// 4. TOCAR FAIXA SELECIONADA
function playTrack(type) {
  if (!currentSongData) return;
  const audio = document.getElementById("audioPlayer");
  const label = document.getElementById("trackLabel");

  const caminhoAudio = currentSongData[type];

  if (caminhoAudio) {
    label.innerText = `Tocando: ${type.toUpperCase()}`;
    audio.src = caminhoAudio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        label.innerText = `Clique no Play para ouvir (${type.toUpperCase()})`;
      });
    }
  } else {
    label.innerText = `Faixa de ${type} não disponível.`;
  }
}

// 5. SISTEMA DE BUSCA EM TEMPO REAL
document.getElementById("searchInput").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const filtradas = repertorio.filter((musica) =>
    musica.titulo.toLowerCase().includes(termo),
  );
  renderizarMusicas(filtradas);
});

// Inicializa a lista assim que abre o site
renderizarMusicas(repertorio);
