// Base URL for external video hosting (e.g., Cloudflare R2)
// Leave empty "" to use local "videos/" folder
const BASE_VIDEO_URL = "https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev";

// --- PLAYLIST ---
const playlist = [
    { url: 'peace.mp4',        title: '@peace' },
    { url: 'aqeuous.mp4',      title: 'aqeuous' },
    { url: 'continue.mp4',     title: 'continue' },
    { url: 'katherine.mp4',    title: 'katherine' },
    { url: 'marymelody.mp4',   title: 'mary melody' },
    { url: 'spirittheair.mp4', title: 'spirit the air' },
];

function getVideoUrl(filename) {
    if (BASE_VIDEO_URL) {
        return `${BASE_VIDEO_URL}/${filename.replace(/ /g, '%20')}`;
    }
    return `videos/${filename}`;
}

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isTransitioning = false;
let playedTracks = new Set();

// Redirect destinations when playlist ends
const redirectTargets = ['../sdp/index.html'];

// DOM Elements
const videoA = document.getElementById('video-a');
const videoB = document.getElementById('video-b');
const startScreen = document.getElementById('start-screen');
const playerContainer = document.getElementById('player-container');
const startBtn = document.getElementById('start-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const randomBtn = document.getElementById('random-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackTitle = document.getElementById('track-title');

let activePlayer = videoA;
let inactivePlayer = videoB;
let currentVolume = 0.5;

// Initialization
videoA.volume = currentVolume;
videoB.volume = currentVolume;
videoA.controls = false;
videoB.controls = false;

// Attempt autostart on load
window.addEventListener('load', () => {
    autoStartAttempt();
});

function autoStartAttempt() {
    try {
        startExperience(true);
    } catch (e) {
        console.log("Automatic unmuted start blocked by browser.");
    }
}

// Sync state to parent shell
function syncStateToParent() {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'tsp_state_update',
            isPlaying: isPlaying,
            isRandom: isRandom
        }, '*');
    }
}

// Listen for commands from parent shell
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'tsp_command') {
        switch (data.command) {
            case 'start':        startExperience(false); break;
            case 'toggle_play':  togglePlayPause(); break;
            case 'next':         if (!isTransitioning) jumpToVideo(getNextIndex()); break;
            case 'prev':         if (!isTransitioning) jumpToVideo(getPrevIndex()); break;
            case 'set_volume':   setVolume(data.value); break;
            case 'toggle_random':toggleRandom(); break;
        }
    }
});

// Button event listeners
startBtn.addEventListener('click', startExperience);
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', () => { if (!isTransitioning) jumpToVideo(getPrevIndex()); });
nextBtn.addEventListener('click', () => { if (!isTransitioning) jumpToVideo(getNextIndex()); });
randomBtn.addEventListener('click', toggleRandom);
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

videoA.addEventListener('ended', onVideoEnded);
videoB.addEventListener('ended', onVideoEnded);
videoA.addEventListener('loadeddata', () => { if (activePlayer === videoA) updateTitle(); });
videoB.addEventListener('loadeddata', () => { if (activePlayer === videoB) updateTitle(); });

function startExperience(isAutoStart = false) {
    if (playlist.length === 0) {
        console.warn("Katherine: playlist is empty. Add videos to start.");
        return;
    }

    playedTracks.add(currentIndex);
    activePlayer.src = getVideoUrl(playlist[currentIndex].url);
    activePlayer.muted = false;
    inactivePlayer.muted = false;

    if (sessionStorage.getItem('tsp_started') === 'true' || !isAutoStart) {
        startScreen.style.display = 'none';
        playerContainer.style.display = 'block';
    }

    activePlayer.play().then(() => {
        sessionStorage.setItem('tsp_started', 'true');
        startScreen.style.display = 'none';
        playerContainer.style.display = 'block';
        isPlaying = true;
        updateTitle();
        preloadNext();
        syncStateToParent();

        if (window.parent !== window) {
            window.parent.postMessage({ type: 'tsp_autoplay_success' }, '*');
        }
    }).catch(e => {
        console.warn("Autoplay attempt failed:", e);
        // Show start screen gracefully — no alert
        startScreen.style.display = 'flex';
        playerContainer.style.display = 'none';
    });
}

