// songs data
const totalSongs = [
  {
    title: "Your Love",
    src: "./songs/Your Love.mp3",
    artist: "She Wants Revenge",
    cover: "./covers/Your Love.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Missing Textures",
    src: "./songs/Missing Textures.mp3",
    artist: "NIVEK FFORHS",
    cover: "./covers/Missing Textures.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Fe en Rebelión",
    src: "./songs/Fe en Rebelión.mp3",
    artist: "yaego",
    cover: "./covers/Fe en Rebelión.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "The Way I Are",
    src: "./songs/The Way I Are.mp3",
    artist: "Timbaland",
    cover: "./covers/The Way I Are.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "KEEP FOLLOWING",
    src: "./songs/KEEP FOLLOWING.mp3",
    artist: "Odetari",
    cover: "./covers/KEEP FOLLOWING.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Dracula",
    src: "./songs/Dracula.mp3",
    artist: "Tame Impala",
    cover: "./covers/Dracula.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Love Potions (Slowed + Reverb)",
    src: "./songs/Love Potions (Slowed + Reverb).mp3",
    artist: "Throwback Trance",
    cover: "./covers/Love Potions (Slowed + Reverb).png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Killshot",
    src: "./songs/Killshot.mp3",
    artist: "Magdalena Bay",
    cover: "./covers/Killshot.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "PROTECTION CHARM (SLOW & HARD Version)",
    src: "./songs/PROTECTION CHARM (SLOW & HARD Version).mp3",
    artist: "Miguel Angeles",
    cover: "./covers/PROTECTION CHARM (SLOW & HARD Version).png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "NEW DROP",
    src: "./songs/NEW DROP.mp3",
    artist: "Don Toliver",
    cover: "./covers/NEW DROP.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "I Was Made For Lovin' You",
    src: "./songs/I Was Made For Lovin' You.mp3",
    artist: "Kiss",
    cover: "./covers/I Was Made For Lovin' You.png",
    duration: "--:--",
    liked: false,
  },
  {
    title: "Stayin Alive",
    src: "./songs/Stayin Alive.mp3",
    artist: "Bee Gees",
    cover: "./covers/Stayin Alive.png",
    duration: "--:--",
    liked: false,
  },
];

// playerState
const playerState = {
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isLooped: false,
  shuffleOrder: [],
  shufflePointer: 0,
  volume: 1,
  lastVolume: 1,
  isMute: false,
  currentColor: { r: 218, g: 41, b: 28 }, // default red
  isSeeking: false,
  isVolumeDragging: false,
  currentTime: 0,
};

// audio element
const audioEL = document.querySelector("#audio");
// musicPlayerContainer will be used to change background image to cover
const musicPlayerContainerEl = document.querySelector(".musicPlayerContainer");
// container will be used to change its background color as per cover dominant color
const containerEl = document.querySelector(".container");
// playerHeader songTitle should be changed according to current song
const songTitleEl = document.querySelector(".songTitle");
// playerCover cover image should be changed according to current song
const coverEl = document.querySelector(".coverContainer img");
// playerPlaylist
const playListTopEl = document.querySelector(".playlistTop"); // in this we have three elements currentSong, currentArtist, and totalSong to show relevant data to them.
const playlistBottomEl = document.querySelector(".playlistBottom"); // in this we injected our data to form a playlist. And after we will added event Bubbling to make it work to play songs
// rewindBtn to make song jump to 0 then to jump back to previous song. functionality change according to shuffle and loop.
const rewindBtnEl = document.querySelector(".rewind");
// play button pause and play song. its icon will change too. its icon will change to pause if song is played by clicking playlistItem.
const playBtnEl = document.querySelector(".play");
// forwardBtn to make song jump next song. functionality will change according to shuffle and loop.
const forwardBtnEl = document.querySelector(".forward");
// music status songName should change according to current song.
const musicStatusSongNameEl = document.querySelector(
  ".musicStatusTop .songName"
);
// this like button will mark like property to true in main array named totalSongs
const likeBtnEl = document.querySelector("#like");
// this loop button activate loop mode playing whole list infinite
const loopBtnEl = document.querySelector("#loop");
// this shuffle button will generate shuffle indexes according to playlist total songs without repeating songs and place those indexes in playerState object and use them to play songs.
const shuffleBtnEl = document.querySelector("#shuffle");
// songBar is a space in which songProgress bar will show progress of song according to current song playing,  songProgress can be clicked and dragged to jump to a specific part of song
const songBarEl = document.querySelector(".songBar");
// songProgress can be clicked and dragged to jump to a specific part of song
const songProgressEl = document.querySelector(".songProgress");
// artistName present below songBar will show current song artist
const artistNameEl = document.querySelector(".artistName");
// songDuration present below songBar will show current song duration
const songDurationEl = document.querySelector(".songDuration");
// volume down btn will reduce sound step by step or point by point and if click double time it will mute changing it icon to mute
const volumeDownBtnEl = document.querySelector(".volumeDown");
// volume up btn will increase volume
const volumeUpBtnEl = document.querySelector(".volumeUp");
// volume bar is a space which visualize the current volume level. we will set be default 0.50. we have volumeLevel bar present in it that will increase or decrease its width to show level of volume
const volumeBarEl = document.querySelector(".volumeBar");
//volume bar can be dragged and clicked to set volume
const volumeLevelEl = document.querySelector(".volumeLevel");

