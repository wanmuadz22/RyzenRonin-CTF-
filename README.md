# 🏯 Ryzen Ronin Dojo: Beginner Web Exploitation CTF

> Six gates. Six flags. One ronin.

A beginner-friendly **web exploitation** Capture The Flag challenge that runs entirely in your browser.
Each of the six levels teaches one classic web security lesson. Find all six flags in the format:

```
RyzenRonin{...}
```

## ▶️ Play it

**Live:** `https://<github-username>.github.io/<repo-name>/`
(For example, if this repo is `ronin/ryzenronin-dojo`, the dojo lives at `https://ronin.github.io/ryzenronin-dojo/`.)

1. Open the link above.
2. Pick a gate (level) and read the story.
3. Use your browser, its **View Source** (`Ctrl+U` / `Cmd+Option+U`), and its **Developer Tools** (`F12`) to find the flag.
4. Go back to the dojo home page and submit the flag in that level's box. Your progress is saved in your browser.

Every level has three unfoldable hints. There's no penalty for using them.

## 🗡️ The gates

| # | Gate | Skill you'll learn | Points |
|---|------|--------------------|--------|
| 1 | The Scroll of Source | Viewing page source & HTML comments | 50 |
| 2 | The Inspector's Eye | DevTools Elements panel, hidden elements, CSS files | 75 |
| 3 | Where Robots Fear to Tread | `robots.txt` reconnaissance | 100 |
| 4 | The Client-Side Gatekeeper | Reading JavaScript, Base64 decoding | 125 |
| 5 | The Shogun's Cookie | Viewing & editing cookies | 150 |
| 6 | The Sealed Gate | Tampering with disabled buttons & hidden form fields | 200 |
| | **Total** | | **700** |

## 🧰 What you need

- A desktop browser (Chrome, Edge, Firefox, Brave, or Safari with the Develop menu enabled).
- That's it. No installs, no accounts, no hacking tools.
- Optional: [CyberChef](https://gchq.github.io/CyberChef/) for decoding things.

## 📜 Rules

- Everything is client-side. There is **no server to attack**. Please don't attack GitHub or anyone else's infrastructure.
- Don't post flags publicly. Share the dojo link instead so others can enjoy the hunt.
- Yes, you *can* read this repository's source code on GitHub. That's basically the same as "View Source", which is part of the game. 😉 The flag checker only stores SHA-256 hashes, and the later flags are encoded, so you still have to actually solve the levels.

## 💻 Play locally (optional)

```bash
git clone https://github.com/<github-username>/<repo-name>.git
cd <repo-name>
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly from disk mostly works too, but cookies and `robots.txt` behave more realistically over HTTP.)

## 🛠️ Hosting your own copy (GitHub Pages)

1. Fork or push this repo to GitHub (it must be **public** on a free account).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
5. Wait about a minute and refresh. GitHub will show your live URL: `https://<github-username>.github.io/<repo-name>/`.

## 📁 Structure

```
index.html          ← the dojo hub + flag checker
assets/             ← shared styles and the hash-based flag checker
levels/             ← gates 1–6
robots.txt          ← 👀
.nojekyll           ← tells GitHub Pages to serve files as-is
```

Good luck, ronin. 🥷
