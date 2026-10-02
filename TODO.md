# Website To-Do — October 2026 Relaunch

---

## 🔴 Prep Week: Oct 02 – Oct 08 (Clean Landing Page)

- [x] **Audit codebase & scaling** — all bugs and device layout issues documented
- [x] **Archive Apr 2026 build** → `website oct26\`
- [x] **Build minimal landing page** — Raglan logo + EndMusic background loop, tap Raglan man to play/pause
- [x] **Install FFmpeg** — complete
- [x] **Convert audio to studio 320k MP3** — `EndMusic.mp3` (1.57 MB, 48 kHz stereo CBR)
- [ ] **Upload EndMusic.mp3 to R2** — upload to `r2:raglan-videos/EndMusic.mp3`
- [ ] **Set R2 URL in index.html & test** — set `AUDIO_SRC_R2`
- [ ] **Push to master** — deploy clean landing page to `raglan.au`

---

## 🟡 Week 01: Oct 09 – Oct 15 — Thanks Gary! Launch

- **Target Destination:** `raglan.au/tsp/thanksgary`
- [ ] Fix `thanksgary/index.html` bugs:
  - Remove missing `poster="poster.jpg"` (avoids 404)
  - Replace static `<source src="thanksGary.mp4">` with R2 asset URL or let JS set it
  - Change `#bg-video` `100vh` → `100%` (fixes iOS Safari viewport overflow)
  - Replace jarring `alert()` autoplay failure dialog with silent retry
- [ ] Verify all 5 MP3 audio tracks stream cleanly from R2 (`gopher1`, `quitetoo`, `poiy`, `thanksgary`, `xavier`)
- [ ] Verify looping video background streams from R2 (`thanksGary.mp4`)
- [ ] Deploy for Friday Oct 09 social launch

---

## 🟡 Week 02: Oct 16 – Oct 22 — SDP Launch (`wefmyeyeafterward`)

- **Target Destination:** `raglan.au/tsp/sdp`
- [ ] Fix preload string comparison bug for `quality to order.mp4` (`.replace(/ /g, '%20')`)
- [ ] Remove `alert()` from `sdp/script.js`
- [ ] Verify video scaling and waveform alignment on mobile
- [ ] Test dual-video preloading transitions

---

## 🟡 Week 03: Oct 23 – Oct 29 — Katherine Launch

- **Target Destination:** `raglan.au/tsp/katherine`
- [ ] Apply mobile bottom-sheet player UI & safe area insets
- [ ] Fix preload string replacement with regex `/g` flag
- [ ] Verify all 6 videos (`peace`, `continue`, `aqeuous`, `katherine`, `mary melody`, `spirittheair`) on R2

---

## 🚀 Week 04: Oct 30 – Nov 05 — NEW RELEASE: `ktay5` Drop (Nov 1)

- **Target Destination:** `raglan.au` (Hero Launch)
- [ ] Scaffold new project player for `10 - ktay5` (`r261101`)
- [ ] Encode & upload `ktay5` masters and video visuals to Cloudflare R2
- [ ] Deploy live player on `raglan.au` for official Sunday, Nov 1 drop!

---

## 🍂 Weeks 05–13 Roadmap (November – January)

- **Week 05 (Nov 06 – Nov 12):** `04 - bosse`
- **Week 06 (Nov 13 – Nov 19):** `04.5 - splosh!`
- **Week 07 (Nov 20 – Nov 26):** `05 - dumth`
- **Week 08 (Nov 27 – Dec 03):** 🚀 **NEW RELEASE: `11 - bluzz bluzzards`** (Drops Dec 1!)
- **Week 09 (Dec 04 – Dec 10):** `06 - qius`
- **Week 10 (Dec 11 – Dec 17):** `07 - dawn reed`
- **Week 11 (Dec 18 – Dec 24):** `08 - nübißno`
- **Week 12 (Dec 25 – Dec 31):** `09 - pluppy liebe`
- **Week 13 (Jan 01 – Jan 07):** 2027 Kickoff Retrospective

---

## 🔧 Scaling Fixes (Apply as each project is re-added)

From the scaling audit — apply to `website\index.html` when shell player is restored:
- [ ] Bottom-sheet player on mobile (fixes button overflow)
- [ ] `env(safe-area-inset-bottom)` for notch phones
- [ ] Landscape `@media (max-height: 500px)` compact mode
- [ ] `overscroll-behavior: none` ← **already applied** ✓

---

## 📦 Backlog

- [ ] **R2 backup** — `rclone sync r2:raglan-videos/ <external-drive>` before adding new content
- [ ] **Track time bar** — progress/time bar for current track
- [ ] **Dynamic playlists** — JSON-based playlists instead of hardcoded arrays
- [ ] **A/V crossfades** — smooth transitions between tracks
- [ ] **Redo Thanks Gary visuals** — low priority

---

## ✅ Completed (October 2026)

- [x] **Deep code audit** — all bugs documented
- [x] **Scaling audit** — all device issues documented  
- [x] **Archive Apr 2026 build** → `website oct26\`
- [x] **New landing page** — clean logo + audio, all scaling fixes applied
- [x] **`overscroll-behavior: none`** — iOS rubber-band fixed
- [x] **`env(safe-area-inset-*)` padding** — notch/home indicator support
- [x] **`vmin`-based logo** — scales across all screen sizes correctly
- [x] **`viewport-fit=cover`** — required for safe-area-inset to work on iOS
