// Base URL for external video hosting (e.g., Cloudflare R2, AWS S3)
// Leave empty "" to use local "videos/" folder
const BASE_VIDEO_URL = "https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev";

const playlist = [
    { url: '5347.mp4', title: '5347' },
    { url: 'meow meow.mp4', title: 'meow meow' },
    { url: 'quality to order.mp4', title: 'quality to order' },
    { url: 'sdp.mp4', title: 'sdp' },
    { url: 'wefmyeyeafterward.mp4', title: 'wefmyeyeafterward' }
];

function getVideoUrl(filename) {
    if (BASE_VIDEO_URL) {
        // Ensure white spaces are encoded for external URLs
        return `${BASE_VIDEO_URL}/${filename.replace(/ /g, '%20')}`;
    }
    return `videos/${filename}`;
}

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isTransitioning = false;
let playedTracks = new Set();

const CURRENT_PROJECT = 'sdp';
const ALL_PROJECTS = ['katherine', 'sdp', 'thanksgary', 'emom-mar26'];

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

// check if already started via root index or previous page
// OR: attempt to bypass "click to start" if browser allows
window.addEventListener('load', () => {
    autoStartAttempt();
});

function autoStartAttempt() {
    // Attempt playback. Errors catch autoplay blocks.
    try {
        startExperience(true); // true = auto-start mode
    } catch (e) {
        console.log("Automatic unmuted start blocked by browser.");
    }
}

// Global state sync to parent
function syncStateToParent() {
    if (window.parent !== window) {
        window.parent.postMessage({
            type: 'tsp_state_update',
            isPlaying: isPlaying,
            isRandom: isRandom
        }, '*');
    }
}

// Listen for explicit commands from parent iframe shell
window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'tsp_command') {
        console.log("Received command from shell:", data.command);
        switch (data.command) {
            case 'start':
                startExperience(false);
                break;
            case 'toggle_play':
                togglePlayPause();
                break;
            case 'next':
                if (!isTransitioning) jumpToVideo(getNextIndex());
                break;
            case 'prev':
                if (!isTransitioning) jumpToVideo(getPrevIndex());
                break;
            case 'set_volume':
                setVolume(data.value);
                break;
            case 'toggle_random':
                toggleRandom();
                break;
        }
    }
});

// Event Listeners
startBtn.addEventListener('click', startExperience);
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', () => { if (!isTransitioning) jumpToVideo(getPrevIndex()) });
nextBtn.addEventListener('click', () => { if (!isTransitioning) jumpToVideo(getNextIndex()) });
randomBtn.addEventListener('click', toggleRandom);
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));

// Both players need to listen for when their video ends
videoA.addEventListener('ended', onVideoEnded);
videoB.addEventListener('ended', onVideoEnded);

// Preload handling
videoA.addEventListener('loadeddata', () => { if (activePlayer === videoA) updateTitle(); });
videoB.addEventListener('loadeddata', () => { if (activePlayer === videoB) updateTitle(); });

function startExperience(isAutoStart = false) {
    // Setup first video
    playedTracks.add(currentIndex);
    activePlayer.src = getVideoUrl(playlist[currentIndex].url);
    activePlayer.muted = false;
    inactivePlayer.muted = false;

    // Immediately hide start screen if we know session started or if it's not an auto-start (user clicked)
    if (sessionStorage.getItem('tsp_started') === 'true' || !isAutoStart) {
        startScreen.style.display = 'none';
        playerContainer.style.display = 'block';
    }

    activePlayer.play().then(() => {
        // Success! Hide overlays
        sessionStorage.setItem('tsp_started', 'true');
        startScreen.style.display = 'none';
        playerContainer.style.display = 'block';
        isPlaying = true;
        updateTitle();
        preloadNext();
        syncStateToParent();

        // Notify parent that we successfully bypassed the start button
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'tsp_autoplay_success' }, '*');
        }
    }).catch(e => {
        console.warn("Autoplay attempt failed:", e);
        // If this was an manual click, it shouldn't really fail, but if it does (or if session was started but play blocked),
        // we keep the screen visible only if session hasn't started natively.
        if (!isAutoStart && sessionStorage.getItem('tsp_started') !== 'true') {
            alert("Please click the button to start the experience.");
        }
    });
}

