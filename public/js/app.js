(function () {
  'use strict';

  const LABELS = ['A', 'B', 'C', 'D'];

  const screens = {
    start: document.getElementById('screen-start'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
  };

  const els = {
    totalQuestions: document.getElementById('total-questions'),
    startError: document.getElementById('start-error'),
    quizButtons: Array.from(document.querySelectorAll('[data-quiz-id]')),
    quizTitle: document.getElementById('quiz-title'),
    quizSubtitle: document.getElementById('quiz-subtitle'),
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
    answerFeedback: document.getElementById('answer-feedback'),
    resultBadge: document.getElementById('result-badge'),
    resultTitle: document.getElementById('result-title'),
    resultSummary: document.getElementById('result-summary'),
    statCorrect: document.getElementById('stat-correct'),
    statWrong: document.getElementById('stat-wrong'),
    statTotal: document.getElementById('stat-total'),
    resultDetails: document.getElementById('result-details'),
    btnToggleNav: document.getElementById('btn-toggle-nav'),
    quizNavPanel: document.getElementById('quiz-nav-panel'),
    navSummary: document.getElementById('nav-summary'),
    questionNavGrid: document.getElementById('question-nav-grid'),
  };

  let sessionId = null;
  let navBuilt = false;
  let quizQuestions = [];
  let currentIndex = 0;
  let answers = [];
  let questionFeedback = [];
  let checkingAnswer = false;
  let selectedQuizId = 'pedagogik_mahorat';
  let quizzesCache = null;

  function setActiveQuiz(quizId) {
    selectedQuizId = quizId || 'pedagogik_mahorat';

    if (els.quizButtons && els.quizButtons.length) {
      els.quizButtons.forEach((btn) => {
        const isActive = btn.dataset.quizId === selectedQuizId;
        btn.classList.toggle('quiz-picker__btn--active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    if (quizzesCache) {
      const q = quizzesCache.find((x) => x.id === selectedQuizId) || quizzesCache[0];
      if (q) {
        if (els.totalQuestions) els.totalQuestions.textContent = `${q.totalQuestions} ta`;
        if (els.quizTitle) els.quizTitle.textContent = q.title;
        if (els.quizSubtitle) els.quizSubtitle.textContent = `Mini test — ${q.totalQuestions} ta savol`;
      }
    }
  }

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

  function typesetMath(elements) {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') {
      return Promise.resolve();
    }
    const nodes = (elements || []).filter(Boolean);
    if (!nodes.length) return Promise.resolve();
    return window.MathJax.typesetPromise(nodes).catch(() => {});
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

  function updateLiveScore() {
    const answered = questionFeedback.filter(Boolean).length;
    const correct = questionFeedback.filter((f) => f && f.isCorrect).length;
    els.sessionInfo.textContent = answered
      ? `To'g'ri: ${correct} / ${answered}`
      : 'Test boshlandi';
    updateNavSummary();
  }

  function updateNavSummary() {
    if (!els.navSummary) return;
    const total = quizQuestions.length;
    const answered = questionFeedback.filter(Boolean).length;
    const correct = questionFeedback.filter((f) => f && f.isCorrect).length;
    const wrong = questionFeedback.filter((f) => f && !f.isCorrect).length;
    const unanswered = total - answered;
    els.navSummary.textContent = `Javob: ${answered} · To'g'ri: ${correct} · Noto'g'ri: ${wrong} · Qolgan: ${unanswered}`;
  }

  function buildQuestionNav() {
    if (!els.questionNavGrid || navBuilt) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < quizQuestions.length; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-item';
      btn.textContent = String(i + 1);
      btn.title = `Savol ${i + 1}`;
      btn.setAttribute('aria-label', `Savol ${i + 1}`);
      btn.addEventListener('click', () => goToQuestion(i));
      fragment.appendChild(btn);
    }

    els.questionNavGrid.innerHTML = '';
    els.questionNavGrid.appendChild(fragment);
    navBuilt = true;
  }

  function updateQuestionNav() {
    if (!els.questionNavGrid) return;

    els.questionNavGrid.querySelectorAll('.nav-item').forEach((btn, i) => {
      const feedback = questionFeedback[i];
      btn.className = 'nav-item';

      if (i === currentIndex) {
        btn.classList.add('nav-item--current');
      }
      if (feedback) {
        btn.classList.add(feedback.isCorrect ? 'nav-item--correct' : 'nav-item--wrong');
      }
    });

    updateNavSummary();
  }

  function goToQuestion(index) {
    if (index < 0 || index >= quizQuestions.length || index === currentIndex) return;
    currentIndex = index;
    renderQuestion();
  }

  async function init() {
    try {
      const health = await fetchJson('/api/health');
      if (health && Array.isArray(health.quizzes)) {
        quizzesCache = health.quizzes;
        setActiveQuiz(selectedQuizId);
      }
    } catch {
      // health ishlamasa ham UI ishlayveradi
    }
  }

  async function startQuiz() {
    els.startError.hidden = true;
    els.startError.textContent = '';

    try {
      const quizId = selectedQuizId || 'pedagogik_mahorat';
      const data = await fetchJson('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId }),
      });

      sessionId = data.sessionId;
      quizQuestions = data.questions;
      currentIndex = 0;
      answers = new Array(quizQuestions.length).fill(null);
      questionFeedback = new Array(quizQuestions.length).fill(null);
      navBuilt = false;

      els.sessionInfo.textContent = 'Test boshlandi';
      if (els.quizTitle && data && data.title) els.quizTitle.textContent = data.title;
      if (els.quizSubtitle && data && data.total) els.quizSubtitle.textContent = `Mini test — ${data.total} ta savol`;
      showScreen('quiz');
      buildQuestionNav();
      renderQuestion();
    } catch (e) {
      els.startError.textContent = e && e.message ? e.message : 'Testni boshlab bo‘lmadi';
      els.startError.hidden = false;
    }
  }

  if (els.quizButtons && els.quizButtons.length) {
    els.quizButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const quizId = btn.dataset.quizId;
        setActiveQuiz(quizId);
        // Fan tanlanganda test darhol boshlansin
        if (screens.start && screens.start.classList.contains('screen--active')) {
          startQuiz();
        }
      });
    });
  }

  function showAnswerFeedback(feedback) {
    if (!els.answerFeedback) return;

    const q = quizQuestions[currentIndex];
    els.answerFeedback.hidden = false;

    if (feedback.isCorrect) {
      els.answerFeedback.className = 'answer-feedback answer-feedback--correct';
      els.answerFeedback.textContent = "To'g'ri javob!";
    } else {
      const correctText = q.options[feedback.correctLabel];
      els.answerFeedback.className = 'answer-feedback answer-feedback--wrong';
      els.answerFeedback.innerHTML =
        `Noto'g'ri. To'g'ri javob: <strong>${feedback.correctLabel}) ${escapeHtml(correctText)}</strong>`;
      typesetMath([els.answerFeedback]);
    }
  }

  function applyOptionStyles(feedback) {
    els.optionsContainer.querySelectorAll('.option').forEach((opt) => {
      const label = opt.dataset.label;
      opt.classList.remove('option--selected', 'option--correct', 'option--wrong', 'option--revealed');
      opt.disabled = true;

      if (label === feedback.userAnswer) {
        opt.classList.add(feedback.isCorrect ? 'option--correct' : 'option--wrong');
      } else if (!feedback.isCorrect && label === feedback.correctLabel) {
        opt.classList.add('option--revealed');
      }
    });
  }

  function renderQuestion() {
    const q = quizQuestions[currentIndex];
    const feedback = questionFeedback[currentIndex];
    const total = quizQuestions.length;

    els.questionCounter.textContent = `Savol ${currentIndex + 1} / ${total}`;
    els.progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
    els.questionText.innerHTML = escapeHtml(q.question);

    els.optionsContainer.innerHTML = '';
    if (els.answerFeedback) {
      els.answerFeedback.hidden = true;
      els.answerFeedback.textContent = '';
      els.answerFeedback.className = 'answer-feedback';
    }

    LABELS.forEach((label) => {
      if (!q.options[label]) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.label = label;
      btn.innerHTML =
        `<span class="option__label">${label}</span>` +
        `<span class="option__text">${escapeHtml(q.options[label])}</span>`;

      if (!feedback) {
        btn.addEventListener('click', () => selectAnswer(label));
      }

      els.optionsContainer.appendChild(btn);
    });

    if (feedback) {
      applyOptionStyles(feedback);
      showAnswerFeedback(feedback);
    }

    typesetMath([els.questionText, els.optionsContainer, els.answerFeedback]);

    els.btnPrev.disabled = currentIndex === 0;
    els.btnNext.hidden = currentIndex === total - 1;
    els.btnFinish.hidden = false;
    const hasAnswer = Boolean(answers[currentIndex]);
    els.btnNext.disabled = !hasAnswer;
    els.btnFinish.disabled = false;

    updateQuestionNav();
  }

  async function selectAnswer(label) {
    if (checkingAnswer || questionFeedback[currentIndex]) return;

    checkingAnswer = true;
    els.optionsContainer.querySelectorAll('.option').forEach((opt) => {
      opt.disabled = true;
    });

    try {
      const data = await fetchJson('/api/quiz/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionIndex: currentIndex,
          answer: label,
        }),
      });

      const feedback = {
        userAnswer: label,
        isCorrect: data.isCorrect,
        correctLabel: data.correctLabel,
      };

      answers[currentIndex] = label;
      questionFeedback[currentIndex] = feedback;

      applyOptionStyles(feedback);
      showAnswerFeedback(feedback);
      updateLiveScore();
      updateQuestionNav();

      els.btnNext.disabled = false;
      if (currentIndex === quizQuestions.length - 1) {
        els.btnFinish.disabled = false;
      }
    } catch (e) {
      els.optionsContainer.querySelectorAll('.option').forEach((opt) => {
        opt.disabled = false;
      });
      alert(e && e.message ? e.message : 'Javobni tekshirib bo‘lmadi');
    } finally {
      checkingAnswer = false;
    }
  }

  function resetToStart() {
    sessionId = null;
    quizQuestions = [];
    currentIndex = 0;
    answers = [];
    questionFeedback = [];
    navBuilt = false;
    if (els.questionNavGrid) els.questionNavGrid.innerHTML = '';
    showScreen('start');
  }

  async function finishQuiz() {
    const unansweredCount = answers.filter((a) => !a).length;
    if (unansweredCount > 0) {
      const ok = confirm(
        `Sizda ${unansweredCount} ta javobsiz savol bor. Baribir yakunlaysizmi?`
      );
      if (!ok) return;
    }

    try {
      await fetchJson('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, answers }),
      });

      resetToStart();
    } catch (e) {
      alert(e && e.message ? e.message : 'Testni yakunlab bo‘lmadi');
    }
  }

  els.btnStart.addEventListener('click', startQuiz);
  els.btnRestart.addEventListener('click', resetToStart);

  if (els.btnToggleNav && els.quizNavPanel) {
    els.btnToggleNav.addEventListener('click', () => {
      const isOpen = els.btnToggleNav.getAttribute('aria-expanded') === 'true';
      els.btnToggleNav.setAttribute('aria-expanded', String(!isOpen));
      els.quizNavPanel.hidden = isOpen;
    });
  }

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
    finishQuiz();
  });

  init();
})();
