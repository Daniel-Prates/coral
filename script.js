let repertorio = [];
let musicaAbertaNumero = null;
let audioAtual = null;

// Dicionário com as cores de cada naipe
const coresNaipes = {
  soprano: "#3d1c2a",
  contralto: "#1c243b",
  tenor: "#593d18",
  baixo: "#142427",
  playback: "#0f172a",
};

// Função para mudar a cor do fundo
function mudarCorFundo(naipe) {
  const cor = coresNaipes[naipe] || "#0f172a";
  document.body.style.backgroundColor = cor;
}

// FUNÇÃO PARA BUSCAR O REPERTÓRIO DO ARQUIVO JSON
async function carregarRepertorio() {
  try {
    const resposta = await fetch("repertorio.json");
    if (!resposta.ok) throw new Error("Erro ao carregar o arquivo JSON");
    repertorio = await resposta.json();
    renderizarMusicas(repertorio);
  } catch (erro) {
    console.error("Erro:", erro);
    const songList = document.getElementById("songList");
    if (songList) {
      songList.innerHTML =
        '<p class="text-center text-red-400 py-4">Erro ao carregar as músicas.</p>';
    }
  }
}

// ORDENAÇÃO AUTOMÁTICA
function ordenarRepertorio(lista) {
  return [...lista].sort((a, b) => {
    return String(a.numero).localeCompare(String(b.numero), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

// RENDERIZAR MÚSICAS
function renderizarMusicas(lista) {
  const songList = document.getElementById("songList");
  if (!songList) return;

  songList.innerHTML = "";

  if (lista.length === 0) {
    songList.innerHTML =
      '<p class="text-center text-slate-400 py-4">Nenhuma música encontrada.</p>';
    return;
  }

  const listaOrdenada = ordenarRepertorio(lista);

  listaOrdenada.forEach((musica) => {
    const itemContainer = document.createElement("div");
    itemContainer.className =
      "bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 shadow-md";

    const isAberta = musicaAbertaNumero === musica.numero;

    itemContainer.innerHTML = `
      <button type="button" 
              class="song-card w-full text-left p-4 flex justify-between items-center cursor-pointer hover:bg-slate-750 active:bg-slate-700 transition-colors ${isAberta ? "bg-slate-700 text-indigo-400" : "text-white"}"
              data-numero="${musica.numero}">
        <h3 class="font-semibold pointer-events-none">${musica.numero}. ${musica.titulo}</h3>
        <span class="text-slate-400 text-xs pointer-events-none">${isAberta ? "▲" : "▼"}</span>
      </button>

      <!-- Player Integrado (Sanfona) -->
      <div class="player-content ${isAberta ? "flex" : "hidden"} flex-col items-center p-4 bg-slate-850 border-t border-slate-700/50">
        
        <!-- Roda Genius -->
        <div class="genius-wheel my-2">
          <button type="button" class="slice soprano" data-naipe="soprano" data-numero="${musica.numero}">Soprano</button>
          <button type="button" class="slice contralto" data-naipe="contralto" data-numero="${musica.numero}">Contralto</button>
          <button type="button" class="slice tenor" data-naipe="tenor" data-numero="${musica.numero}">Tenor</button>
          <button type="button" class="slice baixo" data-naipe="baixo" data-numero="${musica.numero}">Baixo</button>
          <button type="button" class="center-circle" data-naipe="playback" data-numero="${musica.numero}">Playback</button>
        </div>

        <!-- Audio Player -->
        <div class="w-full mt-2">
          <p class="track-label text-xs text-slate-400 mb-2 text-center">Selecione uma voz ou playback</p>
          <audio class="audio-player w-full" controls preload="metadata"></audio>
        </div>

      </div>
    `;

    songList.appendChild(itemContainer);
  });
}

// DELEGAÇÃO DE EVENTOS
document.addEventListener("click", function (event) {
  // 1. Clique para Abrir/Recolher Música
  const songCard = event.target.closest(".song-card");
  if (songCard) {
    const numero = songCard.getAttribute("data-numero");

    if (musicaAbertaNumero === numero) {
      musicaAbertaNumero = null;
      mudarCorFundo("default"); // Reseta a cor ao fechar o card
    } else {
      musicaAbertaNumero = numero;
    }

    if (audioAtual) {
      audioAtual.pause();
      audioAtual.src = "";
    }

    const termo =
      document.getElementById("searchInput")?.value.toLowerCase() || "";
    const filtradas = repertorio.filter(
      (m) =>
        m.titulo.toLowerCase().includes(termo) ||
        String(m.numero).toLowerCase().includes(termo),
    );
    renderizarMusicas(filtradas);
    return;
  }

  // 2. Clique em um Naipe da Roda Genius
  const sliceBtn = event.target.closest(".slice, .center-circle");
  if (sliceBtn) {
    const naipe = sliceBtn.getAttribute("data-naipe");
    const numero = sliceBtn.getAttribute("data-numero");
    const musica = repertorio.find((m) => String(m.numero) === String(numero));

    // Altera a cor de fundo para o naipe clicado
    mudarCorFundo(naipe);

    if (!musica || !musica.audios[naipe]) return;

    const parentContent = sliceBtn.closest(".player-content");
    const audio = parentContent.querySelector(".audio-player");
    const label = parentContent.querySelector(".track-label");

    audioAtual = audio;
    label.innerText = `Tocando: ${naipe.toUpperCase()}`;
    audio.src = musica.audios[naipe];

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        label.innerText = `Clique no Play para ouvir (${naipe.toUpperCase()})`;
      });
    }
  }
});

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  carregarRepertorio();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const termo = e.target.value.toLowerCase();
      const filtradas = repertorio.filter(
        (musica) =>
          musica.titulo.toLowerCase().includes(termo) ||
          String(musica.numero).toLowerCase().includes(termo),
      );
      renderizarMusicas(filtradas);
    });
  }
});
