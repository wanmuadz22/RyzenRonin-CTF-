// Ryzen Ronin Dojo — flag checker.
// Only SHA-256 hashes of the flags live here, so reading this file won't give you any answers. Nice try though, ronin. 🥷

const LEVELS = [
  { id: 1, name: "The Scroll of Source",     skill: "View page source",        pts: 50,  href: "levels/level1.html",
    hash: "3bb4ecbb0195426ae6076e572cb50c464d1cc2ccfd6fe4e4f4d483c2e0f908c3" },
  { id: 2, name: "The Inspector's Eye",      skill: "DevTools: Elements & CSS", pts: 75,  href: "levels/level2.html",
    hash: "48bf3f235cbb28a1c9ab8f9028d2aebd81bef6963301603bcc1da4e5296cdd02" },
  { id: 3, name: "Where Robots Fear to Tread", skill: "robots.txt recon",      pts: 100, href: "levels/level3.html",
    hash: "2f66b0c7022a5f54de5010e033a984fbf7bfb5a4792a431c2e51c4858b456393" },
  { id: 4, name: "The Client-Side Gatekeeper", skill: "Reading JavaScript",    pts: 125, href: "levels/level4.html",
    hash: "a02500dd6e2a3ed0a728118bc683ef72443f408bf278b5c77bc1860c005950cc" },
  { id: 5, name: "The Shogun's Cookie",      skill: "Cookie tampering",        pts: 150, href: "levels/level5.html",
    hash: "ffbcbf3d743d38a38c34f67da34d749d339b48c829a7e02ffb89a107fcd7d66d" },
  { id: 6, name: "The Sealed Gate",          skill: "Form & hidden-field tampering", pts: 200, href: "levels/level6.html",
    hash: "5093a090bd76b8357c0a48932497bfb59176b859d442172a6582281ffeda722a" },
];

const STORE_KEY = "ryzenronin-dojo-solved";

function loadSolved() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
}
function saveSolved(list) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: progress just won't persist */ }
}

// SHA-256: use Web Crypto when available (HTTPS / localhost), fall back to a small pure-JS version (e.g. file://).
async function sha256Hex(text) {
  if (window.crypto && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) { /* fall through */ }
  }
  return sha256Fallback(text);
}

function sha256Fallback(ascii) {
  const K = [], H = [];
  let n = 2, found = 0;
  const isPrime = x => { for (let f = 2; f * f <= x; f++) if (x % f === 0) return false; return true; };
  const frac = x => ((x - Math.floor(x)) * 4294967296) | 0;
  while (found < 64) {
    if (isPrime(n)) { if (found < 8) H[found] = frac(Math.pow(n, 1 / 2)); K[found++] = frac(Math.pow(n, 1 / 3)); }
    n++;
  }
  const bytes = Array.from(new TextEncoder().encode(ascii));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
  const rotr = (x, r) => (x >>> r) | (x << (32 - r));
  for (let off = 0; off < bytes.length; off += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
  }
  return H.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

function renderDojo() {
  const grid = document.getElementById("levels");
  if (!grid) return;
  const solved = loadSolved();
  grid.innerHTML = "";

  LEVELS.forEach(lv => {
    const done = solved.includes(lv.id);
    const card = document.createElement("div");
    card.className = "card level" + (done ? " solved" : "");
    card.innerHTML = `
      <div class="meta"><span>LEVEL ${lv.id}</span><span>${lv.pts} pts</span></div>
      <h3>${lv.name}</h3>
      <div class="mono" style="font-size:12px;color:var(--muted)">Skill: ${lv.skill}</div>
      <a class="btn ghost" href="${lv.href}">Enter level →</a>
      <div class="row">
        <input type="text" placeholder="RyzenRonin{...}" aria-label="Flag for level ${lv.id}" ${done ? "disabled" : ""}>
        <button class="btn" ${done ? "disabled" : ""}>Submit</button>
      </div>
      <div class="status">${done ? "✔ Solved" : ""}</div>`;
    const input = card.querySelector("input");
    const btn = card.querySelector("button");
    const status = card.querySelector(".status");
    const submit = async () => {
      const guess = input.value.trim();
      if (!/^RyzenRonin\{.+\}$/.test(guess)) {
        status.className = "status bad";
        status.textContent = "Flag format is RyzenRonin{...}";
        return;
      }
      if ((await sha256Hex(guess)) === lv.hash) {
        const list = loadSolved();
        if (!list.includes(lv.id)) list.push(lv.id);
        saveSolved(list);
        renderDojo();
      } else {
        status.className = "status bad";
        status.textContent = "✘ Not quite. Keep hunting.";
      }
    };
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
    grid.appendChild(card);
  });

  const total = LEVELS.reduce((s, l) => s + l.pts, 0);
  const earned = LEVELS.filter(l => solved.includes(l.id)).reduce((s, l) => s + l.pts, 0);
  document.getElementById("score").textContent = `${earned} / ${total} pts · ${solved.length} / ${LEVELS.length} flags`;
  document.getElementById("bar").style.width = (earned / total * 100) + "%";
  document.getElementById("complete").hidden = solved.length !== LEVELS.length;
}

function resetProgress() {
  if (confirm("Wipe your dojo progress?")) { saveSolved([]); renderDojo(); }
}

document.addEventListener("DOMContentLoaded", renderDojo);
