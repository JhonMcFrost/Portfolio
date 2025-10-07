# Portfolio (Static HTML)

This repository contains a static, responsive portfolio page built with HTML, Bootstrap 5, and a small custom stylesheet.

Files:
- `index.html` — Single-page portfolio (About, Skills, Projects, Contact).
- `styles.css` — Small custom styles for colors, chips, avatar, and hover effects.
- `images/IMG_5311.JPG` — Avatar image (not included). Place your avatar image at this path.
 - `data.json` — Profile data file used by `index.html` to populate content (name, title, skills, projects, contact).

How to view locally (Windows PowerShell):

1. Open PowerShell and change to the project directory:

```powershell
cd "C:\Users\Jhon Mcneil Magtibay\Desktop\Try\Portfolio"
```

2. Option A — Quick (works in most modern browsers):

```powershell
# Start a simple HTTP server if you have Python installed
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

2. Option B — Without Python (open file directly):

Double-click `index.html` in File Explorer or right-click → Open with → choose your browser.

Notes:
- The page uses Bootstrap from a CDN. For offline usage, download Bootstrap and update the links in `index.html`.
- Add your avatar image to `images/IMG_5311.JPG` (create the `images` folder if missing).
- The navbar links scroll smoothly to sections and collapse on mobile.
- The page fetches `data.json` with JavaScript. For fetch to work correctly most browsers require serving files over HTTP (not opening the file:// URL) — use the Python server above or any static server.

If you'd like, I can:
- Add more projects or make the cards link to live demos.
- Convert this into a small static-site template (partials, build scripts).
