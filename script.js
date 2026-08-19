// 1. BANCO DE DADOS DAS MÚSICAS
// Você pode adicionar fora de ordem aqui, o JS vai organizar sozinho!
const repertorio = [
  {
    numero: "18",
    titulo: "Levem a Luz",
    audios: {
      soprano: "audios/levem_soprano.mp3",
      contralto: "audios/levem_contralto.mp3",
      tenor: "audios/levem_tenor.mp3",
      baixo: "audios/18_levem_a_luz_baixo.ogg",
      playback: "audios/levem_playback.mp3",
    },
  },
  {
    numero: "43",
    titulo: "Vem Reinar",
    audios: {
      soprano: "audios/castelo_b_soprano.mp3",
      contralto: "audios/castelo_b_contralto.mp3",
      tenor: "audios/castelo_b_tenor.mp3",
      baixo: "audios/43_vem_reinar_baixo.ogg",
      playback: "audios/castelo_b_playback.mp3",
    },
  },
  {
    numero: "17",
    titulo: "Vem Brilhar em mim",
    audios: {
      soprano: "audios/castelo_soprano.mp3",
      contralto: "audios/castelo_contralto.mp3",
      tenor: "audios/castelo_tenor.mp3",
      baixo: "audios/17_vem_brilhar_em_mim_baixo.ogg",
      playback: "audios/castelo_playback.mp3",
    },
  },
  {
    numero: "37",
    titulo: "Aleluia a Ti",
    audios: {
      soprano: "audios/graca_soprano.mp3",
      contralto: "audios/graca_contralto.mp3",
      tenor: "audios/graca_tenor.mp3",
      baixo: "audios/37_aleluia_a_ti_baixo.ogg",
      playback: "audios/graca_playback.mp3",
    },
  },
];

let currentSongNum = null;
let currentSongData = null;

// 2. FUNÇÃO DE ORDENAÇÃO AUTOMÁTICA (Trata números e subnúmeros como 17b)
function ordenarRepertorio(lista) {
  return [...lista].sort((a, b) => {
    return String(a.numero).localeCompare(String(b.numero), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

// 3. RENDERIZAR A LISTA NA TELA
function renderizarMusicas(lista) {
  const songList = document.getElementById("songList");
  if (!songList) return;

  songList.innerHTML = "";

  if (lista.length === 0) {
    songList.innerHTML =
      '<p class="text-center text-slate-400 py-4">Nenhuma música encontrada.</p>';
    return;
  }

  // Ordena a lista antes de desenhar na tela
  const listaOrdenada = ordenarRepertorio(lista);

  listaOrdenada.forEach((musica) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "song-card w-full text-left p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 active:bg-slate-600 transition-colors mb-2";

    button.setAttribute("data-numero", musica.numero);

    // Junta o número com o título automaticamente na exibição
    button.innerHTML = `<h3 class="font-semibold text-white pointer-events-none">${musica.numero}. ${musica.titulo}</h3>`;
    songList.appendChild(button);
  });
}

// 4. DELEGAÇÃO DE EVENTO GLOBAL (Suporte Mobile)
document.addEventListener("click", function (event) {
  const songCard = event.target.closest(".song-card");
  if (!songCard) return;

  const numero = songCard.getAttribute("data-numero");
  const musica = repertorio.find((m) => String(m.numero) === String(numero));

  if (musica) {
    togglePlayer(musica);
  }
});

// 5. LÓGICA DE ABRIR/RECOLHER (TOGGLE)
function togglePlayer(musica) {
  const playerSection = document.getElementById("playerSection");
  const audio = document.getElementById("audioPlayer");

  if (currentSongNum === musica.numero) {
    audio.pause();
    audio.src = "";
    playerSection.classList.add("hidden");
    currentSongNum = null;
    currentSongData = null;
    return;
  }

  currentSongNum = musica.numero;
  currentSongData = musica.audios;

  document.getElementById("selectedTitle").innerText =
    `${musica.numero}. ${musica.titulo}`;
  document.getElementById("trackLabel").innerText =
    "Selecione um naipe ou playback";

  audio.pause();
  audio.src = "";

  playerSection.classList.remove("hidden");
}

// 6. TOCAR FAIXA SELECIONADA
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

// 7. INICIALIZAÇÃO SEGURA E BUSCA
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