function getSavableState() {
  return {
    currentIndex: playerState.currentIndex,
    isShuffle: playerState.isShuffle,
    isLooped: playerState.isLooped,
    shuffleOrder: playerState.shuffleOrder,
    shufflePointer: playerState.shufflePointer,
    volume: playerState.volume,
    lastVolume: playerState.lastVolume,
    isMute: playerState.isMute,
    likedSongs: totalSongs.map((song) => song.liked),
  };
}

function savePlayerState() {
  localStorage.setItem("musicPlayerState", JSON.stringify(getSavableState()));
}

function restorePlayerState() {
  const raw = localStorage.getItem("musicPlayerState");
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);

    playerState.currentIndex = saved.currentIndex ?? 0;
    playerState.isShuffle = !!saved.isShuffle;
    playerState.isLooped = !!saved.isLooped;
    playerState.shuffleOrder = saved.shuffleOrder || [];
    playerState.shufflePointer = saved.shufflePointer || 0;
    playerState.volume = saved.volume ?? 1;
    playerState.lastVolume = saved.lastVolume ?? playerState.volume;
    playerState.isMute = !!saved.isMute;
    if (
      playerState.isShuffle &&
      (!Array.isArray(playerState.shuffleOrder) ||
        playerState.shuffleOrder.length !== totalSongs.length)
    ) {
      generateShuffleOrder(playerState.currentIndex);
    }

    if (Array.isArray(saved.likedSongs)) {
      saved.likedSongs.forEach((val, i) => {
        if (totalSongs[i]) totalSongs[i].liked = val;
      });
    }
  } catch (err) {
    console.warn("Failed to restore player state");
  }
}

function getDominantColor(songCover) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = songCover.naturalWidth || songCover.width;
  canvas.height = songCover.naturalHeight || songCover.height;
  ctx.drawImage(songCover, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0,
    g = 0,
    b = 0,
    count = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
    count++;
  }

  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count),
  };
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function hydrateSongDuration(index) {
  const song = totalSongs[index];
  if (song.duration !== "--:--") return;
  const tempAudio = new Audio();
  tempAudio.src = song.src;
  tempAudio.preload = "metadata";
  tempAudio.addEventListener("loadedmetadata", function () {
    song.duration = formatTime(tempAudio.duration);
    renderPlaylist();
  });
}

function renderPlaylist() {
  let clutter = "";
  totalSongs.forEach(function (obj, idx) {
    hydrateSongDuration(idx);
    clutter += `
        <li class="playlistItem ${
          playerState.currentIndex === idx ? "active" : ""
        }" data-index="${idx}">
        <span class="beatAccent"></span>
        <span class="count">${idx + 1}</span>
        <span class="name">${obj.title}</span>
        <span class="duration">${obj.duration}</span>
        </li>
        `;
  });
  playlistBottomEl.innerHTML = clutter;
  const currentSong = totalSongs[playerState.currentIndex];
  playListTopEl.querySelector(".currentSong").textContent = currentSong.title;
  playListTopEl.querySelector(".currentArtist").textContent =
    currentSong.artist;
  playListTopEl.querySelector(
    ".totalSongs"
  ).innerHTML = `${totalSongs.length} Songs`;
  const activeEl = playlistBottomEl.querySelector(".playlistItem.active");
  if (activeEl) {
    Object.assign(activeEl.style, {
      backgroundImage: `linear-gradient(to left, transparent 0%, rgba(${playerState.currentColor.r}, ${playerState.currentColor.g}, ${playerState.currentColor.b}, 0.9) 15%, rgba(0, 0, 0, 0.5) 85%, transparent 100%)`,
    });
    activeEl.querySelector(".name").style.color = "var(--danger)";
    activeEl.querySelector(
      ".count"
    ).innerHTML = `<i class="ri-bar-chart-fill"></i>`;
  }
}

