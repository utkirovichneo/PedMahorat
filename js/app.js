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
    btnStart: document.getElementById('btn-start'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnFinish: document.getElementById('btn-finish'),
    btnRestart: document.getElementById('btn-restart'),
    questionCounter: document.getElementById('question-counter'),
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

  let quizQuestions = [];
  let currentIndex = 0;
  let answers = [];

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('screen--active'));
    screens[name].classList.add('screen--active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandomQuestions(count) {
    const shuffled = shuffleArray(QUESTIONS);
    return shuffled.slice(0, count).map(prepareQuestion);
  }

  function prepareQuestion(q) {
    const entries = Object.entries(q.options).filter(([, text]) => text && text.trim());
    const shuffledEntries = shuffleArray(entries);

    const options = {};
    let correctLabel = 'A';

    shuffledEntries.forEach(([origKey, text], idx) => {
      const label = LABELS[idx];
      options[label] = text;
      if (origKey === q.correct) {
        correctLabel = label;
      }
    });

    return {
      id: q.id,
      question: q.question,
      options,
      correctLabel,
      originalCorrectText: q.options[q.correct],
    };
  }

  function startQuiz() {
    quizQuestions = pickRandomQuestions(QUESTIONS_COUNT);
    currentIndex = 0;
    answers = new Array(QUESTIONS_COUNT).fill(null);
    showScreen('quiz');
    renderQuestion();
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
    els.btnNext.hidden = currentIndex === QUESTIONS_COUNT - 1;
    els.btnFinish.hidden = currentIndex !== QUESTIONS_COUNT - 1;
    els.btnFinish.disabled = !answers[currentIndex];
    els.btnNext.disabled = !answers[currentIndex];
  }

  function selectAnswer(label) {
    answers[currentIndex] = label;
    els.optionsContainer.querySelectorAll('.option').forEach((opt) => {
      opt.classList.toggle('option--selected', opt.dataset.label === label);
    });
    els.btnNext.disabled = false;
    if (currentIndex === QUESTIONS_COUNT - 1) {
      els.btnFinish.disabled = false;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showResults() {
    let correctCount = 0;

    const detailsHtml = quizQuestions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correctLabel;
      if (isCorrect) correctCount++;

      const userText = userAnswer ? q.options[userAnswer] : 'Javob berilmagan';
      const correctText = q.options[q.correctLabel];

      return `
        <div class="result-item result-item--${isCorrect ? 'correct' : 'wrong'}">
          <div class="result-item__header">
            <span>Savol ${i + 1}</span>
            <span class="result-item__badge">${isCorrect ? "To'g'ri" : "Noto'g'ri"}</span>
          </div>
          <p class="result-item__question">${escapeHtml(q.question)}</p>
          <p class="result-item__answer">
            Sizning javobingiz: <strong>${userAnswer ? userAnswer + ') ' : ''}${escapeHtml(userText)}</strong>
          </p>
          ${!isCorrect ? `<p class="result-item__answer">To'g'ri javob: <strong>${q.correctLabel}) ${escapeHtml(correctText)}</strong></p>` : ''}
        </div>
      `;
    }).join('');

    const wrongCount = QUESTIONS_COUNT - correctCount;
    const percent = Math.round((correctCount / QUESTIONS_COUNT) * 100);

    els.statCorrect.textContent = correctCount;
    els.statWrong.textContent = wrongCount;
    els.statTotal.textContent = QUESTIONS_COUNT;

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
      els.resultTitle.textContent = 'Yana bir bor urinib ko\'ring';
    }

    els.resultSummary.textContent = `${QUESTIONS_COUNT} ta savoldan ${correctCount} tasiga to'g'ri javob berdingiz (${percent}%).`;
    els.resultDetails.innerHTML = detailsHtml;

    showScreen('result');
  }

  els.btnStart.addEventListener('click', startQuiz);
  els.btnRestart.addEventListener('click', () => showScreen('start'));

  els.btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  els.btnNext.addEventListener('click', () => {
    if (currentIndex < QUESTIONS_COUNT - 1 && answers[currentIndex]) {
      currentIndex++;
      renderQuestion();
    }
  });

  els.btnFinish.addEventListener('click', () => {
    if (answers[currentIndex]) {
      showResults();
    }
  });
})();
