const BASE_VIDEO_URL = "https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev";

const playlist = [
    { url: 'emom-mar26.mp4', title: 'emom mar26' },
];

const CURRENT_PROJECT = 'emom-mar26';
const ALL_PROJECTS = ['katherine', 'sdp', 'thanksgary', 'emom-mar26'];
const PROJECT_TRACK_COUNTS = { 'katherine': 6, 'sdp': 5, 'thanksgary': 5, 'emom-mar26': 1 };

function getUltraStartTrack() {
    const t = parseInt(new URLSearchParams(window.location.search).get('ultratrack'));
    return isNaN(t) ? 0 : Math.min(t, playlist.length - 1);
}

function getVideoUrl(filename) {
    if (BASE_VIDEO_URL) {
        return `${BASE_VIDEO_URL}/${filename.replace(/ /g, '%20')}`;
    }
    return `videos/${filename}`;
}

let currentIndex = getUltraStartTrack();
let isPlaying = false;
let isRandom = false;
let isTransitioning = false;
let ultraRandomMode = false;
let playedTracks = new Set();

const videoA = document.getElementById('video-a');
const videoB = document.getElementById('video-b');
const startScreen = document.getElementById('start-screen');
const playerContainer = document.getElementById('player-container');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const randomBtn = document.getElementById('random-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackTitle = document.getElementById('track-title');

let activePlayer = videoA;
let inactivePlayer = videoB;
let currentVolume = 0.5;

videoA.volume = currentVolume;
videoB.volume = currentVolume;
videoA.controls = false;
videoB.controls = false;

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

function syncStateToParent() {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'tsp_state_update',
            isPlaying: isPlaying,
            isRandom: isRandom
        }, '*');
    }
}

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'tsp_command') {
        switch (data.command) {
            case 'start':        startExperience(false); break;
            case 'toggle_play':  togglePlayPause(); break;
            case 'next':
                if (!isTransitioning) {
                    if (ultraRandomMode) jumpToRandomProject();
                    else jumpToVideo(getNextIndex());
                }
                break;
            case 'prev':         if (!isTransitioning) jumpToVideo(getPrevIndex()); break;
            case 'set_volume':   setVolume(data.value); break;
            case 'toggle_random':  toggleRandom(); break;
            case 'ultra_jump':     if (!isTransitioning) jumpToRandomProject(); break;
            case 'set_ultra_random': ultraRandomMode = data.value; break;
        }
    }
});

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', () => { if (!isTransitioning) jumpToVideo(getPrevIndex()); });
nextBtn.addEventListener('click', () => {
    if (!isTransitioning) {
        if (ultraRandomMode) jumpToRandomProject();
        else jumpToVideo(getNextIndex());
    }
});
randomBtn.addEventListener('click', toggleRandom);
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

videoA.addEventListener('ended', onVideoEnded);
videoB.addEventListener('ended', onVideoEnded);
videoA.addEventListener('loadeddata', () => { if (activePlayer === videoA) updateTitle(); });
videoB.addEventListener('loadeddata', () => { if (activePlayer === videoB) updateTitle(); });

function startExperience(isAutoStart = false) {
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
        syncStateToParent();

        if (window.parent !== window) {
            window.parent.postMessage({ type: 'tsp_autoplay_success' }, '*');
        }
    }).catch(e => {
        console.warn("Autoplay attempt failed:", e);
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
    const next = currentIndex + 1;
    if (next >= playlist.length) return -1;
    return next;
}

function getPrevIndex() {
    return (currentIndex - 1 + playlist.length) % playlist.length;
}

function onVideoEnded() {
    if (!isTransitioning) {
        if (ultraRandomMode) { jumpToRandomProject(); return; }
        triggerRedirect();
    }
}

function jumpToRandomProject() {
    if (isTransitioning) return;
    isTransitioning = true;

    let trackPlayed = JSON.parse(sessionStorage.getItem('tsp_ultra_track_played') || '[]');
    let sitePlayed  = JSON.parse(sessionStorage.getItem('tsp_ultra_site_played')  || '[]');

    const totalTracks = ALL_PROJECTS.reduce((sum, p) => sum + PROJECT_TRACK_COUNTS[p], 0);
    if (trackPlayed.length >= totalTracks) { trackPlayed = []; sitePlayed = []; }

    const availableSites = ALL_PROJECTS.filter(p => {
        for (let i = 0; i < PROJECT_TRACK_COUNTS[p]; i++)
            if (!trackPlayed.includes(`${p}:${i}`)) return true;
        return false;
    });

    if (!sitePlayed.includes(CURRENT_PROJECT)) sitePlayed.push(CURRENT_PROJECT);

    let siteRemaining = availableSites.filter(p => !sitePlayed.includes(p));
    if (siteRemaining.length === 0) {
        sitePlayed = availableSites.includes(CURRENT_PROJECT) ? [CURRENT_PROJECT] : [];
        siteRemaining = availableSites.filter(p => !sitePlayed.includes(p));
    }
    if (siteRemaining.length === 0) siteRemaining = availableSites;

    sessionStorage.setItem('tsp_ultra_site_played',  JSON.stringify(sitePlayed));

    const nextSite = siteRemaining[Math.floor(Math.random() * siteRemaining.length)];

    const unplayed = [];
    for (let i = 0; i < PROJECT_TRACK_COUNTS[nextSite]; i++)
        if (!trackPlayed.includes(`${nextSite}:${i}`)) unplayed.push(i);

    const track = unplayed[Math.floor(Math.random() * unplayed.length)];
    trackPlayed.push(`${nextSite}:${track}`);
    sessionStorage.setItem('tsp_ultra_track_played', JSON.stringify(trackPlayed));

    window.location.href = `../${nextSite}/index.html?ultratrack=${track}`;
}

function triggerRedirect() {
    let played = JSON.parse(sessionStorage.getItem('tsp_played_projects') || '[]');
    if (!played.includes(CURRENT_PROJECT)) played.push(CURRENT_PROJECT);

    let remaining = ALL_PROJECTS.filter(p => !played.includes(p));
    if (remaining.length === 0) {
        played = [CURRENT_PROJECT];
        remaining = ALL_PROJECTS.filter(p => p !== CURRENT_PROJECT);
    }

    sessionStorage.setItem('tsp_played_projects', JSON.stringify(played));
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    window.location.href = `../${next}/index.html`;
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
}

function setVolume(val) {
    currentVolume = val;
    videoA.volume = currentVolume;
    videoB.volume = currentVolume;
}

// Loading screen
const loadingScreen = document.getElementById('loading-screen');
function showLoading() { if (loadingScreen && isPlaying) loadingScreen.style.display = 'flex'; }
function hideLoading() { if (loadingScreen) loadingScreen.style.display = 'none'; }
videoA.addEventListener('waiting', showLoading);
videoB.addEventListener('waiting', showLoading);
videoA.addEventListener('stalled', showLoading);
videoB.addEventListener('stalled', showLoading);
videoA.addEventListener('playing', hideLoading);
videoB.addEventListener('playing', hideLoading);
videoA.addEventListener('canplay', hideLoading);
videoB.addEventListener('canplay', hideLoading);

videoA.addEventListener('error', handleVideoError);
videoB.addEventListener('error', handleVideoError);

function handleVideoError(e) {
    console.error("Video Error:", e);
    if (e.target === activePlayer) {
        if (trackTitle) trackTitle.innerText = "error loading video...";
        setTimeout(() => triggerRedirect(), 2000);
    }
}