function renderSongUI() {
  const currentSong = totalSongs[playerState.currentIndex];
  document.querySelector("title").innerHTML = playerState.isPlaying
    ? `Playing ${currentSong.title}`
    : `Music Player`;
  songTitleEl.textContent = currentSong.title;
  musicStatusSongNameEl.textContent = currentSong.title;
  artistNameEl.textContent = currentSong.artist;
  songDurationEl.textContent = currentSong.duration;
  coverEl.src = currentSong.cover;
  coverEl.onload = () => {
    playerState.currentColor = getDominantColor(coverEl);
    containerEl.style.backgroundColor = `rgba(${playerState.currentColor.r}, ${playerState.currentColor.g}, ${playerState.currentColor.b}, 0.3)`;
    renderPlaylist();
  };
  musicPlayerContainerEl.style.backgroundImage = `url("${currentSong.cover}")`;
  musicStatusSongNameEl.style.transform = "translateY(6px)";
  musicStatusSongNameEl.style.opacity = "0";

  songTitleEl.style.transform = "translateY(6px)";
  songTitleEl.style.opacity = "0";

  artistNameEl.style.transform = "translateY(6px)";
  artistNameEl.style.opacity = "0";

  setTimeout(() => {
    musicStatusSongNameEl.style.transform = "translateY(0)";
    musicStatusSongNameEl.style.opacity = "1";

    songTitleEl.style.transform = "translateY(0)";
    songTitleEl.style.opacity = "1";

    artistNameEl.style.transform = "translateY(0)";
    artistNameEl.style.opacity = "1";
  }, 150);
}

function initVolume() {
  audioEL.volume = playerState.volume;
  volumeLevelEl.style.width = `${playerState.volume * 100}%`;
}

function loadSong(index) {
  if (index < 0 || index >= totalSongs.length) return;
  playerState.currentIndex = index;
  songDurationEl.textContent = `0:00 / ${totalSongs[index].duration}`;
  audioEL.src = totalSongs[index].src;
  renderSongUI();
  renderControls();
  savePlayerState();
}

restorePlayerState();
playerState.isPlaying = false;
audioEL.pause();
initVolume();
loadSong(playerState.currentIndex);
renderPlaylist();
renderSongUI();

function playSong() {
  setTimeout(() => {
    audioEL.play();
  }, 500);
  playerState.isPlaying = true;
  renderControls();
}

function pauseSong() {
  audioEL.pause();
  playerState.isPlaying = false;
  renderControls();
}

function setButtonDisabled(elem, isDisabled) {
  elem.style.opacity = isDisabled ? "0.4" : "1";
  elem.style.pointerEvents = isDisabled ? "none" : "auto";
}

function renderControls() {
  playBtnEl.innerHTML = playerState.isPlaying
    ? `<i class="ri-pause-large-fill"></i>`
    : `<i class="ri-play-large-fill"></i>`;
  loopBtnEl.style.color = playerState.isLooped
    ? "var(--danger)"
    : "var(--text)";
  shuffleBtnEl.style.color = playerState.isShuffle
    ? "var(--danger)"
    : "var(--text)";
  const liked = totalSongs[playerState.currentIndex].liked;
  likeBtnEl.style.color = liked ? "var(--danger)" : "var(--text)";

  volumeDownBtnEl.innerHTML =
    playerState.isMute || playerState.volume === 0
      ? `<i class="ri-volume-mute-fill"></i>`
      : `<i class="ri-volume-down-fill"></i>`;

  const rewindDisabled =
    !playerState.isLooped &&
    ((playerState.isShuffle &&
      playerState.shufflePointer === 0 &&
      audioEL.currentTime <= 1.5) ||
      (!playerState.isShuffle &&
        playerState.currentIndex === 0 &&
        audioEL.currentTime <= 1.5));

  const forwardDisabled =
    !playerState.isLooped &&
    ((playerState.isShuffle &&
      playerState.shufflePointer === playerState.shuffleOrder.length - 1) ||
      (!playerState.isShuffle &&
        playerState.currentIndex === totalSongs.length - 1));

  setButtonDisabled(rewindBtnEl, rewindDisabled);
  setButtonDisabled(forwardBtnEl, forwardDisabled);

  playBtnEl.innerHTML = playerState.isPlaying
    ? `<i class="ri-pause-large-fill"></i>`
    : `<i class="ri-play-large-fill"></i>`;
}

