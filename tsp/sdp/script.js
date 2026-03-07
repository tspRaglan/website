const playlist = [
    { url: 'videos/5347.mp4', title: '5347' },
    { url: 'videos/meow meow.mp4', title: 'meow meow' },
    { url: 'videos/quality to order.mp4', title: 'quality to order' },
    { url: 'videos/sdp.mp4', title: 'sdp' },
    { url: 'videos/wefmyeyeafterward.mp4', title: 'wefmyeyeafterward' }
];

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isTransitioning = false;
let playedTracks = new Set();

// Configurable redirect destinations for future projects
// If this list is empty, the script can be made to redirect to any sibling folder
const redirectTargets = ['../thanksgary/index.html'];

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
    // We attempt to start unmuted. If it works, we notify the parent.
    // This allows the parent to hide the root "click to start" screen.
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
    activePlayer.src = playlist[currentIndex].url;
    activePlayer.muted = false;
    inactivePlayer.muted = false;

    activePlayer.play().then(() => {
        // Success! Hide overlays
        sessionStorage.setItem('tsp_started', 'true');
        startScreen.style.display = 'none';
        playerContainer.style.display = 'block';
        isPlaying = true;
        playPauseBtn.innerHTML = '&#10074;&#10074;';
        updateTitle();
        preloadNext();

        // Notify parent that we successfully bypassed the start button
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'tsp_autoplay_success' }, '*');
        }
    }).catch(e => {
        console.warn("Autoplay attempt failed:", e);
        // If this was an manual click, it shouldn't really fail, but if it does, 
        // we keep the screen visible. If it was auto, we definitely do nothing.
        if (!isAutoStart) {
            alert("Please click the button to start the experience.");
        }
    });
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
    let target = '';
    if (redirectTargets.length > 0) {
        target = redirectTargets[Math.floor(Math.random() * redirectTargets.length)];
    } else {
        target = '../thanksgary/index.html';
    }

    // if in iframe, tell parent to change src or change our own href
    // since we want to keep the root URL, we should ideally change the iframe src
    // but a simple href change inside the iframe also keeps the root URL in the address bar!
    window.location.href = target;
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