function updateTitle() {
    const title = playlist[currentIndex].title;
    if (trackTitle) trackTitle.innerText = title;

    // Notify parent shell
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

        if (unplayed.length === 0) {
            return -1; // Indicates all tracks have been played
        }

        let next = unplayed[Math.floor(Math.random() * unplayed.length)];
        return next;
    }

    // Sequential
    let next = (currentIndex + 1);
    if (next >= playlist.length) {
        return -1; // End of sequential playlist
    }
    return next;
}

function getPrevIndex() {
    if (isRandom) {
        // Random previous doesn't make logical sense for a history without a stack, 
        // so we just pick another random unplayed one
        return getNextIndex();
    }
    return (currentIndex - 1 + playlist.length) % playlist.length;
}

function preloadNext() {
    const nextIdx = getNextIndex();
    if (nextIdx === -1) return; // Nothing left to preload

    const nextUrl = getVideoUrl(playlist[nextIdx].url);
    // Only set src if it's different to avoid reloading unnecessarily
    if (!inactivePlayer.src || !inactivePlayer.src.includes(nextUrl.replace(' ', '%20'))) {
        inactivePlayer.src = nextUrl;
        inactivePlayer.load(); // Request browser to preload
    }
}

function onVideoEnded() {
    if (!isTransitioning) {
        const nextIdx = getNextIndex();
        if (nextIdx === -1) {
            triggerRedirect();
            return;
        }
        jumpToVideo(nextIdx);
    }
}

function triggerRedirect() {
    let played = JSON.parse(sessionStorage.getItem('tsp_played_projects') || '[]');
    if (!played.includes(CURRENT_PROJECT)) played.push(CURRENT_PROJECT);

    let remaining = ALL_PROJECTS.filter(p => !played.includes(p));
    if (remaining.length === 0) {
        // All projects played — reset cycle, pick any except current
        played = [CURRENT_PROJECT];
        remaining = ALL_PROJECTS.filter(p => p !== CURRENT_PROJECT);
    }

    sessionStorage.setItem('tsp_played_projects', JSON.stringify(played));
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    window.location.href = `../${next}/index.html`;
}

function jumpToVideo(index) {
    if (index === -1) {
        triggerRedirect();
        return;
    }

    isTransitioning = true;
    currentIndex = index;
    playedTracks.add(currentIndex);

    const nextUrl = getVideoUrl(playlist[currentIndex].url);
    // We assume inactivePlayer already has the correct src loaded (if it was sequential)
    if (!inactivePlayer.src || !inactivePlayer.src.includes(nextUrl.replace(' ', '%20'))) {
        inactivePlayer.src = nextUrl;
        inactivePlayer.load();
    }

    // Swap active and inactive players
    const prevPlayer = activePlayer;
    activePlayer = inactivePlayer;
    inactivePlayer = prevPlayer;

    // Play the new active player
    playVideo(activePlayer);
    updateTitle();

    // Crossfade UI classes
    activePlayer.classList.add('active');
    inactivePlayer.classList.remove('active');

    // Pause the old video and reset its time after transition (matches 1.5s CSS transition time)
    setTimeout(() => {
        inactivePlayer.pause();
        inactivePlayer.currentTime = 0;
        // Preload the newly determined next index into the now-inactive player
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
    // Update the preload to match the new mode
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
    const brokenSrc = e.target.src;
    if (e.target === activePlayer) {
        trackTitle.innerText = "error loading video...";
        setTimeout(() => jumpToVideo(getNextIndex()), 2000);
    }
}
