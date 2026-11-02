/* "New numbers" generators for the nutrition calculation questions.
   Each generator returns { q, answers: [{label, value, unit, tol}], steps: [markdown] }.
   Methods and constants match the worked answers in questions/*.md and notes/*.md.
   Key = "<questions file slug>#<question id>". */
(() => {
'use strict';

const pick = a => a[Math.floor(Math.random() * a.length)];
const rnd = (lo, hi, step = 1) => lo + step * Math.floor(Math.random() * ((hi - lo) / step + 1));
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;

// 1403 style, or a short decimal
function f(x, sig = 3) {
  if (x === 0) return '0';
  if (Number.isInteger(x)) return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return String(+x.toPrecision(sig));
}

const rel = (label, value, unit, r = 0.03) => ({ label, value, unit, tol: { rel: r } });
const abs = (label, value, unit, a = 0.05) => ({ label, value, unit, tol: { abs: a } });

const G = {};

// ---------------------------------------------------------------- Topic 2 Q2: retinol activity equivalents
G['02-vitamin-a#Q2'] = () => {
  const food = pick(['a bowl of mixed vegetables', 'a mango smoothie', 'a plate of carrots and peppers', 'a sweet potato dish', 'a spinach salad']);
  const beta = pick([600, 900, 1200, 1800, 2400, 3000, 3600, 4800]);
  const other = pick([0, 240, 480, 720, 960, 1200]);
  const ret = pick([0, 0, 0, 50, 75, 100, 150]);
  const sex = pick(['man', 'woman']); const rda = sex === 'man' ? 700 : 600;
  const rae = ret + beta / 12 + other / 24;
  const frac = rae / rda;
  return {
    q: `${food[0].toUpperCase() + food.slice(1)} contains ${f(beta)} µg β-carotene, ${f(other)} µg of other carotenes and ${f(ret)} µg retinol.\n\n1. How many µg RAE is that?\n2. What fraction of a ${sex}'s RDA does it cover?`,
    answers: [rel('µg RAE', rae, 'µg RAE'), rel('fraction of RDA', frac, '', 0.04)],
    steps: [
      `**Step 1: convert each part**\n\nRetinol counts 1 for 1: ${f(ret)} µg RAE\n\nβ-carotene: ${f(beta)} ÷ 12 = ${f(beta / 12)} µg RAE\n\nOther carotenes: ${f(other)} ÷ 24 = ${f(other / 24)} µg RAE\n\nFrom: §2, Equation 1`,
      `**Step 2: add up**\n\n${f(ret)} + ${f(beta / 12)} + ${f(other / 24)} = **${f(rae)} µg RAE**`,
      `**Step 3: compare with the RDA**\n\nA ${sex}'s RDA is ${rda} µg RAE.\n\n${f(rae)} ÷ ${rda} = **${f(frac, 2)}** of the RDA.\n\nFrom: §3`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 3 Q4: vitamin K adequate intake from body weight
G['03-vitamin-k#Q4'] = () => {
  const who = pick(['A woman', 'A man', 'A student', 'An older adult', 'A teenager']);
  const kg = rnd(45, 110, 1);
  return {
    q: `${who} weighs ${kg} kg.\n\nUsing the rule of thumb on the slides, what is their adequate intake of vitamin K in µg per day?\n\nIs that inside the 65–80 µg per day range given for adults?`,
    answers: [abs('AI', kg, 'µg/day', 0.5)],
    steps: [
      `**Step 1: the rule**\n\nAI = 1 µg per kg body weight per day.\n\nFrom: §6, Equation 1`,
      `**Step 2: multiply**\n\n1 × ${kg} = **${kg} µg/day**`,
      `**Step 3: compare**\n\n${kg < 65 ? `${kg} is below the 65–80 µg range. Lighter people need less, so the rule gives a lower number.` : kg > 80 ? `${kg} is above the 65–80 µg range. Heavier people need more, so the rule gives a higher number.` : `${kg} sits inside the 65–80 µg range.`}\n\nEFSA's single AI for adults is 70 µg.\n\nFrom: §6`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 4 Q3: IU and µg for vitamin D
G['04-vitamin-d#Q3'] = () => {
  const iu = pick([200, 400, 600, 800, 1000, 1200, 1600, 2000, 4000]);
  const ug = pick([5, 10, 12.5, 15, 20, 25, 50, 100]);
  const item = pick(['a supplement', 'a fortified cereal serving', 'a cod liver oil capsule', 'a fortified milk drink']);
  return {
    q: `1. ${item[0].toUpperCase() + item.slice(1)} gives ${f(iu)} IU of vitamin D. How many µg is that?\n\n2. A label says ${f(ug)} µg of vitamin D. How many IU is that?\n\n3. Does the first item meet the adult RDA of 400 IU (10 µg)?`,
    answers: [abs('1. µg', iu / 40, 'µg', 0.15), rel('2. IU', ug * 40, 'IU', 0.02)],
    steps: [
      `**Step 1: the conversion**\n\n1 µg = 40 IU. So µg = IU ÷ 40, and IU = µg × 40.\n\nFrom: §8, Equation 1`,
      `**Step 2: IU to µg**\n\n${f(iu)} ÷ 40 = **${f(iu / 40)} µg**`,
      `**Step 3: µg to IU**\n\n${f(ug)} × 40 = **${f(ug * 40)} IU**`,
      `**Step 4: compare**\n\nThe adult RDA is 400 IU = 10 µg.\n\n${f(iu)} IU ${iu >= 400 ? 'meets' : 'does not meet'} it.\n\nFrom: §8`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 5 Q2: α-tocopherol equivalents
G['05-vitamin-e#Q2'] = () => {
  const oil = pick(['sunflower oil', 'soybean oil', 'corn oil', 'a seed oil blend', 'a nut oil', 'wheat germ oil', 'rapeseed oil']);
  const a = r1(rnd(5, 60, 0.5)), b = r1(rnd(0, 60, 0.5)), g = r1(rnd(0, 30, 0.5)), t = pick([0, 0, 0, 2, 5, 10]);
  const te = a + 0.5 * b + 0.1 * g + 0.3 * t;
  return {
    q: `Per 100 g, ${oil} contains:\n\n| Vitamer | mg |\n|---|---|\n| α-tocopherol | ${a} |\n| β-tocopherol | ${b} |\n| γ-tocopherol | ${g} |\n| α-tocotrienol | ${t} |\n\nHow many mg α-tocopherol equivalents is that?`,
    answers: [rel('mg α-TE', te, 'mg', 0.02)],
    steps: [
      `**Step 1: the weights**\n\nα-TE = mg α-tocopherol + 0.5 × mg β-tocopherol + 0.1 × mg γ-tocopherol + 0.3 × mg α-tocotrienol\n\nFrom: §2, Equation 1`,
      `**Step 2: put the numbers in**\n\n${a} + (0.5 × ${b}) + (0.1 × ${g}) + (0.3 × ${t})\n\n= ${a} + ${r2(0.5 * b)} + ${r2(0.1 * g)} + ${r2(0.3 * t)}`,
      `**Step 3: add**\n\n= **${r2(te)} mg α-TE**\n\nα-tocopherol does most of the work. The other vitamers count for much less.`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 6 Q2: thiamin requirement from energy intake
G['06-thiamin#Q2'] = () => {
  const who = pick(['A student', 'An athlete', 'An office worker', 'A builder', 'A nurse']);
  const kcal = pick([1600, 1800, 2000, 2200, 2500, 2800, 3000, 3500]);
  const mj = kcal * 0.0042, lo = 0.07 * mj, hi = 0.1 * mj;
  return {
    q: `${who} eats ${f(kcal)} kcal a day.\n\n1. Convert that to MJ.\n2. Using the PRI of 0.07 to 0.1 mg per MJ, what range of thiamin do they need per day?`,
    answers: [rel('1. MJ', mj, 'MJ', 0.04), rel('2. low end', lo, 'mg', 0.05), rel('2. high end', hi, 'mg', 0.05)],
    steps: [
      `**Step 1: kcal to MJ**\n\n1 kcal ≈ 4.2 kJ = 0.0042 MJ.\n\n${f(kcal)} × 0.0042 = **${f(mj)} MJ**\n\nFrom: §3, Equation 1`,
      `**Step 2: multiply by the PRI per MJ**\n\nLow end: 0.07 × ${f(mj)} = **${f(lo, 2)} mg**\n\nHigh end: 0.1 × ${f(mj)} = **${f(hi, 2)} mg**\n\nMore energy burned means more thiamin needed, because TDP sits in the energy pathways.\n\nFrom: §3, §4`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 7 Q5: niacin equivalents
G['07-riboflavin-niacin#Q5'] = () => {
  const meal = pick(['A chicken dinner', 'A tuna salad', 'A bowl of lentils and rice', 'A cheese omelette', 'A beef stew']);
  const niacin = r1(rnd(2, 14, 0.5)), trp = pick([120, 180, 240, 300, 360, 480, 600, 720, 900]);
  const ne = niacin + trp / 60;
  return {
    q: `${meal} contains ${niacin} mg preformed niacin and ${f(trp)} mg tryptophan.\n\nHow many mg niacin equivalents (NE) does it give?`,
    answers: [rel('mg NE', ne, 'mg NE', 0.02)],
    steps: [
      `**Step 1: the rule**\n\n1 mg NE = mg preformed niacin + mg tryptophan ÷ 60.\n\nFrom: §6, Equation 1`,
      `**Step 2: convert the tryptophan**\n\n${f(trp)} ÷ 60 = ${f(trp / 60)} mg NE from tryptophan`,
      `**Step 3: add**\n\n${niacin} + ${f(trp / 60)} = **${f(ne)} mg NE**\n\nThis is why maize diets cause pellagra: maize is low in tryptophan and its niacin is bound and unavailable.\n\nFrom: §6, §8`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 11 Q3: dietary folate equivalents
G['11-folate#Q3'] = () => {
  const food = pick([180, 200, 220, 250, 280, 300]), fa = pick([0, 50, 80, 100, 120, 150, 200]);
  const dfe = food + 1.7 * fa;
  const preg = Math.random() < 0.3; const pri = preg ? 600 : 330;
  return {
    q: `In one day ${preg ? 'a pregnant woman' : 'a student'} eats ${f(food)} µg of natural food folate and ${f(fa)} µg of synthetic folic acid from fortified cereal.\n\n1. How many µg DFE is that?\n2. Does it meet the EFSA PRI of ${pri} µg/day${preg ? ' for pregnancy' : ''}?`,
    answers: [rel('µg DFE', dfe, 'µg DFE', 0.02)],
    steps: [
      `**Step 1: the rule**\n\nµg DFE = µg food folate + 1.7 × µg synthetic folic acid.\n\nFolic acid counts for more because about 100% is absorbed, against about 50% for food folate. 1 ÷ 0.6 ≈ 1.7.\n\nFrom: §3, Equation 1`,
      `**Step 2: put the numbers in**\n\n${f(food)} + 1.7 × ${f(fa)} = ${f(food)} + ${f(1.7 * fa)} = **${f(dfe)} µg DFE**`,
      `**Step 3: compare**\n\nPRI = ${pri} µg/day. ${f(dfe)} ${dfe >= pri ? 'meets it.' : 'falls short.'}${preg ? ' Pregnancy also needs a 400 µg folic acid supplement for neural tube defects.' : ''}\n\nFrom: §2, §9`,
    ],
  };
};

window.SCRAMBLE = G;
window.SCRAMBLE_FMT = f;
})();
