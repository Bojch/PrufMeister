# PrüfMeister

PrüfMeister is a small browser app for practicing a DTZ-style A2-B1 mock exam.

It includes original practice material for:

- Hören
- Lesen
- Schreiben
- Sprechen

The app is built as a static site with plain HTML, CSS, and JavaScript, so it can be hosted directly with GitHub Pages.

## Run Locally

Open `index.html` in a browser, or run a simple local server:

```bash
python3 -m http.server 5173
```

Then visit:

```text
http://localhost:5173
```

## Host With GitHub Pages

1. Create a new GitHub repository.
2. Push this project to the repository.
3. In GitHub, go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save.

GitHub will publish the app at a URL like:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

## Note

This app uses original practice tasks and realistic topic photos for training. It does not copy official exam papers.
