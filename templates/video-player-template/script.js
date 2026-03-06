const playlist = [
    { url: 'videos/video1.mp4', title: 'video 1' },
    { url: 'videos/video2.mp4', title: 'video 2' },
    { url: 'videos/video3.mp4', title: 'video 3' },
    { url: 'videos/video4.mp4', title: 'video 4' },
    { url: 'videos/video5.mp4', title: 'video 5' }
];

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isTransitioning = false;
let playedTracks = new Set();

// Configurable redirect destinations for future projects
const redirectTargets = []; // Add redirect URLs here, e.g., ['../next-page/index.html']

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
if (sessionStorage.getItem('tsp_started') === 'true') {
    // we need to wait for a tiny bit or user interaction in some strict browsers, 
    // but usually, if coming from another page in the same session, it's allowed.
    // to be safe, we'll try to start, and if it fails, the overlay is still there.
    window.addEventListener('load', () => {
        startExperience();
    });
}

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

function startExperience() {
    sessionStorage.setItem('tsp_started', 'true');
    startScreen.style.display = 'none';
    playerContainer.style.display = 'block';

    // Setup first video
    playedTracks.add(currentIndex);
    activePlayer.src = playlist[currentIndex].url;
    activePlayer.muted = false; // Unmute user initiated playback
    inactivePlayer.muted = false;

    playVideo(activePlayer);
    updateTitle();
    preloadNext();
}

function updateTitle() {
    trackTitle.innerText = playlist[currentIndex].title;
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

    // Only set src if it's different to avoid reloading unnecessarily
    if (!inactivePlayer.src || !inactivePlayer.src.includes(playlist[nextIdx].url.replace(' ', '%20'))) {
        inactivePlayer.src = playlist[nextIdx].url;
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
    // If we have specific targets, pick one at random
    if (redirectTargets.length > 0) {
        const target = redirectTargets[Math.floor(Math.random() * redirectTargets.length)];
        window.location.href = target;
    } else {
        // Fallback: This would ideally list directories dynamically, 
        // but since we can't do that purely in client-side JS without a backend/API,
        // we use the current known structure as a default.
        window.location.href = '../thanksgary/index.html';
    }
}

function jumpToVideo(index) {
    if (index === -1) {
        triggerRedirect();
        return;
    }

    isTransitioning = true;
    currentIndex = index;
    playedTracks.add(currentIndex);

    // We assume inactivePlayer already has the correct src loaded (if it was sequential)
    if (!inactivePlayer.src || !inactivePlayer.src.includes(playlist[currentIndex].url.replace(' ', '%20'))) {
        inactivePlayer.src = playlist[currentIndex].url;
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
        playPauseBtn.innerHTML = '&#10074;&#10074;'; // Pause icon
    }).catch(e => {
        console.error("Autoplay prevented:", e);
        isPlaying = false;
        playPauseBtn.innerHTML = '&#9654;'; // Play icon
    });
}

function togglePlayPause() {
    if (isPlaying) {
        activePlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '&#9654;';
    } else {
        playVideo(activePlayer);
    }
}

function toggleRandom() {
    isRandom = !isRandom;
    if (isRandom) {
        randomBtn.classList.add('active-random');
    } else {
        randomBtn.classList.remove('active-random');
    }
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
