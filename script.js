    let currentSongData = null;

    function selectSong(title, tracks) {
      currentSongData = tracks;
      document.getElementById('selectedTitle').innerText = title;
      document.getElementById('playerSection').classList.remove('hidden');
    }

    function playTrack(type) {
      if (!currentSongData) return;
      const audio = document.getElementById('audioPlayer');
      const label = document.getElementById('trackLabel');

      label.innerText = `Tocando: ${type.toUpperCase()}`;
      audio.src = currentSongData[type];
      audio.play();
    }