playlistBottomEl.addEventListener("click", function (elem) {
  const item = elem.target.closest(".playlistItem");
  if (!item) return;
  const index = Number(item.dataset.index);
  loadSong(index);
  if (playerState.isShuffle) generateShuffleOrder(index);
  playSong();
});

function nextSong() {
  if (playerState.isShuffle) {
    if (
      !playerState.isLooped &&
      playerState.shufflePointer === playerState.shuffleOrder.length - 1
    )
      return;

    playerState.shufflePointer =
      playerState.shufflePointer === playerState.shuffleOrder.length - 1
        ? 0
        : playerState.shufflePointer + 1;

    loadSong(playerState.shuffleOrder[playerState.shufflePointer]);
  } else {
    if (
      !playerState.isLooped &&
      playerState.currentIndex === totalSongs.length - 1
    )
      return;

    const nextIndex =
      playerState.currentIndex === totalSongs.length - 1
        ? 0
        : playerState.currentIndex + 1;

    loadSong(nextIndex);
  }

  playSong();
}

function prevSong() {
  if (audioEL.currentTime > 1.5) {
    audioEL.currentTime = 0;
    return;
  }
  if (playerState.isShuffle) {
    if (!playerState.isLooped && playerState.shufflePointer === 0) return;
    playerState.shufflePointer =
      playerState.shufflePointer === 0
        ? playerState.shuffleOrder.length - 1
        : playerState.shufflePointer - 1;
    loadSong(playerState.shuffleOrder[playerState.shufflePointer]);
  } else {
    if (!playerState.isLooped && playerState.currentIndex === 0) return;
    const nextIndex =
      playerState.currentIndex === 0
        ? totalSongs.length - 1
        : playerState.currentIndex - 1;
    loadSong(nextIndex);
  }
  playSong();
}

function generateShuffleOrder(startIndex = playerState.currentIndex) {
  const order = totalSongs.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const startPos = order.indexOf(startIndex);
  [order[0], order[startPos]] = [order[startPos], order[0]];
  playerState.shuffleOrder = order;
  playerState.shufflePointer = 0;
  renderControls();
  savePlayerState();
}

shuffleBtnEl.addEventListener("click", function () {
  playerState.isShuffle = !playerState.isShuffle;
  if (playerState.isShuffle) generateShuffleOrder(playerState.currentIndex);
  renderControls();
  savePlayerState();
});

loopBtnEl.addEventListener("click", function () {
  playerState.isLooped = !playerState.isLooped;
  renderControls();
  savePlayerState();
});

likeBtnEl.addEventListener("click", function () {
  const song = totalSongs[playerState.currentIndex];
  song.liked = !song.liked;
  renderControls();
  savePlayerState();
});

audioEL.addEventListener("ended", function () {
  nextSong();
});

audioEL.addEventListener("timeupdate", function () {
  if (!audioEL.duration) return;
  const current = formatTime(audioEL.currentTime);
  const total = totalSongs[playerState.currentIndex].duration;
  songDurationEl.textContent = `${current} / ${total}`;
  const percent = (audioEL.currentTime / audioEL.duration) * 100;
  songProgressEl.style.width = `${percent}%`;
  renderControls();
});

audioEL.addEventListener("loadedmetadata", function () {
  const song = totalSongs[playerState.currentIndex];
  if (song.duration === "--:--") {
    song.duration = formatTime(audioEL.duration);
    renderPlaylist();
  }
  songDurationEl.textContent = `0:00 / ${song.duration}`;
  renderPlaylist();
});

