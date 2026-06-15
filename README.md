import { useState, useEffect, useRef } from "react";

// ========== STORAGE HELPERS ==========
const STORAGE_KEY = "badminton_tool_data";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const defaultData = {
  profile: null,
  records: [],
  currentPractice: null,
};

// ========== ICONS ==========
const Icons = {
  home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  user: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  record: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  coach: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  question: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
};

// ========== SHUTTLE LOGO ==========
function ShuttleLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="46" r="10" fill="#00E5A0" opacity="0.15"/>
      <circle cx="32" cy="46" r="6" fill="#00E5A0" opacity="0.4"/>
      <circle cx="32" cy="46" r="3" fill="#00E5A0"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + Math.sin(rad) * 8;
        const y1 = 46 - Math.cos(rad) * 8;
        const x2 = 32 + Math.sin(rad) * 22;
        const y2 = 46 - Math.cos(rad) * 22 - 12;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00E5A0" strokeWidth="1.5" opacity="0.6"/>;
      })}
      <ellipse cx="32" cy="18" rx="20" ry="8" fill="none" stroke="#00E5A0" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

// ========== STYLES ==========
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { 
    background: #0D1B2A; 
    color: #E8F4F8; 
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #0D1B2A;
  }

  .screen {
    flex: 1;
    padding: 0 0 80px 0;
    overflow-y: auto;
  }

  /* NAV */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: #0A1520;
    border-top: 1px solid #1E3048;
    display: flex;
    z-index: 100;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 14px;
    gap: 4px;
    cursor: pointer;
    background: none;
    border: none;
    color: #4A6A8A;
    font-size: 10px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: color 0.2s;
  }

  .nav-item.active {
    color: #00E5A0;
  }

  /* HEADER */
  .header {
    padding: 52px 20px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #E8F4F8;
  }

  .help-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1.5px solid #2A4560;
    background: none;
    color: #7AB0D0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .help-btn:hover { border-color: #00E5A0; color: #00E5A0; }

  /* CARD */
  .card {
    background: #112030;
    border: 1px solid #1E3048;
    border-radius: 16px;
    padding: 18px 20px;
    margin: 0 16px 12px;
  }

  .card-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #00E5A0;
    margin-bottom: 8px;
  }

  /* BUTTONS */
  .btn-primary {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    border: none;
    background: #00E5A0;
    color: #0D1B2A;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-secondary {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 1.5px solid #1E3048;
    background: transparent;
    color: #7AB0D0;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: #00E5A0; color: #00E5A0; }

  /* INPUTS */
  .input-group { margin-bottom: 14px; }
  .input-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    color: #4A6A8A;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }
  .input-field {
    width: 100%;
    background: #0A1520;
    border: 1.5px solid #1E3048;
    border-radius: 10px;
    padding: 12px 14px;
    color: #E8F4F8;
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: #00E5A0; }
  .input-field::placeholder { color: #2A4560; }

  select.input-field {
    appearance: none;
    cursor: pointer;
  }

  /* CHIP SELECT */
  .chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
    padding: 7px 14px;
    border-radius: 20px;
    border: 1.5px solid #1E3048;
    background: transparent;
    color: #7AB0D0;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .chip.selected {
    border-color: #00E5A0;
    background: rgba(0,229,160,0.12);
    color: #00E5A0;
  }

  /* PRACTICE ITEM */
  .practice-item {
    padding: 14px 0;
    border-bottom: 1px solid #1A2E42;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .practice-item:last-child { border-bottom: none; }
  .practice-num {
    min-width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(0,229,160,0.12);
    color: #00E5A0;
    font-size: 12px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
  }
  .practice-info { flex: 1; }
  .practice-name { font-size: 14px; font-weight: 600; color: #E8F4F8; margin-bottom: 2px; }
  .practice-detail { font-size: 12px; color: #4A6A8A; }
  .practice-tag {
    font-size: 10px; font-weight: 600;
    padding: 3px 8px; border-radius: 6px;
    background: rgba(0,229,160,0.1);
    color: #00E5A0;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* STATS ROW */
  .stats-row { display: flex; gap: 10px; margin: 0 16px 12px; }
  .stat-card {
    flex: 1; background: #112030; border: 1px solid #1E3048;
    border-radius: 14px; padding: 14px; text-align: center;
  }
  .stat-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 26px; font-weight: 700; color: #00E5A0;
    line-height: 1;
  }
  .stat-unit { font-size: 10px; color: #4A6A8A; margin-top: 4px; }

  /* RECORD ENTRY */
  .record-entry {
    background: #112030; border: 1px solid #1E3048;
    border-radius: 14px; padding: 14px 16px;
    margin: 0 16px 10px;
  }
  .record-date {
    font-size: 11px; color: #4A6A8A; font-weight: 600;
    letter-spacing: 0.5px; margin-bottom: 8px;
  }
  .record-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-top: 6px;
  }
  .record-label { font-size: 12px; color: #7AB0D0; }
  .record-val { font-size: 13px; font-weight: 600; color: #E8F4F8; }

  /* BADGE */
  .badge {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 3px 9px; border-radius: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
  }
  .badge-green { background: rgba(0,229,160,0.15); color: #00E5A0; }
  .badge-blue { background: rgba(100,180,255,0.12); color: #64B4FF; }
  .badge-yellow { background: rgba(255,200,60,0.12); color: #FFC83C; }
  .badge-red { background: rgba(255,80,80,0.12); color: #FF5050; }

  /* CHAT */
  .chat-area {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chat-bubble {
    max-width: 85%;
    padding: 12px 15px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  .chat-bubble.user {
    align-self: flex-end;
    background: rgba(0,229,160,0.15);
    color: #E8F4F8;
    border-bottom-right-radius: 4px;
  }
  .chat-bubble.ai {
    align-self: flex-start;
    background: #112030;
    border: 1px solid #1E3048;
    color: #E8F4F8;
    border-bottom-left-radius: 4px;
  }
  .chat-input-area {
    position: fixed;
    bottom: 64px;
    left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    padding: 10px 16px;
    background: #0A1520;
    border-top: 1px solid #1E3048;
    display: flex; gap: 10px;
  }
  .chat-input {
    flex: 1;
    background: #112030;
    border: 1.5px solid #1E3048;
    border-radius: 10px;
    padding: 11px 14px;
    color: #E8F4F8;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    resize: none;
    height: 44px;
  }
  .chat-input:focus { border-color: #00E5A0; }
  .send-btn {
    width: 44px; height: 44px;
    border-radius: 10px;
    border: none;
    background: #00E5A0;
    color: #0D1B2A;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: opacity 0.2s;
  }
  .send-btn:disabled { opacity: 0.4; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  .modal {
    background: #112030;
    border: 1px solid #1E3048;
    border-radius: 20px;
    padding: 24px;
    width: 100%; max-width: 380px;
  }
  .modal-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px; font-weight: 700;
    margin-bottom: 12px; color: #E8F4F8;
  }
  .modal-body { font-size: 14px; color: #7AB0D0; line-height: 1.6; }
  .modal-close {
    width: 100%; margin-top: 20px;
    padding: 12px;
    border-radius: 10px; border: 1.5px solid #1E3048;
    background: transparent; color: #7AB0D0;
    font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
  }

  /* DIVIDER */
  .section-divider {
    height: 1px; background: #1E3048;
    margin: 4px 16px 16px;
  }

  /* LOADING */
  .loading-dots span {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00E5A0;
    margin: 0 2px;
    animation: bounce 1.2s infinite;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%,80%,100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-6px); opacity: 1; }
  }

  .empty-state {
    text-align: center; padding: 48px 20px;
    color: #2A4560;
  }
  .empty-state svg { margin-bottom: 12px; opacity: 0.4; }
  .empty-state p { font-size: 14px; line-height: 1.6; }

  .progress-bar {
    height: 6px; background: #0A1520; border-radius: 3px; overflow: hidden;
    margin-top: 6px;
  }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, #00E5A0, #00B8FF);
    transition: width 0.5s;
  }

  .home-hero {
    padding: 32px 20px 24px;
    text-align: center;
  }
  .home-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 28px; font-weight: 700;
    color: #E8F4F8; margin-top: 16px; margin-bottom: 6px;
  }
  .home-sub { font-size: 13px; color: #4A6A8A; }

  .home-btns { padding: 0 16px; display: flex; flex-direction: column; gap: 10px; }

  .analyze-card {
    background: linear-gradient(135deg, #0E2335 0%, #112030 100%);
    border: 1px solid #1E3048; border-radius: 16px;
    padding: 18px 20px; margin: 0 16px 12px;
  }
  .analyze-insight {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #1A2E42;
  }
  .analyze-insight:last-child { border-bottom: none; }
  .analyze-icon {
    font-size: 20px; min-width: 32px; text-align: center;
    padding-top: 2px;
  }
  .analyze-text { font-size: 13px; color: #C0D8E8; line-height: 1.5; }
  .analyze-text strong { color: #00E5A0; font-weight: 600; }
`;

// ========== API CALL ==========
async function callClaude(messages, systemPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(b => b.text || "").join("");
}

// ========== SCREENS ==========

// HOME
function HomeScreen({ profile, onNavigate }) {
  const [showHelp, setShowHelp] = useState(false);
  const hasProfile = !!profile;

  return (
    <div className="screen">
      <style>{css}</style>
      <div className="header">
        <span />
        <button className="help-btn" onClick={() => setShowHelp(true)}>
          <Icons.question />
        </button>
      </div>

      <div className="home-hero">
        <ShuttleLogo size={72} />
        <div className="home-title">BadmintonPro</div>
        <div className="home-sub">AIコーチによるパーソナル練習管理</div>
      </div>

      <div className="home-btns">
        <button
          className="btn-primary"
          disabled={!hasProfile}
          onClick={() => onNavigate("practice")}
        >
          🏸　今日の練習を始める
        </button>
        {!hasProfile && (
          <div style={{ textAlign: "center", fontSize: 12, color: "#4A6A8A", marginTop: -4 }}>
            ※ プロフィールを設定すると解放されます
          </div>
        )}
        <button className="btn-secondary" onClick={() => onNavigate("profile")}>
          👤　プロフィール設定
        </button>
        <button className="btn-secondary" onClick={() => onNavigate("record")}>
          📋　練習記録を見る
        </button>
        <button className="btn-secondary" onClick={() => onNavigate("analysis")}>
          📊　成長分析
        </button>
        <button className="btn-secondary" onClick={() => onNavigate("coach")}>
          💬　バドミントンコーチング
        </button>
      </div>

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🏸 BadmintonProとは？</div>
            <div className="modal-body">
              <p>AIがあなたのプロフィールに合わせた<br/>最適な練習メニューを毎回提案します。</p>
              <br/>
              <p><strong style={{color:"#00E5A0"}}>① 練習</strong>　AIが柔軟・体幹・筋トレを含む個別メニューを生成</p>
              <br/>
              <p><strong style={{color:"#00E5A0"}}>② プロフィール</strong>　身長・体重・目標などを設定</p>
              <br/>
              <p><strong style={{color:"#00E5A0"}}>③ 記録</strong>　練習後のキツさ・感想を記録</p>
              <br/>
              <p><strong style={{color:"#00E5A0"}}>④ 分析</strong>　蓄積データをAIが分析して成長を可視化</p>
              <br/>
              <p><strong style={{color:"#00E5A0"}}>⑤ コーチング</strong>　疑問・悩みをAIコーチに相談</p>
            </div>
            <button className="modal-close" onClick={() => setShowHelp(false)}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}

// PROFILE
function ProfileScreen({ profile, onSave }) {
  const [form, setForm] = useState(profile || {
    name: "", age: "", height: "", weight: "",
    level: "初中級", duration: "45", goal: "体力向上",
    weakPoints: [], days: [],
  });
  const [saved, setSaved] = useState(false);

  const levelOptions = ["初心者", "初中級", "中級", "上級", "競技"];
  const durationOptions = ["30", "45", "60", "90", "120"];
  const goalOptions = ["体力向上", "フットワーク強化", "スマッシュ強化", "試合に勝つ", "ダイエット", "健康維持"];
  const weakOptions = ["フットワーク", "サーブ", "スマッシュ", "ドロップ", "ネットプレー", "持久力", "体幹"];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, v) => setForm(f => ({
    ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]
  }));

  const isValid = form.name && form.age && form.height && form.weight;

  const handleSave = () => {
    if (!isValid) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="screen">
      <div className="header">
        <span className="header-title">プロフィール</span>
      </div>

      <div className="card">
        <div className="card-label">基本情報</div>
        <div className="input-group">
          <label className="input-label">ニックネーム</label>
          <input className="input-field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="例：バドP太郎" />
        </div>
        <div style={{display:"flex",gap:10}}>
          <div className="input-group" style={{flex:1}}>
            <label className="input-label">年齢</label>
            <input className="input-field" type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="25" />
          </div>
          <div className="input-group" style={{flex:1}}>
            <label className="input-label">身長 (cm)</label>
            <input className="input-field" type="number" value={form.height} onChange={e => set("height", e.target.value)} placeholder="170" />
          </div>
          <div className="input-group" style={{flex:1}}>
            <label className="input-label">体重 (kg)</label>
            <input className="input-field" type="number" value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="65" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-label">練習設定</div>
        <div className="input-group">
          <label className="input-label">レベル</label>
          <div className="chip-group">
            {levelOptions.map(l => (
              <button key={l} className={`chip${form.level===l?" selected":""}`} onClick={() => set("level", l)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">練習時間 (分)</label>
          <div className="chip-group">
            {durationOptions.map(d => (
              <button key={d} className={`chip${form.duration===d?" selected":""}`} onClick={() => set("duration", d)}>{d}分</button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">主な目標</label>
          <div className="chip-group">
            {goalOptions.map(g => (
              <button key={g} className={`chip${form.goal===g?" selected":""}`} onClick={() => set("goal", g)}>{g}</button>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">強化したい弱点（複数可）</label>
          <div className="chip-group">
            {weakOptions.map(w => (
              <button key={w} className={`chip${form.weakPoints.includes(w)?" selected":""}`} onClick={() => toggleArr("weakPoints", w)}>{w}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"0 16px 16px"}}>
        <button className="btn-primary" disabled={!isValid} onClick={handleSave}>
          {saved ? "✓ 保存しました！" : "プロフィールを保存"}
        </button>
      </div>
    </div>
  );
}

// PRACTICE
function PracticeScreen({ profile, onSaveRecord }) {
  const [step, setStep] = useState("generate");
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logData, setLogData] = useState({ hardness: 3, timeFeeling: "ちょうど良い", memo: "" });
  const [logSaved, setLogSaved] = useState(false);

  const generatePractice = async () => {
    setLoading(true);
    try {
      const system = `あなたはバドミントンの専門コーチです。
ユーザーのプロフィールに基づき、${profile.duration}分の練習メニューを作成してください。
必ず「柔軟」「体幹」「筋トレ」「バドミントン技術練習」をバランスよく含めてください。
JSONのみ返してください（前置き・コードブロック不要）。
形式:
{
  "greeting": "短い挨拶と今日の練習のポイント（2文以内）",
  "items": [
    {"name":"種目名","detail":"やり方の説明","duration":"時間/回数","category":"柔軟|体幹|筋トレ|技術|フットワーク"},
    ...
  ],
  "tip": "今日のワンポイントアドバイス"
}`;
      const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);
      const userMsg = `名前:${profile.name}, 年齢:${profile.age}歳, 身長:${profile.height}cm, 体重:${profile.weight}kg(BMI:${bmi}), レベル:${profile.level}, 目標:${profile.goal}, 弱点:${profile.weakPoints.join("・")}, 練習時間:${profile.duration}分`;
      const res = await callClaude([{ role: "user", content: userMsg }], system);
      const clean = res.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPractice(parsed);
      setStep("doing");
    } catch (e) {
      alert("メニュー生成に失敗しました。もう一度お試しください。");
    }
    setLoading(false);
  };

  const handleLog = () => {
    onSaveRecord({
      date: new Date().toLocaleDateString("ja-JP"),
      timestamp: Date.now(),
      hardness: logData.hardness,
      timeFeeling: logData.timeFeeling,
      memo: logData.memo,
      practiceItems: practice?.items?.length || 0,
    });
    setLogSaved(true);
    setTimeout(() => { setStep("generate"); setPractice(null); setLogSaved(false); }, 1500);
  };

  const categoryColor = { "柔軟": "#64B4FF", "体幹": "#FF9F40", "筋トレ": "#FF6B6B", "技術": "#00E5A0", "フットワーク": "#C984FF" };

  if (step === "generate") return (
    <div className="screen">
      <div className="header"><span className="header-title">今日の練習</span></div>
      <div style={{ padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <ShuttleLogo size={80} />
          <div style={{ marginTop: 16, fontSize: 16, color: "#7AB0D0", lineHeight: 1.6 }}>
            {profile.name}さんの<br />
            <span style={{ color: "#00E5A0", fontWeight: 700 }}>{profile.duration}分</span> パーソナルメニューを<br />AIが生成します
          </div>
        </div>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-label">今日の設定</div>
          <div style={{ fontSize: 13, color: "#7AB0D0", lineHeight: 2 }}>
            🎯 目標：{profile.goal}<br />
            💪 弱点強化：{profile.weakPoints.join("・") || "なし"}<br />
            ⏱ 時間：{profile.duration}分<br />
            📊 レベル：{profile.level}
          </div>
        </div>
        <button className="btn-primary" onClick={generatePractice} disabled={loading}>
          {loading ? "メニュー生成中..." : "🤖 AIメニューを生成"}
        </button>
        {loading && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
      </div>
    </div>
  );

  if (step === "doing") return (
    <div className="screen">
      <div className="header">
        <button onClick={() => setStep("generate")} style={{ background: "none", border: "none", color: "#7AB0D0", cursor: "pointer", display: "flex" }}><Icons.back /></button>
        <span className="header-title">今日のメニュー</span>
        <span />
      </div>
      {practice.greeting && (
        <div className="card" style={{ background: "linear-gradient(135deg,#0E2A1E,#112030)" }}>
          <div style={{ fontSize: 13, color: "#C0D8E8", lineHeight: 1.6 }}>💬 {practice.greeting}</div>
        </div>
      )}
      <div className="card">
        <div className="card-label">練習メニュー</div>
        {practice.items.map((item, i) => (
          <div key={i} className="practice-item">
            <div className="practice-num">{i + 1}</div>
            <div className="practice-info">
              <div className="practice-name">{item.name}</div>
              <div className="practice-detail">{item.detail}</div>
            </div>
            <div>
              <div className="practice-tag" style={{ background: `${categoryColor[item.category] || "#00E5A0"}18`, color: categoryColor[item.category] || "#00E5A0", marginBottom: 4 }}>{item.category}</div>
              <div style={{ fontSize: 11, color: "#4A6A8A", textAlign: "right" }}>{item.duration}</div>
            </div>
          </div>
        ))}
      </div>
      {practice.tip && (
        <div className="card" style={{ borderColor: "#00E5A040" }}>
          <div className="card-label">ワンポイント</div>
          <div style={{ fontSize: 13, color: "#C0D8E8" }}>⚡ {practice.tip}</div>
        </div>
      )}
      <div style={{ padding: "0 16px 16px" }}>
        <button className="btn-primary" onClick={() => setStep("log")}>✅ 練習完了！記録する</button>
      </div>
    </div>
  );

  if (step === "log") return (
    <div className="screen">
      <div className="header"><span className="header-title">練習を記録</span></div>
      <div className="card">
        <div className="card-label">キツさ</div>
        <div className="chip-group">
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`chip${logData.hardness===n?" selected":""}`}
              onClick={() => setLogData(d => ({...d,hardness:n}))}>
              {"⚡".repeat(n)} {["余裕","少しキツ","ちょうど","キツい","限界"][n-1]}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-label">時間の感じ方</div>
        <div className="chip-group">
          {["短すぎ","ちょうど良い","少し長い","長すぎ"].map(t => (
            <button key={t} className={`chip${logData.timeFeeling===t?" selected":""}`}
              onClick={() => setLogData(d => ({...d,timeFeeling:t}))}>{t}</button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-label">今日のメモ（任意）</div>
        <textarea className="input-field" style={{height:80,resize:"none"}}
          value={logData.memo} onChange={e => setLogData(d => ({...d,memo:e.target.value}))}
          placeholder="感じたこと、気づき、次回の目標など..." />
      </div>
      <div style={{padding:"0 16px 16px"}}>
        <button className="btn-primary" onClick={handleLog}>
          {logSaved ? "✓ 保存しました！" : "記録を保存"}
        </button>
      </div>
    </div>
  );
}

// RECORDS
function RecordScreen({ records }) {
  const hardnessLabel = ["","余裕","少しキツ","ちょうど","キツい","限界"];
  const hardnessBadge = [null,"badge-blue","badge-blue","badge-green","badge-yellow","badge-red"];

  if (!records.length) return (
    <div className="screen">
      <div className="header"><span className="header-title">練習記録</span></div>
      <div className="empty-state">
        <Icons.record />
        <p>まだ記録がありません。<br />練習を完了すると自動で記録されます。</p>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="header"><span className="header-title">練習記録</span></div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val">{records.length}</div>
          <div className="stat-unit">総練習回数</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{(records.reduce((s,r)=>s+r.hardness,0)/records.length).toFixed(1)}</div>
          <div className="stat-unit">平均キツさ</div>
        </div>
      </div>
      {[...records].reverse().map((r, i) => (
        <div key={i} className="record-entry">
          <div className="record-date">📅 {r.date}</div>
          <div className="record-row">
            <span className="record-label">キツさ</span>
            <span className={`badge ${hardnessBadge[r.hardness]}`}>{hardnessLabel[r.hardness]}</span>
          </div>
          <div className="record-row">
            <span className="record-label">時間感覚</span>
            <span className="record-val">{r.timeFeeling}</span>
          </div>
          {r.memo && <div style={{marginTop:8,fontSize:12,color:"#4A6A8A",borderTop:"1px solid #1A2E42",paddingTop:8}}>💭 {r.memo}</div>}
        </div>
      ))}
    </div>
  );
}

// ANALYSIS
function AnalysisScreen({ records, profile }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (records.length < 2) return;
    setLoading(true);
    try {
      const system = `あなたはバドミントンのデータ分析コーチです。
練習記録を分析し、選手の成長・改善点をJSONで返してください。
JSONのみ返してください（前置き・コードブロック不要）。
形式:
{
  "summary": "全体の一言評価",
  "insights": [
    {"icon":"絵文字","title":"タイトル","text":"詳細な分析（1〜2文）"},
    ...3〜5件
  ],
  "trend": "最近の傾向（1文）",
  "nextGoal": "次の練習への提案（1文）"
}`;
      const recordStr = records.map(r => `${r.date}:キツさ${r.hardness}/5,時間感覚:${r.timeFeeling},メモ:${r.memo||"なし"}`).join("\n");
      const msg = `選手:${profile.name}(${profile.level}), 目標:${profile.goal}\n記録:\n${recordStr}`;
      const res = await callClaude([{role:"user",content:msg}], system);
      const clean = res.replace(/```json|```/g,"").trim();
      setAnalysis(JSON.parse(clean));
    } catch { alert("分析に失敗しました。"); }
    setLoading(false);
  };

  if (!records.length) return (
    <div className="screen">
      <div className="header"><span className="header-title">成長分析</span></div>
      <div className="empty-state">
        <Icons.chart />
        <p>練習記録が2件以上溜まると<br />AIが成長を分析します！</p>
      </div>
    </div>
  );

  const avg = records.reduce((s,r)=>s+r.hardness,0)/records.length;
  const recent = records.slice(-3);
  const recentAvg = recent.reduce((s,r)=>s+r.hardness,0)/recent.length;

  return (
    <div className="screen">
      <div className="header"><span className="header-title">成長分析</span></div>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val">{records.length}</div>
          <div className="stat-unit">練習回数</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{avg.toFixed(1)}</div>
          <div className="stat-unit">平均強度</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{color: recentAvg >= avg ? "#FF6B6B" : "#00E5A0"}}>
            {recentAvg > avg ? "↑" : recentAvg < avg ? "↓" : "→"}
          </div>
          <div className="stat-unit">最近のトレンド</div>
        </div>
      </div>

      <div style={{padding:"0 16px 12px"}}>
        <div style={{fontSize:11,color:"#4A6A8A",marginBottom:6,fontWeight:600,letterSpacing:"0.5px"}}>直近のキツさ推移</div>
        <div style={{background:"#112030",borderRadius:12,padding:"12px 14px",border:"1px solid #1E3048"}}>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:50}}>
            {records.slice(-7).map((r,i) => (
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:"100%",borderRadius:4,background:r.hardness>=4?"#FF6B6B":r.hardness>=3?"#FFC83C":"#00E5A0",height:`${r.hardness*20}%`,minHeight:4,transition:"height 0.3s"}} />
                <div style={{fontSize:9,color:"#2A4560"}}>{r.date.slice(-5)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {records.length >= 2 && !analysis && !loading && (
        <div style={{padding:"0 16px 12px"}}>
          <button className="btn-primary" onClick={runAnalysis}>🤖 AIで詳細分析する</button>
        </div>
      )}
      {loading && <div style={{textAlign:"center",padding:20}}><div className="loading-dots"><span/><span/><span/></div><div style={{fontSize:12,color:"#4A6A8A",marginTop:8}}>AIが分析中...</div></div>}
      {analysis && (
        <>
          <div className="card" style={{background:"linear-gradient(135deg,#0E2A1E,#112030)",borderColor:"#00E5A040"}}>
            <div className="card-label">AIの総合評価</div>
            <div style={{fontSize:14,color:"#C0D8E8",lineHeight:1.6}}>🏆 {analysis.summary}</div>
          </div>
          <div className="card">
            <div className="card-label">成長インサイト</div>
            {analysis.insights.map((ins,i) => (
              <div key={i} className="analyze-insight">
                <div className="analyze-icon">{ins.icon}</div>
                <div className="analyze-text"><strong>{ins.title}</strong><br/>{ins.text}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-label">最近のトレンド</div>
            <div style={{fontSize:13,color:"#C0D8E8"}}>📈 {analysis.trend}</div>
          </div>
          <div className="card" style={{borderColor:"#00E5A040"}}>
            <div className="card-label">次の練習へ向けて</div>
            <div style={{fontSize:13,color:"#C0D8E8"}}>🎯 {analysis.nextGoal}</div>
          </div>
        </>
      )}
    </div>
  );
}

// COACH
function CoachScreen({ profile }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: `こんにちは！バドミントンコーチのAIです🏸\n${profile ? profile.name + "さん、" : ""}何でも聞いてください！技術のこと、戦術のこと、フィジカルのことなど気軽に相談してね。` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "ai" || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const system = `あなたはバドミントンの専門コーチAIです。${profile ? `選手情報: ${profile.name}(${profile.level}, 目標:${profile.goal})` : ""}
技術・戦術・フィジカル・メンタルなど幅広くサポートしてください。
返答は200字以内で簡潔に、実践的なアドバイスを日本語で。`;
      const res = await callClaude([...history, {role:"user",content:userMsg}], system);
      setMessages(m => [...m, { role: "ai", text: res }]);
    } catch { setMessages(m => [...m, { role: "ai", text: "すみません、エラーが発生しました。もう一度試してみてください。" }]); }
    setLoading(false);
  };

  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="screen" style={{ paddingBottom: 120 }}>
      <div className="header"><span className="header-title">AIコーチング</span></div>
      <div className="chat-area">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`} style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
        ))}
        {loading && (
          <div className="chat-bubble ai">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <textarea className="chat-input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} placeholder="バドミントンについて何でも聞いてね..." rows={1} />
        <button className="send-btn" onClick={send} disabled={!input.trim() || loading}><Icons.send /></button>
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
export default function App() {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(() => loadData() || defaultData);

  const updateData = (patch) => {
    setData(d => {
      const next = { ...d, ...patch };
      saveData(next);
      return next;
    });
  };

  const saveProfile = (profile) => {
    updateData({ profile });
    setTab("home");
  };

  const saveRecord = (record) => {
    updateData({ records: [...data.records, record] });
    setTab("record");
  };

  const navItems = [
    { id: "home", label: "ホーム", icon: Icons.home },
    { id: "profile", label: "プロフィール", icon: Icons.user },
    { id: "record", label: "記録", icon: Icons.record },
    { id: "analysis", label: "分析", icon: Icons.chart },
    { id: "coach", label: "コーチング", icon: Icons.coach },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {tab === "home" && <HomeScreen profile={data.profile} onNavigate={setTab} />}
        {tab === "profile" && <ProfileScreen profile={data.profile} onSave={saveProfile} />}
        {tab === "practice" && <PracticeScreen profile={data.profile} onSaveRecord={saveRecord} />}
        {tab === "record" && <RecordScreen records={data.records} />}
        {tab === "analysis" && <AnalysisScreen records={data.records} profile={data.profile} />}
        {tab === "coach" && <CoachScreen profile={data.profile} />}

        {tab !== "practice" && (
          <nav className="bottom-nav">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`nav-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
                <Icon />
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
