# raglan.au — Website Update Workflow
**Last updated: October 2026**

---

## 🗂️ Folder Structure

```
D:\Dropbox\Development\Website\
├── website\             ← LIVE SITE — edit here, push to master
├── website oct26\       ← October 2026 archive (Apr 2026 build, plain snapshot)
├── website apr26\       ← April 2026 archive (plain snapshot, no git)
├── website mar26\       ← March 2026 archive (plain snapshot, no git)
├── TODO.md
└── WORKFLOW.md
```

**Rule:** Edit directly in `website\`. At the end of each month, copy `website\` to a new archive folder (e.g. `website nov26\`) as a snapshot, then continue editing in `website\`.

**Hosting:** GitHub Pages → `raglan.au` | Repo: `tspRaglan/website` (`master` branch)

---

## 🔁 Current State (October 2026 Relaunch)

The site has been rebuilt from scratch as a clean landing page.

**What's live:** Raglan logo + looping background audio (`EndMusic`)

**What's dormant (in `tsp\` folder, not linked):**
- `tsp/katherine/` — will be re-added ~Week 2
- `tsp/sdp/`       — will be re-added week by week
- `tsp/thanksgary/`— will be re-added week by week
- `tsp/emom-mar26/`— will be re-added week by week

---

## 🚀 How to Deploy Changes

1. Edit files directly in `website\`
2. Open **GitHub Desktop** (or right-click in Explorer → TortoiseGit)
3. **Commit** with a descriptive message
4. **Push** to `master`
5. GitHub Pages detects the push and goes live within ~30 seconds

---

## 🎵 Audio Files

All audio/video is hosted on **Cloudflare R2** — never committed to GitHub.

- Bucket: `raglan-videos`
- Public URL: `https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev`
- rclone remote: `r2:raglan-videos/`
- Account: `Tsp@raglan.au`

### Converting audio before R2 upload

**Source:** `D:\Dropbox\Music & Audio\Production Assets\Ropable Music\EndMusic.wav`

For web delivery with maximum quality (lossless-transparent):
```powershell
ffmpeg -i "EndMusic.wav" -c:a libmp3lame -q:a 0 "EndMusic.mp3"
# -q:a 0 = VBR highest quality (~320kbps equivalent), perceptually lossless
```

Or AAC (smaller file, same perceived quality, excellent browser support):
```powershell
ffmpeg -i "EndMusic.wav" -c:a aac -b:a 256k -movflags +faststart "EndMusic.m4a"
```

### R2 upload command
```powershell
rclone copyto EndMusic.mp3 r2:raglan-videos/EndMusic.mp3 --ignore-times --progress
```

### Swap local → R2 in index.html
```js
// In website/index.html, in the CONFIG block:
const AUDIO_SRC_LOCAL = 'EndMusic.wav';                              // local test
const AUDIO_SRC_R2    = 'https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev/EndMusic.mp3'; // live
```
When `AUDIO_SRC_R2` is set, it takes priority automatically.

---

## ➕ Re-adding a Subproject (Week-by-Week Plan)

Each week, reconnect one subproject to the landing page rotation.

### Steps:
1. Verify the subproject's R2 media still loads (open its `index.html` locally)
2. Update `website\index.html` to load the subproject (iframe + shell player)
3. Apply scaling fixes (see audit report) before re-adding
4. Test on mobile before pushing to master

### Official Calendar Alignment (from Master Calendar & 13-Week Social Plan):
| Window | Event / Drop | Catalog # | Destination / Role |
|---|---|---|---|
| **Oct 02 – Oct 08** | **Prep Week / Landing Launch** | — | `raglan.au` (Raglan logo + EndMusic audio loop) |
| **Oct 09 – Oct 15** | **Week 01: Thanks Gary! Launch** | `01` | `raglan.au/tsp/thanksgary` |
| **Oct 16 – Oct 22** | **Week 02: SDP (wefmyeyeafterward)** | `02` | `raglan.au/tsp/sdp` |
| **Oct 23 – Oct 29** | **Week 03: Katherine** | `03` | `raglan.au/tsp/katherine` |
| **Oct 30 – Nov 05** | **Week 04: ktay5 (Hero Launch)** | `10` | 🚀 **New Release drops Nov 1!** `raglan.au` |
| **Nov 06 – Nov 12** | **Week 05: Bosse** | `04` | Downtempo funk retrospective |
| **Nov 13 – Nov 19** | **Week 06: Splosh!** | `04.5` | Aquatic psych-funk |
| **Nov 20 – Nov 26** | **Week 07: Dumth** | `05` | Modular low-end breakdowns |
| **Nov 27 – Dec 03** | **Week 08: Bluzz Bluzzards (Launch)** | `11` | 🚀 **New Release drops Dec 1!** `raglan.au` |
| **Dec 04 – Dec 10** | **Week 09: Qius** | `06` | Unity animation test fusion |
| **Dec 11 – Dec 17** | **Week 10: Dawn Reed** | `07` | Atmospheric jazz-funk layers |
| **Dec 18 – Dec 24** | **Week 11: Nübißno** | `08` | Micro-timing / polyrhythms |
| **Dec 25 – Dec 31** | **Week 12: Pluppy Liebe** | `09` | Quirky synth explorations |
| **Jan 01 – Jan 07** | **Week 13: 2027 Kickoff** | TBC | Retrospective compilation |

---

## 📅 Starting a New Month (Archive + Continue)

1. Copy `website\` to a new archive folder: `website nov26\`
2. Continue editing in `website\` as normal
3. The archive is a plain snapshot — no git setup needed

---

## 🏗️ Architecture Notes (Landing Page)

- **No iframe** — the landing page is now a single standalone `index.html`
- **Audio element** — `<audio loop preload="auto">` with JS autoplay attempt
- **Click-to-start** — logo click triggers `audio.play()` for browsers that block autoplay
- **Logo:** `assets/RaglanLogoTransparentWhite.png` (copied from katherine)
- **Scaling:** `vmin`-based logo sizing, `env(safe-area-inset-*)` for notch phones, `overscroll-behavior: none`

---

## 📅 Build History

| Build | Folder | Key Changes |
|---|---|---|
| March 2026 | `website mar26\` | Initial: SDP + Thanks Gary, shell+iframe |
| April 2026 | `website apr26\` | Katherine, emom, ultra random jukebox |
| October 2026 | `website\` | Relaunch: clean landing page, scaling overhaul |
