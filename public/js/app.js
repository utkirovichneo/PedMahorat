(function () {
  'use strict';

  const QUESTIONS_COUNT = 10;
  const LABELS = ['A', 'B', 'C', 'D'];

  const screens = {
    start: document.getElementById('screen-start'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
  };

  const els = {
    totalQuestions: document.getElementById('total-questions'),
    startError: document.getElementById('start-error'),
    btnStart: document.getElementById('btn-start'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnFinish: document.getElementById('btn-finish'),
    btnRestart: document.getElementById('btn-restart'),
    questionCounter: document.getElementById('question-counter'),
    sessionInfo: document.getElementById('session-info'),
    progressFill: document.getElementById('progress-fill'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    resultBadge: document.getElementById('result-badge'),
    resultTitle: document.getElementById('result-title'),
    resultSummary: document.getElementById('result-summary'),
    statCorrect: document.getElementById('stat-correct'),
    statWrong: document.getElementById('stat-wrong'),
    statTotal: document.getElementById('stat-total'),
    resultDetails: document.getElementById('result-details'),
  };

  let sessionId = null;
  let quizQuestions = [];
  let currentIndex = 0;
  let answers = [];

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('screen--active'));
    screens[name].classList.add('screen--active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data && data.error ? data.error : `Xatolik: ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  async function init() {
    try {
      const health = await fetchJson('/api/health');
      if (els.totalQuestions) els.totalQuestions.textContent = `${health.totalQuestions} ta`;
    } catch {
      // health ishlamasa ham UI ishlayveradi
    }
  }

  async function startQuiz() {
    els.startError.hidden = true;
    els.startError.textContent = '';

    try {
      const data = await fetchJson('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      sessionId = data.sessionId;
      quizQuestions = data.questions;
      currentIndex = 0;
      answers = new Array(quizQuestions.length).fill(null);

      els.sessionInfo.textContent = 'Test boshlandi';
      showScreen('quiz');
      renderQuestion();
    } catch (e) {
      els.startError.textContent = e && e.message ? e.message : 'Testni boshlab bo‘lmadi';
      els.startError.hidden = false;
    }
  }

  function renderQuestion() {
    const q = quizQuestions[currentIndex];
    const answered = answers[currentIndex];

    els.questionCounter.textContent = `Savol ${currentIndex + 1} / ${QUESTIONS_COUNT}`;
    els.progressFill.style.width = `${((currentIndex + 1) / QUESTIONS_COUNT) * 100}%`;
    els.questionText.textContent = q.question;

    els.optionsContainer.innerHTML = '';
    LABELS.forEach((label) => {
      if (!q.options[label]) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option' + (answered === label ? ' option--selected' : '');
      btn.dataset.label = label;
      btn.innerHTML =
        `<span class="option__label">${label}</span>` +
        `<span class="option__text">${escapeHtml(q.options[label])}</span>`;

      btn.addEventListener('click', () => selectAnswer(label));
      els.optionsContainer.appendChild(btn);
    });

    els.btnPrev.disabled = currentIndex === 0;
    els.btnNext.hidden = currentIndex === quizQuestions.length - 1;
    els.btnFinish.hidden = currentIndex !== quizQuestions.length - 1;
    els.btnFinish.disabled = !answers[currentIndex];
    els.btnNext.disabled = !answers[currentIndex];
  }

  function selectAnswer(label) {
    answers[currentIndex] = label;
    els.optionsContainer.querySelectorAll('.option').forEach((opt) => {
      opt.classList.toggle('option--selected', opt.dataset.label === label);
    });
    els.btnNext.disabled = false;
    if (currentIndex === quizQuestions.length - 1) {
      els.btnFinish.disabled = false;
    }
  }

  async function finishQuiz() {
    try {
      const data = await fetchJson('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers }),
      });

      renderResults(data);
    } catch (e) {
      alert(e && e.message ? e.message : 'Natijani chiqarib bo‘lmadi');
    }
  }

  function renderResults(data) {
    const correct = data.correct;
    const total = data.total;
    const wrong = data.wrong;
    const percent = data.percent;
    const results = data.results;

    els.statCorrect.textContent = correct;
    els.statWrong.textContent = wrong;
    els.statTotal.textContent = total;

    if (percent >= 80) {
      els.resultBadge.className = 'result-badge result-badge--good';
      els.resultBadge.textContent = '🎉';
      els.resultTitle.textContent = 'Ajoyib natija!';
    } else if (percent >= 50) {
      els.resultBadge.className = 'result-badge result-badge--medium';
      els.resultBadge.textContent = '👍';
      els.resultTitle.textContent = 'Yaxshi natija!';
    } else {
      els.resultBadge.className = 'result-badge result-badge--bad';
      els.resultBadge.textContent = '📖';
      els.resultTitle.textContent = "Yana bir bor urinib ko'ring";
    }

    els.resultSummary.textContent = `${total} ta savoldan ${correct} tasiga to'g'ri javob berdingiz (${percent}%).`;

    els.resultDetails.innerHTML = results
      .map((r, idx) => {
        const userText = r.userAnswer ? r.options[r.userAnswer] : 'Javob berilmagan';
        const correctText = r.options[r.correctLabel];
        const isCorrect = r.isCorrect;

        return `
          <div class="result-item result-item--${isCorrect ? 'correct' : 'wrong'}">
            <div class="result-item__header">
              <span>Savol ${idx + 1}</span>
              <span class="result-item__badge">${isCorrect ? "To'g'ri" : "Noto'g'ri"}</span>
            </div>
            <p class="result-item__question">${escapeHtml(r.question)}</p>
            <p class="result-item__answer">
              Sizning javobingiz: <strong>${r.userAnswer ? r.userAnswer + ') ' : ''}${escapeHtml(userText)}</strong>
            </p>
            ${
              !isCorrect
                ? `<p class="result-item__answer">To'g'ri javob: <strong>${r.correctLabel}) ${escapeHtml(
                    correctText
                  )}</strong></p>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    showScreen('result');
  }

  els.btnStart.addEventListener('click', startQuiz);
  els.btnRestart.addEventListener('click', () => {
    sessionId = null;
    quizQuestions = [];
    currentIndex = 0;
    answers = [];
    showScreen('start');
  });

  els.btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  els.btnNext.addEventListener('click', () => {
    if (currentIndex < quizQuestions.length - 1 && answers[currentIndex]) {
      currentIndex++;
      renderQuestion();
    }
  });

  els.btnFinish.addEventListener('click', () => {
    if (answers[currentIndex]) {
      finishQuiz();
    }
  });

  init();
})();

