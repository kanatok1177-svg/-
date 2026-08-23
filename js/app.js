(() => {
  "use strict";

  /* ==========================================================
     PROGRAM DATA — 7日間ドーパミンデトックス
  ========================================================== */
  const PROGRAM = [
    {
      day: 1,
      title: "気づく（ベースライン測定）",
      goal: "自分のドーパミン依存パターンを、感情や状況ごと客観的に「見える化」する日。",
      missions: [
        "スマホのスクリーンタイム（設定アプリ等）を確認して記録する",
        "スマホを触った瞬間の気分（退屈・不安・寂しさ等）を3回分メモする",
        "寝る1時間前はスマホを見ない",
      ],
      tip: "「記録するだけで行動が変わる」現象は行動科学で“セルフモニタリング効果”と呼ばれ、習慣改善の代表的な技法の一つです。特に「何をした直前に触ったか」という感情のトリガーへの気づきが、この後の対策すべての土台になります。",
    },
    {
      day: 2,
      title: "環境をデザインする",
      goal: "誘惑に触れるまでの「手間（摩擦）」を増やし、意志力に頼らず行動を変える日。",
      missions: [
        "SNS・ゲーム・ニュースアプリの通知をすべてオフにする",
        "誘惑になるアプリを1つ、ホーム画面から削除 or フォルダの奥にしまう",
        "寝室にスマホを持ち込まない（充電は別の部屋、または玄関で）",
      ],
      tip: "行動経済学の「選択アーキテクチャ」では、行動が起こるまでの手間（摩擦）を1段階増やすだけで発生率が大きく下がることが知られています。意志力で我慢するより、先に触りにくい環境をつくる方が長続きします。",
    },
    {
      day: 3,
      title: "自然な報酬を取り戻す",
      goal: "手軽な刺激に頼らず、体を動かすことで自然にドーパミンが出る状態を思い出す日。",
      missions: [
        "15分以上の運動をする（散歩だけでもOK）",
        "朝、太陽の光を10分浴びる",
        "達成可能な小さなタスクを1つ完了させる（片付け・用事など）",
      ],
      tip: "運動や日光が脳内のドーパミン・セロトニンの働きを自然に整えることは複数の研究で示されています。また、小さなタスクの「完了」自体も達成報酬としてドーパミンを分泌させる、手軽な刺激に頼らない持続的な源です。",
    },
    {
      day: 4,
      title: "刺激をおろす（プチ断食）",
      goal: "意図的に刺激のない時間を作り、「快と不快のバランス」を体感する日。",
      missions: [
        "2時間、スマホ・SNS・動画から完全に離れる時間をつくる",
        "その間に感じる退屈やそわそわを、何かで埋めずにただ観察する",
        "1食は“ながら食べ”をせず、味わって食べる",
      ],
      tip: "心理学者リチャード・ソロモンの「対抗過程理論」によれば、強い快楽の後には反動としての“不快”が必ず訪れ、それを埋めるために次の刺激を求めるループが生まれます。あえて刺激ゼロの時間を作ることは、このループから距離を置く練習です。",
    },
    {
      day: 5,
      title: "「間」をつくる",
      goal: "衝動が湧いても即座に反応せず、行動との間に一呼吸を置く力を鍛える日。",
      missions: [
        "一番触ってしまうアプリについて「触りたくなったら◯◯をする」というif-thenルールを1つ決める",
        "そのルールを今日中に3回実践する",
        "スマホを手の届く場所ではなく、一度立ち上がらないと取れない場所に置く",
      ],
      tip: "人は目先の小さな報酬を将来の大きな報酬より過大評価する「遅延割引」という性質を持ちます。あらかじめ「もし◯◯なら△△する」と決めておく“if-thenプランニング”は、心理学者ゴルヴィツァーのメタ分析で目標達成率を大きく高めると示された、意志力に頼らない実践的な対策です。衝動が来た瞬間はSOSタイマーも使ってみましょう。",
    },
    {
      day: 6,
      title: "つながり直す",
      goal: "画面越しではない、本物の人とのつながりを取り戻す日。",
      missions: [
        "誰かと直接会う、または電話で15分以上話す",
        "新しいことを1つ体験する（本・料理・知らない道の散歩など）",
        "今日「本当はやりたかったこと」を1つ実行する",
      ],
      tip: "対面での会話や身体的な触れ合いは、SNS上の“いいね”のような短期的な刺激と異なり、信頼や安心に関わるホルモン（オキシトシン等）の分泌に関わるとされています。画面越しのつながりだけでは満たされにくい部分を、意識的に補いましょう。",
    },
    {
      day: 7,
      title: "仕組み化して維持する",
      goal: "この1週間の変化を振り返り、意志力に頼らず続くための仕組みを作る日。",
      missions: [
        "この1週間で気づいたことを3つ書き出す",
        "自分が特に誘惑に負けやすい状況（時間帯・感情・場所）を1つ特定する",
        "その状況に対する「次はこうする」という具体的なルールを1つ書いて残す",
      ],
      tip: "依存症治療で使われるマーラットの「再発防止モデル」では、二度と誘惑に負けないことよりも、負けやすい状況を事前に特定し、その場面での代替行動をあらかじめ決めておくことが長期的な成功の鍵とされています。今日決めたルールが、来週以降のあなたを支えます。",
    },
  ];

  const HOME_TIPS = PROGRAM.map((d) => d.tip);

  const STORAGE_KEY = "reboot_dopamine_detox_v1";

  /* ==========================================================
     STATE
  ========================================================== */
  function defaultState() {
    const days = {};
    PROGRAM.forEach((d) => {
      days[d.day] = { missions: d.missions.map(() => false), reflection: "", completedAt: null };
    });
    return {
      startedAt: null,
      currentDay: 1,
      days,
      cravingsOvercome: 0,
      sosLog: [], // { date, trigger }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return { ...base, ...parsed, days: { ...base.days, ...(parsed.days || {}) } };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  let state = loadState();

  /* ==========================================================
     HELPERS
  ========================================================== */
  function dayData(n) {
    return PROGRAM.find((d) => d.day === n);
  }

  function isDayComplete(n) {
    return state.days[n].missions.every(Boolean);
  }

  function completedCount() {
    return PROGRAM.filter((d) => isDayComplete(d.day)).length;
  }

  function currentStreak() {
    // consecutive completed days counting from day 1
    let streak = 0;
    for (const d of PROGRAM) {
      if (isDayComplete(d.day)) streak++;
      else break;
    }
    return streak;
  }

  function recommendedDay() {
    // first incomplete day, or day 7 if all complete
    const firstIncomplete = PROGRAM.find((d) => !isDayComplete(d.day));
    return firstIncomplete ? firstIncomplete.day : 7;
  }

  function fmtDate(iso) {
    if (!iso) return "未開始";
    const d = new Date(iso);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }

  function fmtDateTime(iso) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  /* ==========================================================
     NAVIGATION
  ========================================================== */
  const views = document.querySelectorAll(".view");
  const navItems = document.querySelectorAll(".nav-item");

  function goto(name) {
    views.forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
    navItems.forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    if (name === "program") renderProgram();
    if (name === "journal") renderJournal();
    if (name === "home") renderHome();
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  navItems.forEach((btn) => btn.addEventListener("click", () => goto(btn.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => goto(btn.dataset.goto));
  });

  /* ==========================================================
     HOME VIEW
  ========================================================== */
  const startBtn = document.getElementById("startBtn");
  const heroCard = document.querySelector(".hero-card");
  const progressCard = document.getElementById("progressCard");
  const todayCard = document.getElementById("todayCard");
  const calendarCard = document.getElementById("calendarCard");

  startBtn.addEventListener("click", () => {
    if (!state.startedAt) {
      state.startedAt = new Date().toISOString();
      saveState();
    }
    renderHome();
    goto("program");
  });

  function renderHome() {
    document.getElementById("streakCount").textContent = completedCount();

    const started = !!state.startedAt;
    heroCard.querySelector("#homeGreeting").textContent = started ? `Day ${recommendedDay()} 進行中` : "ようこそ";
    heroCard.querySelector("#homeHeadline").textContent = started
      ? "今日も一歩ずつ、脳を取り戻そう。"
      : "スマホを置いて、脳を取り戻そう。";
    startBtn.textContent = started ? "プログラムを続ける" : "プログラムを始める";

    progressCard.hidden = !started;
    todayCard.hidden = !started;
    calendarCard.hidden = !started;

    if (!started) return;

    const done = completedCount();
    const pct = done / 7;
    const CIRC = 326.7;
    document.getElementById("ringFg").style.strokeDashoffset = String(CIRC * (1 - pct));
    document.getElementById("progressDoneCount").textContent = done;
    document.getElementById("statStreak").textContent = `${currentStreak()}日`;
    document.getElementById("statSos").textContent = `${state.cravingsOvercome}回`;

    const rec = recommendedDay();
    const d = dayData(rec);
    document.getElementById("statDay").textContent = `Day ${rec}`;
    document.getElementById("todayDayPill").textContent = `Day ${rec}`;
    document.getElementById("todayTitle").textContent = d.title;
    document.getElementById("todayGoal").textContent = d.goal;
    const preview = document.getElementById("todayMissionPreview");
    preview.innerHTML = "";
    d.missions.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      preview.appendChild(li);
    });

    const dots = document.getElementById("dayDots");
    dots.innerHTML = "";
    PROGRAM.forEach((day) => {
      const dot = document.createElement("div");
      dot.className = "day-dot";
      if (isDayComplete(day.day)) dot.classList.add("done");
      else dot.textContent = String(day.day);
      if (day.day === rec) dot.classList.add("today");
      dots.appendChild(dot);
    });

    document.getElementById("dailyTip").textContent = HOME_TIPS[(rec - 1) % HOME_TIPS.length];
  }

  /* ==========================================================
     PROGRAM VIEW
  ========================================================== */
  let selectedDay = 1;
  const dayPillsEl = document.getElementById("dayPills");
  const missionListEl = document.getElementById("missionList");
  const reflectionEl = document.getElementById("dayReflection");

  function renderProgram() {
    if (!selectedDay || !state.days[selectedDay]) selectedDay = recommendedDay();
    dayPillsEl.innerHTML = "";
    PROGRAM.forEach((d) => {
      const btn = document.createElement("button");
      btn.className = "day-pill";
      if (d.day === selectedDay) btn.classList.add("active");
      if (isDayComplete(d.day)) btn.classList.add("done");
      btn.innerHTML = `<span class="dp-num">${d.day}</span><span>Day</span>`;
      btn.addEventListener("click", () => {
        commitReflection();
        selectedDay = d.day;
        renderProgram();
      });
      dayPillsEl.appendChild(btn);
    });
    renderDayDetail();
  }

  function renderDayDetail() {
    const d = dayData(selectedDay);
    const record = state.days[selectedDay];
    document.getElementById("dayDetailPill").textContent = `Day ${selectedDay}`;
    const statusEl = document.getElementById("dayDetailStatus");
    const complete = isDayComplete(selectedDay);
    statusEl.textContent = complete ? "達成 ✓" : "未達成";
    statusEl.classList.toggle("pill-done", complete);
    statusEl.classList.toggle("pill-ghost", !complete);
    document.getElementById("dayDetailTitle").textContent = d.title;
    document.getElementById("dayDetailGoal").textContent = d.goal;
    document.getElementById("dayDetailTip").textContent = d.tip;

    missionListEl.innerHTML = "";
    d.missions.forEach((text, i) => {
      const item = document.createElement("div");
      item.className = "mission-item";
      if (record.missions[i]) item.classList.add("checked");
      item.innerHTML = `<span class="mission-checkbox">✓</span><span class="mission-text">${text}</span>`;
      item.addEventListener("click", () => {
        const wasComplete = isDayComplete(selectedDay);
        record.missions[i] = !record.missions[i];
        const nowComplete = isDayComplete(selectedDay);
        if (!wasComplete && nowComplete) record.completedAt = new Date().toISOString();
        if (!nowComplete) record.completedAt = null;
        saveState();
        renderProgram();
        renderHome();
      });
      missionListEl.appendChild(item);
    });

    reflectionEl.value = record.reflection || "";
  }

  function commitReflection() {
    if (!state.days[selectedDay]) return;
    state.days[selectedDay].reflection = reflectionEl.value;
    saveState();
  }
  reflectionEl.addEventListener("blur", commitReflection);
  reflectionEl.addEventListener("input", () => {
    clearTimeout(reflectionEl._t);
    reflectionEl._t = setTimeout(commitReflection, 600);
  });

  /* ==========================================================
     SOS / URGE SURFING TIMER
  ========================================================== */
  const SOS_SECONDS = 90;
  const CIRC_BREATH = 552.9;
  let sosTimer = null;
  let sosRemaining = SOS_SECONDS;

  const sosStartBtn = document.getElementById("sosStartBtn");
  const sosCancelBtn = document.getElementById("sosCancelBtn");
  const sosDone = document.getElementById("sosDone");
  const breathWrap = document.getElementById("breathWrap");
  const breathTimeEl = document.getElementById("breathTime");
  const breathPhaseEl = document.getElementById("breathPhase");
  const breathRingFg = document.getElementById("breathRingFg");

  function resetSosUI() {
    sosRemaining = SOS_SECONDS;
    breathTimeEl.textContent = String(SOS_SECONDS);
    breathPhaseEl.textContent = "タップして開始";
    breathRingFg.style.strokeDashoffset = "0";
    breathWrap.classList.remove("breathing");
    sosStartBtn.hidden = false;
    sosCancelBtn.hidden = true;
    sosDone.hidden = true;
    sosDone.querySelectorAll(".chip").forEach((c) => c.classList.remove("picked"));
  }

  function startSos() {
    sosRemaining = SOS_SECONDS;
    sosStartBtn.hidden = true;
    sosCancelBtn.hidden = false;
    sosDone.hidden = true;
    breathWrap.classList.add("breathing");
    breathPhaseEl.textContent = "吸って…吐いて…";
    tickSos();
    sosTimer = setInterval(tickSos, 1000);
  }

  function tickSos() {
    breathTimeEl.textContent = String(sosRemaining);
    breathRingFg.style.strokeDashoffset = String(CIRC_BREATH * (1 - sosRemaining / SOS_SECONDS));
    if (sosRemaining <= 0) {
      clearInterval(sosTimer);
      finishSos();
      return;
    }
    sosRemaining--;
  }

  function finishSos() {
    breathWrap.classList.remove("breathing");
    breathPhaseEl.textContent = "波は過ぎました";
    sosCancelBtn.hidden = true;
    sosDone.hidden = false;
    state.cravingsOvercome++;
    saveState();
    renderHome();
  }

  function cancelSos() {
    clearInterval(sosTimer);
    resetSosUI();
  }

  sosStartBtn.addEventListener("click", startSos);
  sosCancelBtn.addEventListener("click", cancelSos);

  document.querySelectorAll("#sosTriggerChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#sosTriggerChips .chip").forEach((c) => c.classList.remove("picked"));
      chip.classList.add("picked");
      state.sosLog.push({ date: new Date().toISOString(), trigger: chip.dataset.trigger });
      saveState();
      setTimeout(() => {
        resetSosUI();
        renderSosHistory();
      }, 500);
    });
  });

  function renderSosHistory() {
    const el = document.getElementById("sosHistory");
    if (!state.sosLog.length) {
      el.innerHTML = '<p class="muted empty-hint">まだ記録がありません。衝動を乗り越えるたびにここに積み上がっていきます。</p>';
      return;
    }
    el.innerHTML = "";
    [...state.sosLog].reverse().slice(0, 20).forEach((log) => {
      const row = document.createElement("div");
      row.className = "sos-history-item";
      row.innerHTML = `<span class="sh-trigger">${log.trigger}</span><span class="sh-date">${fmtDateTime(log.date)}</span>`;
      el.appendChild(row);
    });
  }

  /* ==========================================================
     JOURNAL VIEW
  ========================================================== */
  function renderJournal() {
    document.getElementById("journalStart").textContent = fmtDate(state.startedAt);
    document.getElementById("journalDone").textContent = `${completedCount()} / 7 日`;
    document.getElementById("journalSos").textContent = `${state.cravingsOvercome} 回`;

    const list = document.getElementById("journalList");
    list.innerHTML = "";
    PROGRAM.forEach((d) => {
      const record = state.days[d.day];
      const entry = document.createElement("div");
      entry.className = "journal-entry";
      const statusLabel = isDayComplete(d.day) ? "達成 ✓" : "未達成";
      entry.innerHTML = `
        <div class="journal-entry-head">
          <span class="pill ${isDayComplete(d.day) ? "pill-done" : "pill-ghost"}">Day ${d.day}</span>
          <strong>${d.title}</strong>
          <span class="muted" style="margin-left:auto;font-size:11px;">${statusLabel}</span>
        </div>
        <p class="${record.reflection ? "" : "empty"}">${record.reflection ? escapeHtml(record.reflection) : "振り返りはまだ書かれていません"}</p>
      `;
      list.appendChild(entry);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /* ==========================================================
     RESET
  ========================================================== */
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("すべての記録を削除して最初からやり直しますか？この操作は取り消せません。")) return;
    state = defaultState();
    saveState();
    selectedDay = 1;
    goto("home");
    renderHome();
  });

  /* ==========================================================
     INIT
  ========================================================== */
  function init() {
    selectedDay = recommendedDay();
    resetSosUI();
    renderHome();
    renderSosHistory();
    goto("home");
  }

  init();
})();
