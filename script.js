// 1. BANCO DE DADOS DAS MÚSICAS
const repertorio = [
  {
    id: 1,
    titulo: "17. Levem a luz",
    audios: {
      soprano: "audios/graca_soprano.mp3",
      contralto: "audios/graca_contralto.mp3",
      tenor: "audios/graca_tenor.mp3",
      baixo: "audios/17_baixo.ogg",
      playback: "audios/graca_playback.mp3",
    },
  },
  {
    id: 2,
    titulo: "43. Vem reinar",
    audios: {
      soprano: "audios/castelo_soprano.mp3",
      contralto: "audios/castelo_contralto.mp3",
      tenor: "audios/castelo_tenor.mp3",
      baixo: "audios/43_baixo.ogg",
      playback: "audios/castelo_playback.mp3",
    },
  },
];

let currentSongId = null;
let currentSongData = null;

// 2. FUNÇÃO PARA RENDERIZAR A LISTA (Otimizada para Mobile)
function renderizarMusicas(lista) {
  const songList = document.getElementById("songList");
  if (!songList) return;

  songList.innerHTML = "";

  if (lista.length === 0) {
    songList.innerHTML =
      '<p class="text-center text-slate-400 py-4">Nenhuma música encontrada.</p>';
    return;
  }

  lista.forEach((musica) => {
    const button = document.createElement("button");
    button.type = "button";
    // Estilos com suporte ativo a toque no celular
    button.className =
      "song-card w-full text-left p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 active:bg-slate-600 transition-colors mb-2";

    // Armazena os dados no elemento
    button.setAttribute("data-id", musica.id);

    button.innerHTML = `<h3 class="font-semibold text-white pointer-events-none">${musica.titulo}</h3>`;
    songList.appendChild(button);
  });
}

// 3. DELEGAÇÃO DE EVENTO GLOBAL (Atende toque e clique)
document.addEventListener("click", function (event) {
  const songCard = event.target.closest(".song-card");
  if (!songCard) return;

  const id = Number(songCard.getAttribute("data-id"));
  const musica = repertorio.find((m) => m.id === id);

  if (musica) {
    togglePlayer(musica);
  }
});

// 4. LÓGICA DE ABRIR/RECOLHER (TOGGLE)
function togglePlayer(musica) {
  const playerSection = document.getElementById("playerSection");
  const audio = document.getElementById("audioPlayer");

  // Se clicar na MESMA música: recolhe e limpa
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

// 5. TOCAR FAIXA SELECIONADA
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

// 6. INICIALIZAÇÃO SEGURA AO CARREGAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  renderizarMusicas(repertorio);

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const termo = e.target.value.toLowerCase();
      const filtradas = repertorio.filter((musica) =>
        musica.titulo.toLowerCase().includes(termo),
      );
      renderizarMusicas(filtradas);
    });
  }
});
