/**
 * QONNEK UI Sound System — Web Audio API synth.
 * Zero dependencies, no audio files. All sounds are generated procedurally.
 * Sounds are short, calm, and institutional — not game-like.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Check if user prefers reduced motion — we respect that for sound too */
function prefersQuiet(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ── Primitives ─────────────────────────────────────���────────

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08,
  rampDown = true,
) {
  if (prefersQuiet()) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    }
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {
    // Silently fail — sound is non-critical
  }
}

// ── Public API ──────────────────────────────────────────────

/** Subtle tap/click — short high blip */
export function playClick() {
  playTone(880, 0.06, "sine", 0.05);
}

/** Soft nav transition — gentle mid tone */
export function playNav() {
  playTone(660, 0.08, "sine", 0.04);
}

/** Success chime — two ascending notes (confirmation) */
export function playSuccess() {
  if (prefersQuiet()) return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;

    // Note 1 — E5
    const osc1 = ac.createOscillator();
    const g1 = ac.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 659;
    g1.gain.value = 0.07;
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(g1).connect(ac.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Note 2 — G5 (delayed 100ms)
    const osc2 = ac.createOscillator();
    const g2 = ac.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 784;
    g2.gain.value = 0.07;
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(g2).connect(ac.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.35);
  } catch {
    // silent
  }
}

/** Soft error/warning — single low tone */
export function playError() {
  playTone(330, 0.15, "triangle", 0.06);
}

/** Payout chime — three quick ascending notes (coin-like) */
export function playPayout() {
  if (prefersQuiet()) return;
  try {
    const ac = getCtx();
    const now = ac.currentTime;
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.value = 0.05;
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
      osc.connect(g).connect(ac.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  } catch {
    // silent
  }
}
