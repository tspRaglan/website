# Website To-Do

This is a list of future features, fixes, and ideas for the **raglan.au** website projects.

## 🛠️ Critical Maintenance
- [x] **TOMORROW: Verify Live Site**: Confirm `raglan.au` is live on GitHub Pages with working SSL (HTTPS).
- [x] **Enforce HTTPS**: Enable the "Enforce HTTPS" toggle in GitHub Pages settings once DNS is verified.
- [ ] **Backup website repo:** Ensure the repository for the website is properly backed up offline/online.
- [ ] **Folder Structure Migration:** Migrate content from older build folders (`website/`, `website mar26/`) into the current live build (`website apr26/`) where relevant, and clean up/archive outdated folders.
- [x] **Final Netlify Purge:** Netlify site deleted. DNS records verified — all clean, no Netlify remnants.

## 🎨 Design & Branding
- [x] **Raglan Logo:** Integrate the official logo into the root "click to start" screen.
- [x] **Custom Favicons:** Create unique tab icons for each subpage (`sdp`, `thanksgary`).

## 🚀 Feature Ideas
- [x] **Tab Titles:** Ensure the title of the browser tabs all read exactly `raglan.au`.
- [x] **Refresh / Home Link:** Fix the "refresh icon" so that it properly relinks back to the main index page.
- [ ] **Dynamic Templates:** Modify the `video-player-template` to accept a JSON playlist file instead of hardcoded HTML.
- [ ] **Mobile Touch Optimization:** Ensure the volume slider and buttons are easy to use on smaller touch screens (Note: Player controls are currently not visible on mobile devices).
- [ ] **Random Raglan Man:** "The random raglan man everywhere" (Details to be explained later).
- [x] **URL Masking:** Research/implement a way to keep the address bar showing `raglan.au` even when navigating subprojects.
- [x] **Bypass Click-to-Start:** Refactor the start logic to either remove or automate the "click to start" overlay where browser policies allow.
- [ ] **Mobile Compatibility:** Conduct thorough testing across various mobile devices and browsers.
- [ ] **Stress Test Website:** Test the site under load — multiple simultaneous users, slow connections, repeated rapid navigation between subprojects. Check for memory leaks, video stalling, and player UI desyncing from iframe state.
- [ ] **A/V Crossfades:** Implement smooth audio and video transitions/crossfades between tracks or scenes.
- [ ] **Full Playthrough:** Ensure the current media finishes playing before transitioning to a new page or content block.

## 🌟 Stretch Goals (By Thursday, Mar 12)
- [ ] **Redo Video for Thanks Gary!**: Only to be done once all other deadlines are completed.

## 🛠️ Optimization (Future)
- [ ] **Reduce Large File Sizes**: Compress videos and audio files to reduce repository size and improve loading times (detected several files >50MB).

## 🎵 Upcoming Projects
- [ ] **Add Mom Project:** Create a new `tsp/mom/` subproject and add it to the project cycling rotation.

---
_Add new ideas below:_