playBtnEl.addEventListener("click", function () {
  playerState.isPlaying ? pauseSong() : playSong();
  renderControls();
});

rewindBtnEl.addEventListener("click", function () {
  prevSong();
  renderControls();
});

forwardBtnEl.addEventListener("click", function () {
  nextSong();
  renderControls();
});

songBarEl.addEventListener("click", function (elem) {
  if (!audioEL.duration) return;
  const rect = songBarEl.getBoundingClientRect();
  const clickX = elem.clientX - rect.left;
  const percent = clickX / rect.width;
  audioEL.currentTime = percent * audioEL.duration;
  renderControls();
});

songBarEl.addEventListener("mousedown", function () {
  playerState.isSeeking = true;
  renderControls();
});

document.addEventListener("mouseup", function () {
  playerState.isSeeking = false;
  playerState.isVolumeDragging = false;
  renderControls();
});

document.addEventListener("mousemove", function (elem) {
  if (playerState.isSeeking && audioEL.duration) {
    const rect = songBarEl.getBoundingClientRect();
    const moveX = Math.max(0, Math.min(elem.clientX - rect.left, rect.width));
    const percent = moveX / rect.width;
    audioEL.currentTime = percent * audioEL.duration;
    return;
  }
  if (playerState.isVolumeDragging) {
    const rect = volumeBarEl.getBoundingClientRect();
    const moveX = Math.max(0, Math.min(elem.clientX - rect.left, rect.width));
    const percent = moveX / rect.width;
    applyVolume(percent);
  }
  renderControls();
});

function applyVolume(vol) {
  vol = Math.max(0, Math.min(vol, 1));
  audioEL.volume = vol;
  playerState.volume = vol;
  volumeLevelEl.style.width = `${vol * 100}%`;
  if (vol === 0) {
    playerState.isMute = true;
  } else {
    playerState.isMute = false;
    playerState.lastVolume = vol;
  }
  renderControls();
  savePlayerState();
}

volumeDownBtnEl.addEventListener("click", function () {
  if (playerState.isMute) {
    applyVolume(playerState.lastVolume);
    return;
  }
  applyVolume(playerState.volume - 0.05);
  renderControls();
});

volumeUpBtnEl.addEventListener("click", function () {
  if (playerState.isMute) {
    applyVolume(playerState.lastVolume || 0.5);
  } else {
    applyVolume(Math.min(playerState.volume + 0.05, 1));
  }
  renderControls();
});

volumeDownBtnEl.addEventListener("dblclick", function () {
  if (!playerState.isMute) {
    playerState.lastVolume = playerState.volume;
    applyVolume(0);
  } else {
    applyVolume(playerState.lastVolume || 0.5);
  }
  renderControls();
});

volumeBarEl.addEventListener("click", function (e) {
  const rect = volumeBarEl.getBoundingClientRect();
  const moveX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const percent = moveX / rect.width;
  applyVolume(percent);
  renderControls();
});

volumeBarEl.addEventListener("mousedown", function (elem) {
  playerState.isVolumeDragging = true;
  const rect = volumeBarEl.getBoundingClientRect();
  const moveX = Math.max(0, Math.min(elem.clientX - rect.left, rect.width));
  const percent = moveX / rect.width;
  applyVolume(percent);
  renderControls();
});

function toggleMute() {
  if (!playerState.isMute) {
    playerState.lastVolume = playerState.volume;
    applyVolume(0);
    playerState.isMute = true;
  } else {
    applyVolume(playerState.lastVolume || 0.5);
    playerState.isMute = false;
  }
  savePlayerState();
}

document.addEventListener("keydown", function (elem) {
  if (elem.target.tagName === "INPUT") return;

  switch (elem.code) {
    case "Space":
      elem.preventDefault();
      playerState.isPlaying ? pauseSong() : playSong();
      break;
    case "ArrowRight":
      nextSong();
      break;
    case "ArrowLeft":
      prevSong();
      break;
    case "KeyL":
      loopBtnEl.click();
      break;
    case "KeyS":
      shuffleBtnEl.click();
      break;
    case "KeyM":
      toggleMute();
      break;
    case "ArrowUp":
      applyVolume(Math.min(playerState.volume + 0.05, 1));
      break;
    case "ArrowDown":
      applyVolume(Math.max(playerState.volume - 0.05, 0));
      break;
  }
});