function updateTitle() {
    const title = playlist[currentIndex]?.title || '';
    if (trackTitle) trackTitle.innerText = title;
    if (window.parent !== window) {
        window.parent.postMessage({ type: 'tsp_track_update', title: title }, '*');
    }
}

function getNextIndex() {
    if (isRandom) {
        let unplayed = [];
        for (let i = 0; i < playlist.length; i++) {
            if (!playedTracks.has(i)) unplayed.push(i);
        }
        if (unplayed.length === 0) return -1;
        return unplayed[Math.floor(Math.random() * unplayed.length)];
    }
    let next = currentIndex + 1;
    if (next >= playlist.length) return -1;
    return next;
}

function getPrevIndex() {
    if (isRandom) return getNextIndex();
    return (currentIndex - 1 + playlist.length) % playlist.length;
}

function preloadNext() {
    const nextIdx = getNextIndex();
    if (nextIdx === -1) return;
    const nextUrl = getVideoUrl(playlist[nextIdx].url);
    if (!inactivePlayer.src || !inactivePlayer.src.includes(nextUrl.replace(' ', '%20'))) {
        inactivePlayer.src = nextUrl;
        inactivePlayer.load();
    }
}

function onVideoEnded() {
    if (!isTransitioning) {
        const nextIdx = getNextIndex();
        if (nextIdx === -1) { triggerRedirect(); return; }
        jumpToVideo(nextIdx);
    }
}

function triggerRedirect() {
    const target = redirectTargets.length > 0
        ? redirectTargets[Math.floor(Math.random() * redirectTargets.length)]
        : '../sdp/index.html';
    window.location.href = target;
}

function jumpToVideo(index) {
    if (index === -1) { triggerRedirect(); return; }

    isTransitioning = true;
    currentIndex = index;
    playedTracks.add(currentIndex);

    const nextUrl = getVideoUrl(playlist[currentIndex].url);
    if (!inactivePlayer.src || !inactivePlayer.src.includes(nextUrl.replace(' ', '%20'))) {
        inactivePlayer.src = nextUrl;
        inactivePlayer.load();
    }

    const prevPlayer = activePlayer;
    activePlayer = inactivePlayer;
    inactivePlayer = prevPlayer;

    playVideo(activePlayer);
    updateTitle();

    activePlayer.classList.add('active');
    inactivePlayer.classList.remove('active');

    setTimeout(() => {
        inactivePlayer.pause();
        inactivePlayer.currentTime = 0;
        preloadNext();
        isTransitioning = false;
    }, 1500);
}

function playVideo(player) {
    player.play().then(() => {
        isPlaying = true;
        syncStateToParent();
    }).catch(e => {
        console.error("Autoplay prevented:", e);
        isPlaying = false;
        syncStateToParent();
    });
}

function togglePlayPause() {
    if (isPlaying) {
        activePlayer.pause();
        isPlaying = false;
        syncStateToParent();
    } else {
        playVideo(activePlayer);
    }
}

function toggleRandom() {
    isRandom = !isRandom;
    syncStateToParent();
    preloadNext();
}

function setVolume(val) {
    currentVolume = val;
    videoA.volume = currentVolume;
    videoB.volume = currentVolume;
}

// Error handling
videoA.addEventListener('error', handleVideoError);
videoB.addEventListener('error', handleVideoError);

function handleVideoError(e) {
    console.error("Video Error:", e);
    if (e.target === activePlayer) {
        if (trackTitle) trackTitle.innerText = "error loading video...";
        setTimeout(() => jumpToVideo(getNextIndex()), 2000);
    }
}
