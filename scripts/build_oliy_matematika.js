/**
 * Oliy matematika savollar bazasini yaratadi.
 * To'g'ri javob har savol uchun A/B/C/D orasida tasodifiy belgilanadi.
 */
const fs = require('fs');
const path = require('path');

const LABELS = ['A', 'B', 'C', 'D'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** To'rt variant: bitta to'g'ri + uch noto'g'ri, correct tasodifiy harfda */
function makeOptions(correctText, wrongTexts) {
  const all = [correctText, ...wrongTexts.slice(0, 3)];
  while (all.length < 4) all.push('—');
  const shuffled = shuffle(all);
  const options = {};
  let correct = 'A';
  shuffled.forEach((text, i) => {
    const label = LABELS[i];
    options[label] = text;
    if (text === correctText) correct = label;
  });
  return { options, correct };
}

function q(id, question, options, correct) {
  return { id, question, options, correct };
}

function integralPower(n, coeff = 1) {
  const p = n + 1;
  const c = coeff === 1 ? '' : `${coeff}`;
  const ans = `$\\frac{${c}x^{${p}}}{${p}} + C$`;
  const wrongs = [
    `$\\frac{${c}x^{${n}}}{${n}} + C$`,
    `$${c}x^{${p}} + C$`,
    `$\\frac{x^{${p}}}{${p + 1}} + C$`,
  ];
  return makeOptions(ans, wrongs);
}

function definiteIntegral(latex, correct, wrongs) {
  return makeOptions(`$${correct}$`, wrongs.map((w) => `$${w}$`));
}

const raw = [
  q(1, 'Differensial tenglama deb nimaga aytiladi?', {
    A: "Erkli o'zgaruvchi va no'malum funksiya hamda uning hosilalari qatnashgan tenglamaga differensial tenglama deyiladi",
    B: "Erkli o'zgaruvchi va no'malum funksiya bog'lovchi munosabatlar differensial tenglama deyiladi",
    C: "Noma'lum funksiyani bog'lovchi munosabat differensial tenglama deyiladi",
    D: "Erkli o'zgaruvchi va no'malum funksiya hosilalari yoki differensiallarini bog'lovchi munosabatlar differensial tenglama deyiladi.",
  }, 'D'),

  (() => {
    const { options, correct } = integralPower(5);
    return q(2, 'Aniqmas integralni toping: $\\int x^5 \\, dx$', options, correct);
  })(),

  q(3, 'Oddiy differensial tenglama deb nimaga aytiladi?', {
    A: "Agar noma'lum funksiya bitta erkli o'zgaruvchiga bog'liq bo'lsa, bunday differensial tenglama oddiy differensial tenglama deyiladi.",
    B: "Agar noma'lum funksiya ikkita erkli o'zgaruvchiga bog'liq bo'lsa, bunday differensial tenglama oddiy differensial tenglama deyiladi.",
    C: "Agar noma'lum funksiya uchta erkli o'zgaruvchiga bog'liq bo'lsa, bunday differensial tenglama oddiy differensial tenglama deyiladi.",
    D: "Agar noma'lum funksiya beshta erkli o'zgaruvchiga bog'liq bo'lsa, bunday differensial tenglama oddiy differensial tenglama deyiladi.",
  }, 'A'),

  (() => {
    const { options, correct } = integralPower(6);
    return q(4, 'Aniqmas integralni toping: $\\int x^6 \\, dx$', options, correct);
  })(),

  q(5, "Statistika so'zi qaysi tildan olingan va qanday ma'noni bildiradi?", {
    A: 'lotincha "status" so\'zidan olingan bo\'lib, holat, ahvol, vaziyat ma\'nolarini bildiradi.',
    B: 'nemischa "status" so\'zidan olingan bo\'lib, hodisa, tasodif, tuzum ma\'nolarini bildiradi.',
    C: 'fransuzcha "status" so\'zidan olingan bo\'lib, statistika, ishlab chiqarish ma\'nolarini bildiradi.',
    D: 'Inglizcha "status" sozidan olingan bo\'lib, aholi soni, iqtisodiy holat, davlatning ahvoli ma\'nolarini bildiradi.',
  }, 'A'),

  (() => {
    const ans = '$x^5 + C$';
    const { options, correct } = makeOptions(ans, ['$5x^5 + C$', '$\\frac{x^5}{5} + C$', '$x^4 + C$']);
    return q(6, 'Aniqmas integralni toping: $\\int 5x^4 \\, dx$', options, correct);
  })(),

  q(7, 'Differensial tenglamalar tuzilishiga ko\'ra necha xil bo\'ladi?', { A: '4 xil', B: '3 xil', C: '2 xil', D: '1 xil' }, 'C'),

  (() => {
    const ans = '$x^3 + C$';
    const { options, correct } = makeOptions(ans, ['$3x^3 + C$', '$\\frac{x^3}{3} + C$', '$x^2 + C$']);
    return q(8, 'Aniqmas integralni toping: $\\int 3x^2 \\, dx$', options, correct);
  })(),

  q(9, 'Differensial tenglamaning tartibi nimaga bog\'liq?', {
    A: 'Hosilaning eng yuqori tartibiga',
    B: "Tenglamadagi o'zgaruvchilar soniga",
    C: 'Berilgan tenglamaning uzunligiga',
    D: 'Berilgan tenglamaning ildizlari soniga',
  }, 'A'),

  (() => {
    const ans = '$x^7 + C$';
    const { options, correct } = makeOptions(ans, ['$7x^7 + C$', '$\\frac{x^7}{7} + C$', '$x^6 + C$']);
    return q(10, 'Aniqmas integralni toping: $\\int 7x^6 \\, dx$', options, correct);
  })(),

  q(11, "O'zgaruvchilari ajralgan tenglamani yechish uchun nima qilinadi?", {
    A: "O'zgaruvchilarni ajratib integrallanadi.",
    B: "O'zgaruvchilarni ajratib kvadratga keltiriladi.",
    C: 'Berilgan tenglamaning diskriminanti topiladi.',
    D: 'Berilgan tenglamaning grafigi yasaladi.',
  }, 'A'),

  (() => {
    const { options, correct } = integralPower(3);
    return q(12, 'Aniqmas integralni toping: $\\int 4x^3 \\, dx$', options, correct);
  })(),

  q(13, 'Quyidagi tenglamalarning qaysi biri differensial tenglama?', {
    A: "$y' = 2x$",
    B: '$2x + 3 = 0$',
    C: '$x^2 - 9 = 0$',
    D: '$\\sin x = 0$',
  }, 'A'),

  (() => {
    const { options, correct } = integralPower(7);
    return q(14, 'Aniqmas integralni toping: $\\int 8x^7 \\, dx$', options, correct);
  })(),

  (() => {
    const { options, correct } = integralPower(8);
    return q(15, 'Aniqmas integralni toping: $\\int 9x^8 \\, dx$', options, correct);
  })(),

  q(16, '$0!$ ning qiymati nimaga teng?', { A: '$1$', B: '$0$', C: '$2$', D: 'Aniqlanmagan' }, 'A'),

  (() => {
    const ans = '$x^{15} + C$';
    const { options, correct } = makeOptions(ans, ['$15x^{15} + C$', '$\\frac{x^{15}}{15} + C$', '$x^{14} + C$']);
    return q(17, 'Aniqmas integralni toping: $\\int 15x^{14} \\, dx$', options, correct);
  })(),

  q(18, 'Kombinatorika qaysi sohada qo\'llaniladi?', {
    A: 'Ehtimollar nazariyasida',
    B: 'Geometriyaning stereometriya bo\'limida',
    C: 'Algebraik tenglamalarni yechishda',
    D: 'Trigonometrik tenglamalarda',
  }, 'A'),

  (() => {
    const ans = '$x^{16} + C$';
    const { options, correct } = makeOptions(ans, ['$16x^{16} + C$', '$\\frac{x^{16}}{16} + C$', '$x^{15} + C$']);
    return q(19, 'Aniqmas integralni toping: $\\int 16x^{15} \\, dx$', options, correct);
  })(),

  q(20, 'Berilgan $n$ ta elementdan $k$ tasini tanlash nima deyiladi?', {
    A: 'Kombinatsiya',
    B: 'Permutratsiya',
    C: "O'rinlashtirish",
    D: "O'rin almashtirish",
  }, 'A'),

  q(21, 'Aniq integralni hisoblang: $\\int_0^3 x^2 \\, dx$', { A: '$9$', B: '$3$', C: '$0$', D: '$-9$' }, 'A'),

  q(22, 'Sinash natijasida albatta ro\'y beradigan hodisalar qanday hodisalar deyiladi?', {
    A: 'Muqarrar hodisa',
    B: "Mumkin bo'lmagan hodisa",
    C: 'Foydali hodisa',
    D: 'Tasodifiy hodisa',
  }, 'A'),

  (() => {
    const { options, correct } = definiteIntegral('', '\\frac{1}{6}', ['1', '0', '\\frac{1}{5}']);
    return q(23, 'Aniq integralni hisoblang: $\\int_0^1 x^5 \\, dx$', options, correct);
  })(),

  q(24, 'Sinash natijasida albatta ro\'y bermaydigan hodisalar qanday hodisalar deyiladi?', {
    A: "Mumkin bo'lmagan hodisa",
    B: 'Muqarrar hodisa',
    C: 'Foydali hodisa',
    D: 'Tasodifiy hodisa',
  }, 'A'),

  q(25, 'Aniq integralni hisoblang: $\\int_0^2 2x \\, dx$', { A: '$4$', B: '$2$', C: '$-4$', D: '$-2$' }, 'A'),

  q(26, 'Sinash natijasida ro\'y berishi ham ro\'y bermasligi ham mumkin bo\'lgan hodisalar qanday hodisalar deyiladi?', {
    A: 'Tasodifiy',
    B: "Mumkin bo'lmagan",
    C: 'Muqarrar',
    D: 'Foydali',
  }, 'A'),

  q(27, 'Aniq integralni hisoblang: $\\int_3^5 3x^2 \\, dx$', { A: '$98$', B: '$125$', C: '$-27$', D: '$-98$' }, 'A'),

  q(28, 'Matematik statistika nimani o\'rganadi?', {
    A: "Ma'lumotlarni yig'ish va tahlil qilishni",
    B: 'Algebraik tenglamalarni yechishni',
    C: 'Geometrik shakllarning asosiy xossalarini',
    D: 'Funksiyalarni tekshirishni',
  }, 'A'),

  q(29, 'Aniq integralni hisoblang: $\\int_{-2}^2 4x^3 \\, dx$', { A: '$0$', B: '$16$', C: '$32$', D: '$-16$' }, 'A'),

  q(30, 'O\'rtacha arifmetik qiymat qanday topiladi?', {
    A: 'Barcha qiymatlar yig\'indisini ularning soniga bo\'lish orqali',
    B: 'Barcha qiymatlar ichidan eng katta natural sonni tanlash orqali',
    C: 'Barcha qiymatlar ichidan eng kichik natural sonni tanlash orqali',
    D: 'Barcha qiymatlar ichidan eng katta va eng kichigini tanlash orqali',
  }, 'A'),

  q(31, 'Aniq integralni hisoblang: $\\int_{-5}^5 4x^3 \\, dx$', { A: '$0$', B: '$625$', C: '$-625$', D: '$1250$' }, 'A'),
  q(32, 'Dispersiya nimani bildiradi?', {
    A: "Ma'lumotlarni tarqalish darajasini bildiradi",
    B: "Ma'lumotlarni saqlash darajasini bildiradi",
    C: "Ma'lumotlarni yig'ish darajasini bildiradi",
    D: "Ma'lumotlarni takrorlash darajasini bildiradi",
  }, 'A'),

  q(33, 'Aniq integralni hisoblang: $\\int_{-8}^8 5x^7 \\, dx$', { A: '$0$', B: '$8$', C: '$-8$', D: '$12$' }, 'A'),
  q(34, 'Statistik jadval nima uchun tuziladi?', {
    A: "Ma'lumotlarni tartibga solish uchun",
    B: "Ma'lumotlarni formula orqali ifodalash uchun",
    C: "Ma'lumotlar ustida amallar bajarish",
    D: 'Ma\'lumotlar diagramma orqali ifodalash',
  }, 'A'),

  q(35, 'Aniq integralni hisoblang: $\\int_{-9}^9 100x^{99} \\, dx$', { A: '$0$', B: '$100$', C: '$-100$', D: '$125$' }, 'A'),
  q(36, 'Statistik xulosa nima asosida chiqariladi?', {
    A: "Olingan ma'lumotlar tahlili asosida",
    B: 'Olingan tahminlar asosida',
    C: 'Berilgan grafik rangiga qarab',
    D: 'Berilgan sonlarning uzunligiga qarab',
  }, 'A'),

  q(37, 'Aniq integralni hisoblang: $\\int_{-3}^3 80x^{79} \\, dx$', { A: '$0$', B: '$80$', C: '$-80$', D: '$12$' }, 'A'),
  q(38, 'Tasodifiy hodisa deb qanday hodisaga aytiladi?', {
    A: "Oldindan aniq bo'lmagan hodisaga aytiladi.",
    B: 'Doimo ro\'y beradigan hodisaga aytiladi.',
    C: "Hech qachon bo'lmaydigan hodisaga aytiladi.",
    D: 'Hodisaning sonli qiymatiga aytiladi.',
  }, 'A'),

  q(39, 'Aniq integralni hisoblang: $\\int_{-7}^7 68x^{67} \\, dx$', { A: '$0$', B: '$68$', C: '$-68$', D: '$15$' }, 'A'),
  q(40, 'Teng ehtimolli hodisalar deb qanday hodisalarga aytiladi?', {
    A: 'Bir xil ehtimollikka ega hodisalar',
    B: 'Har xil ehtimollikka ega hodisalar',
    C: "Mumkin bo'lmagan hodisalar",
    D: "Ro'y berishi mumkin bo'lgan hodisalar.",
  }, 'A'),

  (() => {
    const { options, correct } = makeOptions("$y'' - y' - 30y = 0$", [
      "$y'' + y' - 30y = 0$",
      "$y'' - y' + 30y = 0$",
      "$y' - 30y = 0$",
    ]);
    return q(41, 'Xarakteristik soni $5$ va $-6$ bo\'lgan, differensial tenglamani toping.', options, correct);
  })(),

  q(42, 'Ehtimollar nazariyasi fani nimani o\'rganadi?', {
    A: 'Tasodifiy hodisalarning ehtimolligini',
    B: 'Hodisalarning ro\'y berish darajasini',
    C: 'Hodisalarning sonli qiymatlarini',
    D: 'Elementar hodisalar ustidagi amallarni',
  }, 'A'),

  (() => {
    const { options, correct } = makeOptions("$y'' - 7y' + 12y = 0$", [
      "$y'' + 7y' + 12y = 0$",
      "$y'' - 7y' - 12y = 0$",
      "$y' - 12y = 0$",
    ]);
    return q(43, 'Xarakteristik soni $3$ va $4$ bo\'lgan, differensial tenglamani toping?', options, correct);
  })(),

  q(44, 'Tajriba nima?', {
    A: 'Hodisaning ro\'y berishini tekshirish jarayoni',
    B: 'Murakkab hodisa ustida amallar',
    C: 'Hodisalar amal qilish muddatini aniqlaydi',
    D: 'Oddiy hodisalar ustida amallar',
  }, 'A'),

  (() => {
    const { options, correct } = makeOptions("$y'' + 7y' + 12y = 0$", [
      "$y'' - 7y' + 12y = 0$",
      "$y'' + 7y' - 12y = 0$",
      "$y' + 12y = 0$",
    ]);
    return q(45, 'Xarakteristik soni $-3$ va $-4$ bo\'lgan, differensial tenglamani toping?', options, correct);
  })(),

  q(46, 'Mulohazalarning qiymati nimaga bog\'liq?', {
    A: 'Mulohazaning rost yoki yolg\'on ekanligiga',
    B: 'Gapdagi so\'zlar soniga',
    C: 'Berilgan gapning uzunligiga bog\'liq',
    D: 'Mantiqiy amallarga bog\'liq',
  }, 'A'),

  q(47, '$C_5^2$ ni hisoblang?', { A: '$12$', B: '$15$', C: '$10$', D: '$8$' }, 'C'),
  q(48, 'Differensial tenglama deb, qanday tenglamaga aytiladi?', {
    A: 'Hosilani o\'z ichiga olgan tenglamaga',
    B: 'Barcha chiziqli tenglamalarga',
    C: 'Barcha irratsional tenglamalarga',
    D: 'Logarifmik va trigonometrik tenglamalarga',
  }, 'A'),

  q(49, '$P_3$ ni hisoblang?', { A: '$3$', B: '$4$', C: '$5$', D: '$6$' }, 'D'),
  q(50, 'Hodisalar necha xil bo\'ladi?', { A: '$3$', B: '$2$', C: '$4$', D: '$5$' }, 'A'),
  q(51, '$C_6^2$ ni hisoblang?', { A: '$60$', B: '$24$', C: '$15$', D: '$36$' }, 'C'),
  q(52, 'Muqarrar hodisaning ehtimoli nimaga teng?', { A: '$1$', B: '$0{,}5$', C: '$0$', D: '$0{,}1$' }, 'A'),
  q(53, '$C_8^2$ ni hisoblang?', { A: '$8$', B: '$7$', C: '$28$', D: '$48$' }, 'C'),
  q(54, "Mumkin bo'lmagan hodisaning ehtimoli nimaga teng?", { A: '$0$', B: '$0{,}5$', C: '$1$', D: '$0{,}1$' }, 'A'),
  q(55, '$C_5^4$ ni hisoblang?', { A: '$5$', B: '$10$', C: '$20$', D: '$15$' }, 'A'),
  q(56, 'Hodisaning ehtimoli qaysi oraliqda o\'zgaradi?', { A: '$[0;1]$', B: '$(0;1)$', C: '$[0;1)$', D: '$(0;1]$' }, 'A'),
  q(57, '$C_5^2 + C_4^2$ ni hisoblang?', { A: '$16$', B: '$11$', C: '$9$', D: '$20$' }, 'A'),
  q(58, 'Beshta talabadan uchtasini necha xil usulda tanlash mumkin?', { A: '$10$', B: '$5$', C: '$2$', D: '$12$' }, 'A'),
  q(59, '$C_9^2$ ni hisoblang?', { A: '$36$', B: '$18$', C: '$80$', D: '$40$' }, 'A'),
  q(60, 'Dars jadvaliga to\'rt xil darsni necha xil usulda joylashtirish mumkin?', { A: '$24$', B: '$12$', C: '$4$', D: '$6$' }, 'A'),
  q(61, '$C_{10}^2$ ni hisoblang?', { A: '$10$', B: '$19$', C: '$90$', D: '$45$' }, 'D'),
  q(62, 'Tanga ikki marta tashlanganda bir marta gerbli tomon tushish ehtimolini toping?', { A: '$0{,}5$', B: '$1$', C: '$0{,}25$', D: '$0$' }, 'A'),
  q(63, '$C_8^3$ ni hisoblang?', { A: '$56$', B: '$13$', C: '$40$', D: '$3$' }, 'A'),
  q(64, 'Tanga uch marta tashlanganda ikki marta gerbli tomon tushish ehtimolini toping?', { A: '$\\frac{2}{3}$', B: '$0{,}375$', C: '$0{,}25$', D: '$1$' }, 'B'),
  q(65, '$C_6^3$ ni hisoblang?', { A: '$20$', B: '$16$', C: '$8$', D: '$64$' }, 'A'),
  q(66, 'Ikkita o\'yin soqqasi tashlanganda tushgan ochkolar ko\'paytmasi juft bo\'lish ehtimolini toping?', { A: '$0{,}75$', B: '$0{,}5$', C: '$0{,}25$', D: '$1$' }, 'A'),
  q(67, '$C_9^3$ ni hisoblang?', { A: '$84$', B: '$18$', C: '$2$', D: '$64$' }, 'A'),
  q(68, 'Ikkita o\'yin soqqasi tashlanganda tushgan ochkolar yig\'indisi yettiga teng bo\'lish ehtimolini toping?', {
    A: '$\\frac{1}{6}$',
    B: '$\\frac{1}{3}$',
    C: '$\\frac{5}{36}$',
    D: '$\\frac{7}{36}$',
  }, 'A'),
  q(69, '$C_{10}^3$ ni hisoblang?', { A: '$120$', B: '$100$', C: '$12$', D: '$20$' }, 'A'),
  q(70, 'Qutida $10$ ta oq va $5$ ta qora bir xil sharlar bor. Tavakkaliga olingan ikkita sharning ham qora bo\'lish ehtimolini toping?', {
    A: '$\\frac{2}{21}$',
    B: '$\\frac{1}{3}$',
    C: '$\\frac{1}{2}$',
    D: '$\\frac{2}{3}$',
  }, 'A'),
  q(71, 'Tasodifiy miqdorlar necha xil bo\'ladi?', { A: '$2$ xil, diskret va uzluksiz', B: '$3$', C: '$4$', D: '$1$' }, 'A'),
  q(72, 'Qutida $6$ ta oq va $4$ ta ko\'k bir xil sharlar bor. Tavakkaliga olingan ikkita sharning har xil rangli bo\'lish ehtimolini toping?', {
    A: '$\\frac{8}{15}$',
    B: '$\\frac{1}{2}$',
    C: '$0{,}4$',
    D: '$0{,}6$',
  }, 'A'),
  q(73, 'Oliy matematika fani qaysi bo\'limlarni o\'z ichiga oladi?', {
    A: 'Matematik analiz, analitik geometriya, chiziqli algebra, to\'plamlar nazariyasi, ehtimollar nazariyasi va matematik statistika',
    B: 'Matematik analiz, stereometriya, matematik statistika',
    C: 'Matematik analiz, geometriya, trigonometriya, matematik statistika',
    D: 'Matematik analiz, algebra, geometriya, planimetriya',
  }, 'A'),
  q(74, 'Tasodifiy miqdorning qabul qiladigan qiymatlari va mos ehtimollari orasidagi bog\'lanishga nima deyiladi?', {
    A: 'Taqsimot qonuni',
    B: 'Berilish usullari',
    C: 'Taqsimot funksiyasi',
    D: 'Zichlik funksiyasi',
  }, 'A'),
  q(75, 'Qutida $6$ ta oq, $10$ ta qizil va $4$ ta ko\'k bir xil sharlar bor. Tavakkaliga olingan uchta sharning har xil rangli bo\'lish ehtimolini toping?', {
    A: '$\\frac{4}{19}$',
    B: '$0{,}2$',
    C: '$\\frac{5}{19}$',
    D: '$0{,}5$',
  }, 'A'),
  q(76, 'Tasodifiy miqdorning qabul qiladigan qiymatlari va mos ehtimollari ko\'paytmalari yig\'indisiga nima deyiladi?', {
    A: 'Matematik kutilma',
    B: 'Dispersiya',
    C: 'Chetlanish',
    D: 'Taqsimot funksiyasi',
  }, 'A'),
  q(77, 'Qarama-qarshi hodisalar yig\'indisining ehtimoli nimaga teng?', { A: '$1$', B: '$2$', C: '$0{,}5$', D: '$0{,}8$' }, 'A'),
  q(78, 'Qarama-qarshi hodisalarning yig\'indisi qanaqa hodisa bo\'ladi?', {
    A: 'Muqarrar',
    B: 'Tasodifiy',
    C: "Mumkin bo'lmagan",
    D: 'Erkli hodisa',
  }, 'A'),
  q(79, 'Qutida $6$ ta oq, $10$ ta qizil va $4$ ta ko\'k bir xil sharlar bor. Tavakkaliga olingan uchta sharning birinchisi oq, ikkinchisi qizil va uchinchisi ko\'k rangli bo\'lish ehtimolini toping?', {
    A: '$\\frac{2}{57}$',
    B: '$\\frac{2}{19}$',
    C: '$\\frac{4}{57}$',
    D: '$\\frac{1}{19}$',
  }, 'A'),
  q(80, 'Tasodifiy miqdor chetlanishi kvadratining matematik kutilmasiga tasodifiy miqdorning nimasi deyiladi?', {
    A: 'Dispersiyasi',
    B: 'Chetlanishi',
    C: 'Matematik kutilmasi',
    D: 'Taqsimot funksiyasi',
  }, 'A'),
  q(81, 'Tasodifiy miqdorning taqsimot qonuni necha xil usulda beriladi?', { A: '$3$', B: '$1$', C: '$2$', D: '$4$' }, 'A'),
  q(82, '$(a;b)$ oraliqda tekis taqsimlangan tasodifiy miqdorning dispersiyasi nimaga teng?', {
    A: '$\\frac{(b-a)^2}{12}$',
    B: '$\\frac{a-b}{12}$',
    C: '$\\frac{(a-b)^2}{2}$',
    D: '$\\frac{(a-b)^3}{12}$',
  }, 'A'),
  q(83, 'O\'zgarmas miqdorning matematik kutilmasi nimaga teng?', {
    A: "o'zgarmasning o'ziga teng",
    B: 'Nolga teng',
    C: 'Birga teng',
    D: 'Aniqlab bo\'lmaydi',
  }, 'A'),
  q(84, 'O\'zgarmas miqdorning dispersiyasi nimaga teng?', { A: 'Nolga teng', B: 'Birga teng', C: "o'zgarmasning o'ziga teng", D: 'Aniqlab bo\'lmaydi' }, 'A'),
  q(85, 'Ikkita bog\'liqmas tasodifiy miqdorlar ayirmasining dispersiyasi nimaga teng?', {
    A: 'Ularning dispersiyalari yig\'indisiga',
    B: 'Ularning dispersiyalari ayirmasiga',
    C: 'Ularning dispersiyalari ko\'paytmasiga',
    D: 'Ularning dispersiyalari bo\'linmasiga',
  }, 'A'),
  q(86, 'O\'zgarmas ko\'paytuvchini matematik kutilma belgisidan tashqariga qanday chiqarish mumkin?', {
    A: 'Shu o\'zgarmasni ko\'paytma qilib',
    B: 'Shu o\'zgarmasni yig\'indi qilib',
    C: 'Shu o\'zgarmasning kvadratini ko\'paytma qilib',
    D: 'Shu o\'zgarmasning kvadratini yig\'indi qilib',
  }, 'A'),
  q(87, 'O\'zgarmas ko\'paytuvchini dispersiya belgisidan tashqariga qanday chiqarish mumkin?', {
    A: 'Shu o\'zgarmasning kvadratini ko\'paytma qilib',
    B: 'Shu o\'zgarmasni yig\'indi qilib',
    C: 'Shu o\'zgarmasni ko\'paytma qilib',
    D: 'Shu o\'zgarmasning kvadratini yig\'indi qilib',
  }, 'A'),
  q(88, 'Binomial taqsimlangan tasodifiy miqdor nimani bildiradi?', {
    A: '$n$ ta tajribada hodisa sodir bo\'lishlar sonini',
    B: '$n$ ta tajriba o\'tkazishda haroratni',
    C: 'tasodifiy miqdorlar uzunligini',
    D: 'tajribadagi tasodifiy miqdorlarning og\'irligini',
  }, 'A'),
  q(89, 'Binomial taqsimotda $n$ nimani bildiradi?', {
    A: 'Tajribalar sonini',
    B: 'Hodisaning ehtimoli',
    C: 'Natijalar sonini',
    D: 'Qiymatlar yig\'indisini',
  }, 'A'),
  (() => {
    const { options, correct } = makeOptions('$np$', ['$nq$', '$n+p$', '$p^n$']);
    return q(90, 'Binomial taqsimlangan tasodifiy miqdorning matematik kutilmasi nimaga teng?', options, correct);
  })(),
  q(91, 'Binomial taqsimotda $p$ nimani bildiradi?', {
    A: 'Hodisaning ehtimolini',
    B: 'Tajribalar sonini',
    C: 'Natijalar yig\'indisini',
    D: 'Diskret sonni',
  }, 'A'),
  q(92, 'Binomial taqsimot qaysi fan bo\'limiga kiradi?', {
    A: 'Ehtimollar nazariyasi',
    B: 'Matematik statistika',
    C: 'Trigonometriya',
    D: 'Matematik mantiq',
  }, 'A'),
  (() => {
    const { options, correct } = makeOptions('$npq$', ['$np$', '$n^2pq$', '$pq$']);
    return q(93, 'Binomial taqsimlangan tasodifiy miqdorning dispersiyasi nimaga teng?', options, correct);
  })(),
  q(94, 'O\'yin soqqasi tashlanganda tushgan ochkoning qiymatidan iborat tasodifiy miqdorning matematik kutilmasini toping?', {
    A: '$3{,}5$',
    B: '$6$',
    C: '$1$',
    D: '$2{,}5$',
  }, 'A'),
  q(95, 'Ikki mergan nishonga qarata bir martadan o\'q otdi. Merganlardan birining o\'qni nishonga tekkazish ehtimoli $0{,}6$ ga, ikkinchisi uchun bu ehtimoli $0{,}7$ ga teng. Faqat bitta merganning o\'qi nishonga tegish ehtimolini toping?', {
    A: '$0{,}46$',
    B: '$0{,}65$',
    C: '$0{,}1$',
    D: '$0{,}8$',
  }, 'A'),
  q(96, 'Dispersiya nimani bildiradi?', {
    A: "Ma'lumotlarni tarqalish darajasini",
    B: "Ma'lumotlarni saqlash darajasini",
    C: "Ma'lumotlarni yig'ish darajasini",
    D: "Ma'lumotlarni takrorlash darajasini",
  }, 'A'),
  q(97, 'Dispersiya qanday qiymatlar qabul qiladi?', { A: 'Nomanfiy', B: 'Nomusbat', C: 'Manfiy', D: 'Musbat' }, 'A'),
  q(98, 'Matematik kutilma qanday qiymatlar qabul qiladi?', { A: 'Ixtiyoriy', B: 'Nomusbat', C: 'Manfiy', D: 'Musbat' }, 'A'),
  q(99, '$n=10$, $p=0{,}4$ bo\'lsa, matematik kutilma nechaga teng bo\'ladi?', { A: '$4$', B: '$5$', C: '$6$', D: '$3$' }, 'A'),
  q(100, 'Ehtimolning klassik ta\'rifi:', {
    A: "hodisaning ehtimoli deb, unga sharoit yaratuvchi hodisalar sonini hamma mumkin bo'lgan elementar hodisalar soniga nisbatiga aytiladi",
    B: "hodisaning ehtimoli deb unga sharoit yaratuvchi hodisalarni xamma mumkin bo'lgan hodisalar soniga nisbatiga aytiladi",
    C: "hodisaning ehtimoli deb uning ro'y berishlar sonini sinashlar soniga nisbatiga aytiladi",
    D: "hodisaning ehtimoli deb unga sharoit yaratuvchi hodisalar sonini hamma hodisalarga nisbatiga aytiladi",
  }, 'A'),
  (() => {
    const { options, correct } = makeOptions('$C_{10}^3 = 120$', ['$P_3 = 6$', '$C_5^2 = 10$', '$2^5 = 32$']);
    return q(101, 'Quyidagilardan eng kattasi topilsin?', options, correct);
  })(),
  q(102, '$A$ va $B$ hodisalarning yig\'indisi deb nimaga aytiladi?', {
    A: "$A$ va $B$ hodisalarning yig'indisi deb, $A$ hodisa yoki $B$ hodisaning, yoki ikkala hodisaning ham ro'y berishidan iborat hodisaga aytiladi",
    B: "$A$ va $B$ hodisalarning yig'indisi deb, $A$ hodisa yoki $B$ hodisaning ro'y berishidan iborat hodisaga aytiladi",
    C: "$A$ va $B$ hodisalarning yig'indisi deb, $B$ hodisaning, yoki ikkala hodisaning ham ro'y berishidan iborat hodisaga aytiladi",
    D: "$A$ va $B$ hodisalarning yig'indisi deb, $A$ hodisa, yoki ikkala hodisaning ham ro'y berishidan iborat hodisaga aytiladi",
  }, 'A'),
  q(103, "Mumkin bo'lmagan (ishonchsiz hodisaning) hodisaning ehtimoli nima teng?", { A: '$0$', B: '$0{,}6$', C: '$0{,}3$', D: '$1$' }, 'A'),
  q(104, 'Yashikda $40$ ta shar bo\'lib, shulardan $10$ tasi ko\'k, $5$ tasi qizil, $15$ tasi qora qolganlari ranglanmagan. Tasodifiy olingan sharni rangli chiqish ehtimolini toping?', {
    A: '$0{,}75$',
    B: '$0{,}7$',
    C: '$1{,}2$',
    D: '$0{,}6$',
  }, 'A'),
  q(105, 'Yashikda $100$ ta shar bo\'lib, shulardan $50$ tasi ko\'k $15$ tasi qizil, $25$ tasi sariq. Qolganlari ranglanmagan. Tasodifiy olingan sharni rangsiz chiqish ehtimolini toping?', {
    A: '$0{,}1$',
    B: '$0{,}5$',
    C: '$0{,}4$',
    D: '$0{,}7$',
  }, 'A'),
  q(106, 'Telefonda nomer tera turib, abonent bitta raqamni esdan chiqarib qo\'ydi va uni tavakkaliga terdi. Kerakli raqam terilganlik ehtimolini toping.', {
    A: '$0{,}1$',
    B: '$0{,}3$',
    C: '$0{,}5$',
    D: '$0{,}9$',
  }, 'A'),
  q(107, 'Nishonga qarata $24$ ta o\'q uzildi, bunda ulardan $16$ tasi nishonga tekkanligi qayd qilindi. Nishonga tegishining nisbiy chastotasi topilsin?', {
    A: '$\\frac{2}{3}$',
    B: '$\\frac{1}{2}$',
    C: '$\\frac{3}{4}$',
    D: '$\\frac{5}{6}$',
  }, 'A'),
  q(108, 'O\'yin soqqasi tashlandi. Juft son tushish ehtimolini toping?', { A: '$0{,}5$', B: '$0{,}3$', C: '$0{,}21$', D: '$0{,}36$' }, 'A'),
  q(109, 'O\'yin soqqasi tashlandi. Toq son tushish ehtimolini toping.', { A: '$0{,}5$', B: '$0{,}2$', C: '$0{,}3$', D: '$0{,}4$' }, 'A'),
  q(110, 'Qur\'a tashlashda ishtirokchilar yashikdan $1$ dan $100$ gacha nomerlangan jeton oldilar. Tavakkaliga olingan birinchi jetonning nomerida $7$ raqami uchramaslik ehtimolini toping?', {
    A: '$P=0{,}81$',
    B: '$P=0{,}79$',
    C: '$P=0{,}64$',
    D: '$P=0{,}82$',
  }, 'A'),
  q(111, 'Qur\'a tashlashda ishtirokchilar yashikdan $1$ dan $100$ gacha nomerlangan jeton oldilar. Tavakkaliga olingan birinchi jetonning nomerida $7$ raqami bo\'lish ehtimolini toping?', {
    A: '$P=0{,}19$',
    B: '$P=0{,}81$',
    C: '$P=0{,}64$',
    D: '$P=0{,}82$',
  }, 'A'),
  q(112, 'Miltiqdan o\'q uzishda nishonga tegishini nisbiy chastotasi $0{,}85$ ga tegishli ekanligi aniqlangan. Agar jami $120$ ta o\'q uzilgan bo\'lsa, tekkan o\'qlar sonini toping?', {
    A: '$102$',
    B: '$101$',
    C: '$111$',
    D: '$103$',
  }, 'A'),
  q(113, 'Biror kunda yomg\'irli kun bo\'lish ehtimoli $0{,}8$ va qorli bo\'lish ehtimoli $0{,}6$ ga teng. Shu kuni havo ochiq bo\'lish ehtimolini toping?', {
    A: '$0{,}08$',
    B: '$0{,}92$',
    C: '$0{,}7$',
    D: '$0{,}1$',
  }, 'A'),
  q(114, 'Merganning bitta o\'q uzishda nishonga tekkizish ehtimoli $p=0{,}9$. Mergan uzgan uchta o\'qning nishonga tegish ehtimolini toping?', {
    A: '$0{,}729$',
    B: '$0{,}722$',
    C: '$0{,}731$',
    D: '$0{,}723$',
  }, 'A'),
  (() => {
    const { options, correct } = makeOptions('$\\frac{1}{12}$', ['$\\frac{1}{6}$', '$\\frac{1}{4}$', '$\\frac{1}{2}$']);
    return q(115, 'Tanga va o\'yin soqqasi tashlangan. «Gerb tomoni tushdi» va «$6$ ochko chiqdi» hodisalarining birgalikda ro\'y berish ehtimolini toping?', options, correct);
  })(),
  q(116, 'Matematik analiz nimani o\'rganadi?', {
    A: 'Funksiyalar va ularning limitlari, hosila, integral',
    B: 'Shakllar va masofalar, sonlar, amallar va ularni qo\'llash',
    C: 'Mantiqiy munosabatlar va algebra elementlari',
    D: 'Algebra, geometriya va sonlar nazariyasi',
  }, 'A'),
  q(117, 'Uzluksiz tasodifiy miqdor deb nimaga aytiladi?', {
    A: 'Chekli yoki cheksiz oraliqdagi barcha qiymatlarni qabul qiluvchi tasodifiy miqdorlarga uzluksiz tasodifiy miqdorlar deyiladi',
    B: 'Chekli oraliqdagi qiymatlarni qabul qiluvchi tasodifiy miqdorlarga uzluksiz tasodifiy miqdorlar deyiladi',
    C: "oralig'idagi qiymatlarni qabul qiluvchi tasodifiy miqdorlarga uzluksiz tasodifiy miqdorlar deyiladi",
    D: 'Chekli yoki cheksiz oraliqdagi qiymatlarni qabul qiluvchi uzluksiz tasodifiy miqdorlar deyiladi',
  }, 'A'),
  q(118, 'Diskret tasodifiy miqdor deb nimaga aytiladi?', {
    A: 'ayrim ajralgan qiymatlarni ma\'lum ehtimollar bilan qabul qiluvchi miqdorlarga aytiladi',
    B: 'ayrim ajralgan qiymatlarni qabul qiluvchi miqdorlarga aytiladi',
    C: 'ma\'lum ehtimollar bilan qabul qiluvchi miqdorlarga aytiladi',
    D: 'ayrim ajralgan qiymatlarni bilan qabul qiluvchi miqdorlarga aytiladi',
  }, 'A'),
  (() => {
    const { options, correct } = makeOptions('$P_n(k) = C_n^k p^k q^{n-k}$', ['$P_n(k) = p^k$', '$P_n(k) = n! p^k$', '$P_n(k) = C_n^k p^n$']);
    return q(119, 'Bernulli formulasi qaysi javobda to\'g\'ri ko\'rsatilgan?', options, correct);
  })(),
  q(120, 'Matematik kutilma nima?', {
    A: 'Tasodifiy o\'zgaruvchining o\'rtacha qiymatiga aytiladi.',
    B: 'Tenglamaning ildizlarining yig\'indisining kvadratiga aytiladi.',
    C: 'Har qanday qiymat va uning ehtimolligiga aytiladi.',
    D: 'Tasodifiy hodisalarning sohalarda qo\'llanilishi',
  }, 'A'),
  q(121, 'O\'zgarmas ($c$ – o\'zgarmas) miqdorning matematik kutilmasi nimaga teng?', {
    A: "o'zgarmasning o'ziga teng",
    B: '$1$',
    C: '$0{,}0089$',
    D: '$0$',
  }, 'A'),
  q(122, '$X$ va $Y$ tasodifiy miqdorlar uchun $M(X)=4$, $M(Y)=6$ bo\'lsa, $Z=3X+2Y$ tasodifiy miqdorning matematik kutilishini toping?', {
    A: '$24$',
    B: '$20$',
    C: '$25$',
    D: '$32$',
  }, 'A'),
  q(123, 'Agar $2, 3, 4$ variantalar berilgan bo\'lsa, kuzatish natijalarining o\'rta qiymatini toping?', { A: '$3$', B: '$2$', C: '$2{,}5$', D: '$4$' }, 'A'),
  q(124, 'Agar $1, 2, 3, 4$ variantalar berilgan bo\'lsa, uning o\'rta qiymatini toping?', { A: '$2{,}5$', B: '$2$', C: '$3$', D: '$4$' }, 'A'),
  q(125, 'Matematik statistika fanida moda tushunchasi nimani bildiradi?', {
    A: 'Eng ko\'p takrorlangan qiymatni bildiradi',
    B: 'Eng kam takrorlangan qiymatni bildiradi',
    C: 'Berilganlar ichidan eng kichik sonni bildiradi.',
    D: 'Berilganlar sonlarning o\'rtacha qiymatini bildiradi.',
  }, 'A'),
  q(126, 'Berilgan tanlanmaning modasini toping: $5, 6, 5, 7, 8, 5$.', { A: '$5$', B: '$6$', C: '$7$', D: '$8$' }, 'A'),
  q(127, 'Ushbu, $A = \\{2\\}$ mulohazaning mantiqiy qiymatini toping?', { A: 'rost', B: 'yolg\'on', C: 'aniqmas', D: 'mulohazalar ustida bunday amal aniqlanmagan' }, 'A'),
  q(128, 'To\'plamlarning quvvati deb, nimaga aytiladi?', {
    A: 'To\'plamning elementlari soniga',
    B: 'Bir xil elementlardan tashkil topgan to\'plamga',
    C: 'Elementlarining xossalari bilan berilgan to\'plamga',
    D: 'Natural sonlar to\'plamiga aytiladi.',
  }, 'A'),
  q(129, 'Mulohaza deb nimaga aytiladi?', {
    A: 'Rost yoki yolg\'onligi bir qiymatli aniqlanadigan darak gapga mulohaza deyiladi.',
    B: 'Ixtiyoriy buyruq gapga mulohaza deyiladi.',
    C: 'Rostligi bir qiymatli aniqlanadigan darak gapga aytiladi.',
    D: 'Yolg\'onligi bir qiymatli aniqlanadigan darak gapga aytiladi.',
  }, 'A'),
  q(130, 'Agar $A$ mulohaza rost va $B$ mulohaza yolg\'on bo\'lsa, bu mulohazalarning dizyunksiyasi qanday mulohaza bo\'ladi?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(131, 'Agar $A$ mulohaza rost va $B$ mulohaza yolg\'on bo\'lsa, bu mulohazalarning konyunksiyasi qanday mulohaza bo\'ladi?', {
    A: 'yolg\'on',
    B: 'rost',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(132, 'Agar $A$ mulohaza rost va $B$ mulohaza yolg\'on bo\'lsa, bu mulohazalarning implikatsiyasi qanday mulohaza bo\'ladi?', {
    A: 'yolg\'on',
    B: 'rost',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(133, 'Agar $A$ mulohaza rost va $B$ mulohaza yolg\'on bo\'lsa, bu mulohazalarning ekvivalentsiyasi qanday mulohaza bo\'ladi?', {
    A: 'yolg\'on',
    B: 'rost',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(134, 'Agar $A$ mulohaza yolg\'on va $B$ mulohaza yolg\'on bo\'lsa, bu mulohazalarning ekvivalentsiyasi qanday mulohaza bo\'ladi?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(135, 'Ushbu, $\\{1,2,3\\} \\subset \\{1,2,3,4\\}$ mulohazaning mantiqiy qiymatini toping?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(136, 'Ushbu, $2\\cdot 2 = 4$ va $3+3=7$ mulohazalar dizyunksiyasining mantiqiy qiymatini toping?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(137, 'Ushbu, $2\\cdot 2 = 4$ va $3+3=7$ mulohazalar implikatsiyasining mantiqiy qiymatini toping?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'A'),
  q(138, 'Ushbu, $2\\cdot 2 = 4$ va $3+3=7$ mulohazalar ekvivalentsiyasining mantiqiy qiymatini toping?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'B'),
  q(139, 'Mulohazalarning qiymati nimaga bog\'liq?', {
    A: 'Mulohazaning rost yoki yolg\'on ekanligiga',
    B: 'Gapdagi so\'zlar soniga',
    C: 'Berilgan gapning uzunligiga bog\'liq',
    D: 'mantiqiy amallarga bog\'liq',
  }, 'A'),
  q(140, 'Ushbu, $7\\in \\{1,2,3,4,5,6\\}$ mulohazaning mantiqiy qiymatini toping?', {
    A: 'rost',
    B: 'yolg\'on',
    C: 'aniqmas',
    D: 'mulohazalar ustida bunday amal aniqlanmagan',
  }, 'B'),
  q(141, 'Matematik statistika nimani o\'rganadi?', {
    A: "Ma'lumotlarni yig'ish va tahlil qilishni",
    B: 'Algebraik tenglamalarni yechishni',
    C: 'Geometrik shakllarning asosiy xossalarini',
    D: 'Funksiyalarni tekshirishni',
  }, 'A'),
  q(142, 'Chiziqli algebrada nimalar o\'rganiladi?', {
    A: 'Matritsalar, determinantlar, vektorlar',
    B: 'Funksiyalarning grafiklari va diagrammalar',
    C: 'Shakllar, masofalar va ularni uzunliklari',
    D: 'Trigonometrik tenglamalar va ularni yechish',
  }, 'A'),
  q(143, 'Statistik xulosa nima asosida chiqariladi?', {
    A: "Olingan ma'lumotlar tahlili asosida",
    B: 'Olingan tahminlar asosida',
    C: 'Berilgan grafik rangiga qarab',
    D: 'Berilgan sonlarning uzunligiga qarab',
  }, 'A'),
  q(144, "O'zgaruvchilarni ajratish usuli qaysi turga tegishli?", {
    A: 'Birinchi tartibli tenglamalarga',
    B: 'Kvadrat tenglamalarga',
    C: 'Logarifmik tenglamalarga',
    D: 'Trigonometrik tenglamalarga',
  }, 'A'),
  q(145, 'Oliy matematika qaysi fanlar uchun asos bo\'ladi?', {
    A: 'Aniq fanlar uchun',
    B: 'Gumanitar fanlar uchun',
    C: 'Biologiya va geografiya fanlari uchun',
    D: 'Chizmachilik va jismoniy tarbiya fanlari uchun',
  }, 'A'),
  q(146, 'Teng ehtimolli hodisalar deb, qanday hodisalarga aytiladi?', {
    A: 'Bir xil ehtimollikka ega hodisalar',
    B: 'Har xil ehtimollikka ega hodisalar',
    C: "Mumkin bo'lmagan hodisalarga aytiladi",
    D: "Ro'y berishi mumkin bo'lgan hodisalar.",
  }, 'A'),
  q(147, 'Ehtimollar nazariyasi fani nimani o\'rganadi?', {
    A: 'Tasodifiy hodisalarning ehtimolligini',
    B: 'Hodisalarning ro\'y berish darajasini',
    C: 'Hodisalarning sonli qiymatlarini',
    D: 'Elementar hodisalar ustidagi amallarni',
  }, 'A'),
  q(148, 'Tajriba nima?', {
    A: 'Hodisaning ro\'y berishini tekshirish jarayoni',
    B: 'Murakkab hodisa ustida amallar',
    C: 'Hodisalar amal qilish muddatini aniqlaydi',
    D: 'Oddiy hodisalar ustida amallar',
  }, 'A'),
  q(149, 'Oliy matematika fanining amaliy ahamiyati nimada?', {
    A: 'Texnika, iqtisod va tabiiy fanlarda qo\'llaniladi',
    B: 'Faqat maktab o\'quvchilari uchun kerak',
    C: 'Faqat nazariy darslar uchun qo\'llaniladi',
    D: 'Funksiya qiymatlarini o\'zgarishini hisoblash uchun qo\'llaniladi.',
  }, 'A'),
  q(150, 'Tasodifiy hodisa deb qanday hodisaga aytiladi?', {
    A: "Oldindan aniq bo'lmagan hodisaga aytiladi.",
    B: 'Doimo ro\'y beradigan hodisaga aytiladi.',
    C: "Hech qachon bo'lmaydigan hodisaga aytiladi.",
    D: 'Hodisaning sonli qiymatiga aytiladi.',
  }, 'A'),
];

/** Har savol uchun variantlarni qayta aralashtirib, correct ni yangilash */
function randomizeCorrectLetter(item) {
  const correctText = item.options[item.correct];
  const entries = Object.entries(item.options).filter(([, text]) => text && String(text).trim());
  const shuffled = shuffle(entries);
  const options = {};
  let correct = 'A';
  shuffled.forEach(([, text], i) => {
    const label = LABELS[i];
    options[label] = text;
    if (text === correctText) correct = label;
  });
  return { ...item, options, correct };
}

const questions = raw.map(randomizeCorrectLetter);

const outPath = path.join(__dirname, '..', 'data', 'oliy_matematika.js');
const content =
  'const questions = ' +
  JSON.stringify(questions, null, 2)
    .replace(/"([^"]+)":/g, (m, key) => (LABELS.includes(key) || /^\d+$/.test(key) ? m : `${key}:`))
    .replace(/"([^"]+)":/g, '"$1":') +
  ';\n\nmodule.exports = { questions };\n';

// Fix: use proper JS format with unquoted keys where possible
const lines = ['const questions = ['];
for (const item of questions) {
  lines.push('  {');
  lines.push(`    id: ${item.id},`);
  lines.push(`    question: ${JSON.stringify(item.question)},`);
  lines.push('    options: {');
  for (const L of LABELS) {
    if (item.options[L]) lines.push(`      ${L}: ${JSON.stringify(item.options[L])},`);
  }
  lines.push('    },');
  lines.push(`    correct: ${JSON.stringify(item.correct)},`);
  lines.push('  },');
}
lines.push('];', '', 'module.exports = { questions };', '');

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Yozildi: ${outPath} (${questions.length} ta savol)`);

const dist = { A: 0, B: 0, C: 0, D: 0 };
questions.forEach((x) => dist[x.correct]++);
console.log('To\'g\'ri javoblar taqsimoti:', dist);
