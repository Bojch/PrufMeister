# PrüfMeister

PrüfMeister is a small browser app for practicing a DTZ-style A2-B1 mock exam.

It includes original practice material for:

- Hören
- Lesen
- Schreiben
- Sprechen

## What changed in this update

- Added 6 full original **Lesen** practice versions.
- Added 6 full original **Hören** practice versions.
- Added local MP3 files for the Hören section.
- The **Generate Mock Test** button now rotates through different complete mock exam versions.
- Listening playback uses MP3 files first and falls back to browser speech synthesis if needed.

## Run locally

Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 5173
```

Then visit:

```text
http://localhost:5173
```

## Host with GitHub Pages

1. Push this project to GitHub.
2. Go to `Settings` → `Pages`.
3. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Save.

## Note

This app uses original practice tasks and synthetic audio generated for training/prototyping. It does not copy official exam papers.
