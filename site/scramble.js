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

// ---------------------------------------------------------------- Topic 13 Q2: calcium portions to the RDA
G['13-calcium#Q2'] = () => {
  const foods = [['small cartons of yoghurt', 200, 'carton'], ['glasses of milk (125 ml)', 200, 'glass'], ['servings of canned sardines (56 g)', 200, 'serving'], ['pieces of cheddar (28 g)', 200, 'piece'], ['tubs of yoghurt', 385, 'tub'], ['glasses of milk (200 ml)', 247, 'glass'], ['slices of bread', 33, 'slice']];
  const [name, per, unit] = pick(foods);
  const who = pick([['a 16-year-old', 1200], ['an adult', 800], ['a pregnant woman', 1200], ['a breastfeeding mother', 1200], ['an 8-year-old', 800], ['a 14-year-old', 1200]]);
  const other = who[1] === 1200 ? ['an adult', 800] : ['a teenager', 1200];
  const n1 = Math.ceil(who[1] / per), n2 = Math.ceil(other[1] / per);
  return {
    q: `${who[0][0].toUpperCase() + who[0].slice(1)} wants to meet their calcium RDA from one food. One ${unit} gives about ${per} mg calcium.\n\n1. How many ${name} would they need in a day?\n2. How many would ${other[0]} need?`,
    answers: [abs(`1. ${unit}s`, n1, '', 0.5), abs(`2. ${unit}s`, n2, '', 0.5)],
    steps: [
      `**Step 1: the RDAs**\n\n${who[0]}: ${who[1]} mg. ${other[0]}: ${other[1]} mg.\n\nAdults 800 mg; 11–17 years, pregnancy and lactation 1200 mg.\n\nFrom: §2`,
      `**Step 2: divide and round up**\n\n${who[1]} ÷ ${per} = ${f(who[1] / per)} → **${n1}** ${unit}s\n\n${other[1]} ÷ ${per} = ${f(other[1] / per)} → **${n2}** ${unit}s\n\nFrom: §2, Equation 1`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 15 Q2: iron portions to the PRI
G['15-iron#Q2'] = () => {
  const foods = [['lean beef', 3.1, '120 g', 'haem'], ['lamb chop', 2.3, '120 g', 'haem'], ['salmon', 1.4, '170 g', 'haem'], ['chicken breast', 0.8, '130 g', 'haem'], ['baked beans', 2.1, '150 g', 'non-haem'], ['spinach', 1.8, '90 g', 'non-haem'], ['boiled egg', 1.0, '50 g', 'non-haem'], ['wholemeal bread', 0.9, '32 g', 'non-haem']];
  const a = pick(foods); let b = pick(foods); while (b === a) b = pick(foods);
  const sex = pick(['woman', 'man']); const pri = sex === 'woman' ? 16 : 11;
  const n1 = Math.ceil(pri / a[1]), n2 = Math.ceil(pri / b[1]);
  return {
    q: `A ${sex} needs ${pri} mg iron a day (EFSA PRI). ${a[0][0].toUpperCase() + a[0].slice(1)} gives ${a[1]} mg per ${a[2]} portion. ${b[0][0].toUpperCase() + b[0].slice(1)} gives ${b[1]} mg per ${b[2]}.\n\n1. How many portions of ${a[0]} would reach the PRI?\n2. How many portions of ${b[0]}?\n3. Which food's iron is better absorbed, and why?`,
    answers: [abs(`1. portions of ${a[0]}`, n1, '', 0.5), abs(`2. portions of ${b[0]}`, n2, '', 0.5)],
    steps: [
      `**Step 1: ${a[0]}**\n\n${pri} ÷ ${a[1]} = ${f(pri / a[1])} → **${n1}** portions\n\nFrom: §2, Equation 1`,
      `**Step 2: ${b[0]}**\n\n${pri} ÷ ${b[1]} = ${f(pri / b[1])} → **${n2}** portions`,
      `**Step 3: absorption**\n\n${a[0]} is ${a[3]} iron, ${b[0]} is ${b[3]} iron.\n\n${a[3] === b[3] ? `Both are ${a[3]}, so absorption is similar (${a[3] === 'haem' ? '15–30%' : '1–20%, and strongly affected by tea, phytate, calcium and vitamin C'}).` : `${a[3] === 'haem' ? a[0] : b[0]} is better absorbed: haem iron 15–30% via HCP1, against 1–20% for non-haem iron, which is blocked by tea, phytate and calcium.`}\n\nFrom: §2, §4, §5`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 19 Q2: sodium from salt
G['19-electrolytes#Q2'] = () => {
  const target = pick([6, 6, 6, 4, 3, 2]); const who = target === 6 ? 'adults' : target === 4 ? 'the RDA' : target === 3 ? '4–6 year olds' : '1–3 year olds';
  const s1 = pick([0.3, 0.5, 0.6, 0.8, 1.0, 1.2]), s2 = pick([1.5, 1.8, 2.0, 2.5, 3.0]);
  const lab = pick([0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0]);
  const item1 = pick(['a packet of crisps', 'a slice of ham', 'a portion of chips', 'a bowl of cereal']), item2 = pick(['a ready meal', 'a takeaway curry', 'a frozen pizza', 'a tin of soup']);
  return {
    q: `The Irish salt target for ${who} is ${target} g a day. ${item1[0].toUpperCase() + item1.slice(1)} contains ${s1} g salt and ${item2} contains ${s2} g salt.\n\n1. How much sodium is in the target?\n2. How much sodium is in the two foods together?\n3. A food label says ${lab} g sodium. How much salt is that?`,
    answers: [abs('1. g sodium', 0.4 * target, 'g', 0.05), abs('2. g sodium', 0.4 * (s1 + s2), 'g', 0.05), abs('3. g salt', lab / 0.4, 'g', 0.1)],
    steps: [
      `**Step 1: the rule**\n\nSodium = 0.4 × salt. Salt = sodium ÷ 0.4.\n\nFrom: §3, Equation 1`,
      `**Step 2: the target**\n\n${target} × 0.4 = **${r2(0.4 * target)} g sodium**`,
      `**Step 3: the foods**\n\n${s1} + ${s2} = ${r2(s1 + s2)} g salt. ${r2(s1 + s2)} × 0.4 = **${r2(0.4 * (s1 + s2))} g sodium**`,
      `**Step 4: the label**\n\n${lab} ÷ 0.4 = **${r2(lab / 0.4)} g salt**`,
    ],
  };
};

// ---------------------------------------------------------------- Topic 20 Q2: label maths with the 2.54 rule
G['20-salt-and-health#Q2'] = () => {
  const na = pick([0.6, 0.8, 0.9, 1.0, 1.1, 1.3, 1.5, 1.8]);
  const salt = pick([7, 8.5, 9, 10, 11, 12]);
  const mg = pick([900, 1200, 1500, 1800, 2000, 2500]);
  const item = pick(['A ready meal', 'A tin of soup', 'A frozen pizza', 'A sandwich']);
  const person = pick(['A woman', 'A man', 'A student', 'An office worker']);
  const thing = pick(['the ham and cheese sandwich', 'a Caesar salad with bacon', 'a portion of fish and chips', 'two slices of bread with butter']);
  return {
    q: `1. ${item} label says ${na} g sodium per pack. How much salt is that, and what fraction of the 6 g target?\n\n2. ${person} eats ${salt} g salt a day. How much sodium is that?\n\n3. ${thing[0].toUpperCase() + thing.slice(1)} carries ${f(mg)} mg sodium. How much salt is that?`,
    answers: [abs('1. g salt', 2.54 * na, 'g', 0.1), abs('1. fraction of target', 2.54 * na / 6, '', 0.03), abs('2. g sodium', 0.4 * salt, 'g', 0.1), abs('3. g salt', 2.54 * mg / 1000, 'g', 0.1)],
    steps: [
      `**Step 1: the rules**\n\nSalt = 2.54 × sodium. Sodium = 0.4 × salt.\n\nFrom: §2, Equation 1`,
      `**Step 2: the label**\n\n${na} × 2.54 = **${r2(2.54 * na)} g salt**\n\n${r2(2.54 * na)} ÷ 6 = **${r2(2.54 * na / 6)}** of the day's target.`,
      `**Step 3: the person**\n\n${salt} × 0.4 = **${r2(0.4 * salt)} g sodium**\n\nThe target is 2.4 g sodium.`,
      `**Step 4: the item**\n\n${f(mg)} mg = ${r2(mg / 1000)} g sodium. ${r2(mg / 1000)} × 2.54 = **${r2(2.54 * mg / 1000)} g salt**\n\nFrom: §7`,
    ],
  };
};

window.SCRAMBLE = G;
window.SCRAMBLE_FMT = f;
})();
