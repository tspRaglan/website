# raglan.au — Website Update Workflow

This document tracks the standard process for updating and extending the raglan.au website.

---

## 🗂️ Project Structure

```
Development/Website/
├── website mar26/       ← Previous build (archive)
├── website apr26/       ← Current build (live source)
│   ├── index.html       ← Root shell (logo splash + global player UI)
│   ├── CONFIGURATION.md ← Hosting, DNS, GitHub settings
│   ├── tsp/
│   │   ├── sdp/         ← SDP video subproject
│   │   ├── thanksgary/  ← Thanks Gary audio subproject
│   │   └── katherine/   ← Katherine video subproject (added Apr 2026)
│   └── templates/
│       └── video-player-template/
```

**Hosting:** GitHub Pages → `raglan.au` | Auto-deploys from GitHub `tspRaglan/thanksgary` (`master` branch)

---

## 🚀 How to Deploy Changes

1. Make changes inside `website apr26/`
2. Open **GitHub Desktop** (or right-click in Explorer → TortoiseGit)
3. **Commit** with a descriptive message
4. **Push** to `master`
5. GitHub Pages detects the push and goes live within ~30 seconds

---

## ➕ Adding a New Subproject

Follow this pattern each time a new artist/EP page is needed.

### 1. Create a new website build folder
```powershell
Copy-Item -Path "C:\tsp\Development\Website\website apr26" `
          -Destination "C:\tsp\Development\Website\website [month][year]" `
          -Recurse -Force
```

### 2. Scaffold the subproject folder
```powershell
New-Item -ItemType Directory -Force `
    -Path "C:\tsp\Development\Website\website [month][year]\tsp\[projectname]\videos"
```

Create these files inside the new folder:
- `index.html` — copy from an existing subproject (e.g. `sdp/`)
- `styles.css` — copy from `sdp/`
- `script.js` — copy from `sdp/`, then clear the playlist array

### 3. Upload raw video assets
Drop raw `.mp4` files into `tsp/[projectname]/videos/`
Naming convention: `[trackname]R.mp4` (R = Raw)

### 4. Compress videos for web (see section below)

### 5. Populate the playlist in `script.js`
```js
const playlist = [
    { url: 'compressed/trackname.mp4', title: 'track name' },
];
```

### 6. (Optional) Update root `index.html` iframe src
To make a subproject the default landing experience:
```html
<iframe id="main-shell" src="tsp/[projectname]/index.html" ...>
```

### 7. Copy a favicon into the subproject folder
- Use `favicon.png` from the root or create a custom one

---

## 🎬 Video Compression (FFmpeg)

Raw videos exported from DaVinci Resolve are typically 100–200MB each and not optimised for streaming. Always compress before publishing.

### Settings used
| Setting | Value | Reason |
|---|---|---|
| Codec | `libx264` | Universal browser support |
| CRF | `26` | Good quality/size balance (~60–70% size reduction) |
| Preset | `slow` | Better compression at same quality |
| Audio | `aac 128k` | Stereo web-standard |
| Max resolution | `1080p` | Capped, preserves original if smaller |
| Faststart | `+faststart` | Enables playback before full download |

### PowerShell batch script
```powershell
$inDir  = "C:\tsp\Development\Website\website [month][year]\tsp\[project]\videos"
$outDir = "$inDir\compressed"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$files = Get-ChildItem -Path $inDir -Filter "*R.mp4"

foreach ($f in $files) {
    $outName = $f.Name -replace 'R\.mp4$', '.mp4'
    $output  = Join-Path $outDir $outName
    Write-Host "Compressing: $($f.Name) -> $outName"
    ffmpeg -y -i $f.FullName `
        -c:v libx264 -crf 26 -preset slow `
        -c:a aac -b:a 128k `
        -movflags +faststart `
        -vf "scale=-2:min(1080\,ih)" `
        $output
    Write-Host "Done: $outName"
}
Write-Host "All files compressed."
```

Output files land in `videos/compressed/` — **do not delete the originals (R files).**

---

## 🏗️ Architecture Notes

- **Shell + iframe**: `index.html` is a permanent shell. Subprojects load inside a full-screen `<iframe>`.
- **postMessage protocol**: Subprojects communicate with the shell via `window.postMessage`.
  - `tsp_autoplay_success` → shell hides splash, shows player
  - `tsp_track_update` → shell updates track title display
  - `tsp_state_update` → shell syncs play/pause & random button state
  - `tsp_command` → shell sends play/pause/next/prev/volume to subproject
- **sessionStorage**: `tsp_started` flag prevents re-showing the splash on navigation between subprojects.
- **Cloudflare R2**: **All media files (`.mp4`, `.mp3`, `.wav`) must be uploaded to R2** — do not rely on GitHub Pages to serve them. Set `BASE_VIDEO_URL` in each subproject's script to `https://pub-3ed2bcf66a6d49cf88d8802c420af955.r2.dev`. Upload with: `rclone copyto <file> r2:raglan-videos/<filename> --ignore-times --progress`

---

## 📅 Build History

| Build | Date | Key Changes |
|---|---|---|
| `website mar26` | March 2026 | Initial build: SDP + Thanks Gary, centralised player shell, Raglan logo splash |
| `website apr26` | April 2026 | Added Katherine subproject (6 videos, FFmpeg compressed). Katherine set as default landing page. |
