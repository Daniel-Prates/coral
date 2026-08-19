// BANCO DE DADOS DAS MÚSICAS
const repertorio = [
  {
    numero: "17",
    titulo: "Vem Brilhar Jesus",
    audios: {
      soprano: "audios/graca_soprano.mp3",
      contralto: "audios/graca_contralto.mp3",
      tenor: "audios/graca_tenor.mp3",
      baixo: "audios/17_vem_brilhar_em_mim_baixo.ogg",
      playback: "audios/graca_playback.mp3",
    },
  },
  {
    numero: "18",
    titulo: "Levem a Luz",
    audios: {
      soprano: "audios/castelo_soprano.mp3",
      contralto: "audios/castelo_contralto.mp3",
      tenor: "audios/castelo_tenor.mp3",
      baixo: "audios/18_levem_a_luz_baixo.ogg",
      playback: "audios/castelo_playback.mp3",
    },
  },
  {
    numero: "37",
    titulo: "Aleluia a ti",
    audios: {
      soprano: "audios/levem_soprano.mp3",
      contralto: "audios/levem_contralto.mp3",
      tenor: "audios/levem_tenor.mp3",
      baixo: "audios/37_aleluia_a_ti_baixo.ogg",
      playback: "audios/levem_playback.mp3",
    },
  },
  {
    numero: "43",
    titulo: "Vem reinar",
    audios: {
      soprano: "audios/levem_soprano.mp3",
      contralto: "audios/levem_contralto.mp3",
      tenor: "audios/levem_tenor.mp3",
      baixo: "audios/43_vem_reinar_baixo.ogg",
      playback: "audios/levem_playback.mp3",
    },
  },
];

let musicaAbertaNumero = null;
let audioAtual = null;

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

    // Botão da Música
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
          <p class="track-label text-xs text-slate-400 mb-2 text-center">Selecione um naipe ou playback</p>
          <audio class="audio-player w-full" controls></audio>
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

    // Se clicar na mesma que está aberta: fecha
    if (musicaAbertaNumero === numero) {
      musicaAbertaNumero = null;
    } else {
      musicaAbertaNumero = numero;
    }

    // Para qualquer som tocando
    if (audioAtual) {
      audioAtual.pause();
      audioAtual.src = "";
    }

    // Re-desenha mantendo o estado correto
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
  renderizarMusicas(repertorio);

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
