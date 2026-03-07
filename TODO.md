# Project To-Do List

This is a list of future features, fixes, and ideas for the **raglan.au** website projects.

---

## 🛠️ Critical Maintenance
- [ ] **Recompile Video:** Re-encode `wefmyeyeafterward.mp4` with the correct visuals (currently uses temporary visuals from `5347.mp4`).
- [ ] **Monitor DNS:** Verify that the SSL certificate (HTTPS) finishes provisioning on Netlify.

## 🎨 Design & Branding
- [x] **Raglan Logo:** Integrate the official logo into the root "click to start" screen.
- [ ] **Custom Favicons:** Create unique tab icons for each subpage (`sdp`, `thanksgary`).
- [ ] **Logo Random Redirect:** Implement the Raglan logo as a button that redirects the user to a random subproject (e.g., from `thanksgary` to `sdp`).

## 🚀 Bandwidth & Performance
- [ ] **Video Compression:** Re-encode all videos in `tsp/sdp` and `tsp/thanksgary` to reduce their size significantly and save bandwidth.
- [ ] **External Video Hosting:** Move high-bandwidth video files to an external service like Cloudflare R2 or AWS S3 to bypass Netlify's 100GB limit.
- [ ] **Lazy Loading:** Ensure videos only load when the user is about to watch them.

## 🚀 Feature Ideas
- [ ] **Project Katherine:** Create a new dedicated video player project for Katherine.
- [ ] **Dynamic Templates:** Modify the `video-player-template` to accept a JSON playlist file instead of hardcoded HTML.
- [ ] **Mobile Touch Optimization:** Ensure the volume slider and buttons are easy to use on smaller touch screens.
- [x] **URL Masking:** Research/implement a way to keep the address bar showing `raglan.au` even when navigating subprojects.
- [ ] **Bypass Click-to-Start:** Refactor the start logic to either remove or automate the "click to start" overlay where browser policies allow.

## 📱 Social & Marketing
- [ ] **Social Automation:** Setup social media accounts to sync with website content.
- [ ] **Content Scheduling:** Implement a system to schedule out automated posts.

---
*Add new ideas below:*
