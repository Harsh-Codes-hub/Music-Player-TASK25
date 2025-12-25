// songs data
const totalSongs = [
  {
    title: "Your Love",
    src: "./songs/Your Love.mp3",
    artist: "She Wants Revenge",
    cover: "./covers/Your Love.png",
    duration: "3:36",
    liked: false,
  },
  {
    title: "Missing Textures",
    src: "./songs/Missing Textures.mp3",
    artist: "NIVEK FFORHS",
    cover: "./covers/Missing Textures.png",
    duration: "2:47",
    liked: false,
  },
  {
    title: "Fe en Rebelión",
    src: "./songs/Fe en Rebelión.mp3",
    artist: "yaego",
    cover: "./covers/Fe en Rebelión.png",
    duration: "4:09",
    liked: false,
  },
  {
    title: "The Way I Are",
    src: "./songs/The Way I Are.mp3",
    artist: "Timbaland",
    cover: "./covers/The Way I Are.png",
    duration: "3:00",
    liked: false,
  },
  {
    title: "KEEP FOLLOWING",
    src: "./songs/KEEP FOLLOWING.mp3",
    artist: "Odetari",
    cover: "./covers/KEEP FOLLOWING.png",
    duration: "1:55",
    liked: false,
  },
  {
    title: "Dracula",
    src: "./songs/Dracula.mp3",
    artist: "Tame Impala",
    cover: "./covers/Dracula.png",
    duration: "3:26",
    liked: false,
  },
  {
    title: "Love Potions (Slowed + Reverb)",
    src: "./songs/Love Potions (Slowed + Reverb).mp3",
    artist: "Throwback Trance",
    cover: "./covers/Love Potions (Slowed + Reverb).png",
    duration: "3:13",
    liked: false,
  },
  {
    title: "Killshot",
    src: "./songs/Killshot.mp3",
    artist: "Magdalena Bay",
    cover: "./covers/Killshot.png",
    duration: "3:57",
    liked: false,
  },
  {
    title: "PROTECTION CHARM (SLOW & HARD Version)",
    src: "./songs/PROTECTION CHARM (SLOW & HARD Version).mp3",
    artist: "Miguel Angeles",
    cover: "./covers/PROTECTION CHARM (SLOW & HARD Version).png",
    duration: "3:31",
    liked: false,
  },
  {
    title: "NEW DROP",
    src: "./songs/NEW DROP.mp3",
    artist: "Don Toliver",
    cover: "./covers/NEW DROP.png",
    duration: "3:38",
    liked: false,
  },
  {
    title: "I Was Made For Lovin' You",
    src: "./songs/I Was Made For Lovin' You.mp3",
    artist: "Kiss",
    cover: "./covers/I Was Made For Lovin' You.png",
    duration: "4:32",
    liked: false,
  },
  {
    title: "Stayin Alive",
    src: "./songs/Stayin Alive.mp3",
    artist: "Bee Gees",
    cover: "./covers/Stayin Alive.png",
    duration: "4:44",
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

function renderPlaylist() {
  let clutter = "";
  totalSongs.forEach(function (obj, idx) {
    clutter += `
        <li class="playlistItem ${
          playerState.currentIndex === idx ? "active" : ""
        }" data-index="${idx}">
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
}
renderPlaylist();
renderSongUI();
function loadSong(index) {
  if (index < 0 || index >= totalSongs.length) return;
  playerState.currentIndex = index;
  audioEL.src = totalSongs[index].src;
  renderSongUI();
  renderControls();
}
loadSong(0);

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
}

shuffleBtnEl.addEventListener("click", function () {
  playerState.isShuffle = !playerState.isShuffle;
  if (playerState.isShuffle) generateShuffleOrder(playerState.currentIndex);
  renderControls();
});

loopBtnEl.addEventListener("click", function () {
  playerState.isLooped = !playerState.isLooped;
  renderControls();
});

likeBtnEl.addEventListener("click", function () {
  const song = totalSongs[playerState.currentIndex];
  song.liked = !song.liked;
  renderControls();
});

audioEL.addEventListener("ended", function () {
  playerState.isShuffle ? nextShuffleSong() : nextSong();
  renderControls();
});

audioEL.addEventListener("timeupdate", renderControls);

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
