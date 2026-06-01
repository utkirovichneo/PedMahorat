const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { questions } = require('./data/questions');

const app = express();
const PORT = process.env.PORT || 3000;
const QUIZ_SIZE = questions.length;

const sessions = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestion(q) {
  const entries = Object.entries(q.options).filter(([, text]) => text && String(text).trim());
  const shuffled = shuffle(entries);
  const labels = ['A', 'B', 'C', 'D'];
  const options = {};
  let correctLabel = 'A';

  shuffled.forEach(([origKey, text], index) => {
    const label = labels[index];
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
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, totalQuestions: questions.length });
});

app.post('/api/quiz/start', (_req, res) => {
  if (questions.length < QUIZ_SIZE) {
    return res.status(500).json({ error: 'Savollar bazasi yetarli emas' });
  }

  const selected = shuffle(questions).slice(0, QUIZ_SIZE);
  const prepared = selected.map(prepareQuestion);
  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, {
    prepared,
    createdAt: Date.now(),
  });

  res.json({
    sessionId,
    total: QUIZ_SIZE,
    questions: prepared.map(({ id, question, options }) => ({ id, question, options })),
  });
});

app.post('/api/quiz/check-answer', (req, res) => {
  const { sessionId, questionIndex, answer } = req.body;

  if (!sessionId || typeof questionIndex !== 'number' || !answer) {
    return res.status(400).json({ error: 'Noto\'g\'ri so\'rov' });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Test sessiyasi topilmadi. Qayta boshlang.' });
  }

  const q = session.prepared[questionIndex];
  if (!q) {
    return res.status(400).json({ error: 'Savol topilmadi' });
  }

  const isCorrect = answer === q.correctLabel;

  res.json({
    isCorrect,
    correctLabel: q.correctLabel,
    correctText: q.options[q.correctLabel],
  });
});

app.post('/api/quiz/submit', (req, res) => {
  const { sessionId, answers } = req.body;

  if (!sessionId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Noto\'g\'ri so\'rov' });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Test sessiyasi topilmadi. Qayta boshlang.' });
  }

  if (answers.length !== session.prepared.length) {
    return res.status(400).json({ error: 'Barcha savollarga javob bering' });
  }

  const results = session.prepared.map((q, index) => {
    const userAnswer = answers[index] || null;
    const isCorrect = userAnswer === q.correctLabel;

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      userAnswer,
      correctLabel: q.correctLabel,
      isCorrect,
    };
  });

  sessions.delete(sessionId);

  const correct = results.filter((r) => r.isCorrect).length;

  res.json({
    correct,
    wrong: results.length - correct,
    total: results.length,
    percent: Math.round((correct / results.length) * 100),
    results,
  });
});

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > 60 * 60 * 1000) {
      sessions.delete(id);
    }
  }
}, 15 * 60 * 1000);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
  console.log(`Savollar bazasi: ${questions.length} ta`);
});
