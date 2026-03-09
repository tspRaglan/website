# video player template

this is a reusable template for a 5-video full-screen player with seamless transitions, randomized playback, and session-aware "click to start" logic.

## setup instructions

1.  **videos**: place your 5 video files in a `videos/` directory relative to `index.html`.
2.  **config**: open `script.js` and update the `playlist` array with your filenames and titles.
3.  **redirects**: update the `redirectTargets` array in `script.js` to point to the next project or page.
4.  **styling**: customize `styles.css` for your theme (currently uses glassmorphism and courier new).

## bandwidth & compression

**critical**: to stay within hosting limits (e.g. netlify's 100gb), all videos **must** be compressed before upload.

### recommended ffmpeg command
run this from your terminal to squash video size while keeping quality:

```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset faster -acodec aac -b:a 128k output.mp4
```

- **crf 28**: provides a good balance of quality vs file size.
- **aac 128k**: standard audio compression for web.

## features

- **seamless transitions**: uses dual video tags to preload the next track.
- **session persistent**: syncs with the root "click to start" interaction using `sessionStorage`.
- **premium ui**: glassmorphic controls with volume, random, and navigation.
- **lowercase aesthetic**: all user-facing text is standardized to lowercase.
