(() => {
  "use strict";

  /* ==========================================================
     PROGRAM DATA — 7日間ドーパミンデトックス
  ========================================================== */
  const PROGRAM = [
    {
      day: 1,
      title: "気づく",
      goal: "自分のドーパミン依存パターンにまず気づく日。無意識の行動を「見える化」します。",
      missions: [
        "スマホのスクリーンタイム（設定アプリ等）を確認して記録する",
        "無意識にスマホを触った回数を1日数えてみる（正の字でOK）",
        "寝る1時間前はスマホを見ない",
      ],
      tip: "SNSや通知は「予測できない報酬」を与えるためドーパミンを強く刺激します。これはスロットマシンと同じ仕組み（変動報酬）です。中身より“予測できないこと”自体が依存を作ります。",
    },
    {
      day: 2,
      title: "環境をデザインする",
      goal: "誘惑に触れにくい環境を作る日。意志力に頼らず、仕組みで自分を守ります。",
      missions: [
        "SNS・ゲーム・ニュースアプリの通知をすべてオフにする",
        "誘惑になるアプリを1つ、ホーム画面から削除 or フォルダの奥にしまう",
        "寝室にスマホを持ち込まない（充電は別の部屋、または玄関で）",
      ],
      tip: "意志力より「環境」を変える方が圧倒的に効果的です。手に取るまでの手間（摩擦）を1つ増やすだけで、使用時間は大きく減ることが行動科学の実験でわかっています。",
    },
    {
      day: 3,
      title: "置き換え習慣をつくる",
      goal: "手軽な快楽の代わりに、自然にドーパミンが出る行動を増やす日。",
      missions: [
        "15分以上の運動をする（散歩だけでもOK）",
        "朝、太陽の光を10分浴びる",
        "誘惑を感じたら、水を一杯飲む・深呼吸を3回する",
      ],
      tip: "運動・日光・十分な睡眠は、脳内でドーパミンやセロトニンを自然に整えます。手軽な刺激を減らすほど、こうした“地味な快楽”を再び感じられるようになります。",
    },
    {
      day: 4,
      title: "プチ断食（刺激ゼロ時間）",
      goal: "意図的に「何もしない時間」を作り、退屈に耐える力を鍛える日。",
      missions: [
        "2時間、スマホ・SNS・動画から完全に離れる時間をつくる",
        "その間に退屈を感じても、何かで埋めずにただ過ごす（散歩・ぼーっとする等）",
        "1食は“ながら食べ”をせず、味わって食べる",
      ],
      tip: "常に何かに刺激されていると、脳は退屈に耐えられなくなります。あえて刺激ゼロの時間を作ることで、脳の報酬システムが徐々にリセットされていきます。",
    },
    {
      day: 5,
      title: "衝動サーフィン",
      goal: "衝動が来ても、すぐ反応せず「波」をやり過ごす練習をする日。",
      missions: [
        "スマホを触りたくなったら、アプリの「SOS」で90秒待ってみる",
        "1日3回、“今すぐやりたいこと”をあえて先延ばしにする",
        "今日感じた衝動のきっかけを1つメモする",
      ],
      tip: "衝動（クレイビング）は波のように高まって、やがて自然に引いていきます。90秒ほど反応せずにいると、多くの場合ピークは過ぎ去ります。これを「アージ・サーフィン」と呼びます。",
    },
    {
      day: 6,
      title: "つながり直す",
      goal: "画面の外にある、人や世界との本物のつながりを取り戻す日。",
      missions: [
        "誰かと直接会う、または電話で15分以上話す",
        "新しいことを1つ体験する（本・料理・知らない道の散歩など）",
        "今日「本当はやりたかったこと」を1つ実行する",
      ],
      tip: "SNSの“つながり”は本物の対面コミュニケーションに比べ、オキシトシンなどの満足感につながるホルモン分泌が弱いとされています。画面の外のつながりが、脳の満足度を底上げします。",
    },
    {
      day: 7,
      title: "振り返りと継続プラン",
      goal: "この1週間の変化を振り返り、続けるための仕組みを作る日。",
      missions: [
        "この1週間で気づいたことを3つ書き出す",
        "これからも続けたい習慣を1つ決める",
        "次の1週間に向けた「自分ルール」を1つ決める（例：寝室にスマホ持ち込まない）",
      ],
      tip: "習慣化のカギは「意志」ではなく「ルール化」です。“やらない理由”を毎回考えなくて済むように、行動をルールとして固定してしまいましょう。",
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
