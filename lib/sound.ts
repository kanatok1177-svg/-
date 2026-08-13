/**
 * Web Audio API を使った効果音合成。
 * 外部音声ファイルを一切使わず、サイン波の組み合わせだけで
 * 「開始音」「カウントダウンのティック音」「達成ファンファーレ」を鳴らす。
 */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

interface ToneOptions {
  frequency: number;
  startTime: number;
  duration: number;
  volume?: number;
  type?: OscillatorType;
}

function scheduleTone(ctx: AudioContext, opts: ToneOptions): void {
  const { frequency, startTime, duration, volume = 0.2, type = "sine" } = opts;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  // クリック音を防ぐためのなだらかなエンベロープ
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/** 集中モード開始時の短いスタート音 */
export function playStartTone(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  scheduleTone(ctx, { frequency: 440, startTime: now, duration: 0.18, volume: 0.15 });
  scheduleTone(ctx, { frequency: 660, startTime: now + 0.12, duration: 0.22, volume: 0.15 });
}

/** カウントダウンの残り秒数を刻む、控えめなティック音 */
export function playTick(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  scheduleTone(ctx, { frequency: 880, startTime: now, duration: 0.06, volume: 0.08, type: "sine" });
}

/** 1分達成時の、気持ちの良いファンファーレ風サウンド */
export function playFanfare(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // 上昇するアルペジオ（ド・ミ・ソ・高いド）
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    scheduleTone(ctx, {
      frequency: freq,
      startTime: now + i * 0.11,
      duration: 0.5,
      volume: 0.18,
      type: "triangle",
    });
  });

  // 最後にきらめく和音を重ねる
  const chordStart = now + notes.length * 0.11 + 0.05;
  [1046.5, 1318.5, 1568].forEach((freq) => {
    scheduleTone(ctx, {
      frequency: freq,
      startTime: chordStart,
      duration: 0.9,
      volume: 0.12,
      type: "sine",
    });
  });
}

/** iOS Safari 等で AudioContext をユーザー操作のタイミングで確実に有効化する */
export function primeAudio(): void {
  getContext();
}
