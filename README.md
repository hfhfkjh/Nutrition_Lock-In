# Nutrition Lock-In — HNUT10010 / HNUT10020 Human Nutrition 1

**▶ Practice site: https://hfhfkjh.github.io/Nutrition_Lock-In/** (repetition drill, self-marking MCQs, timed mock exams). It reads the `questions/` and `mock/` md files directly, so editing them updates the site.

Start at **[TOPICS.md](TOPICS.md)** (progress tracker). Cheat sheet: **[cheat-sheet.md](cheat-sheet.md)**. Every number in one place: **[numbers.md](numbers.md)**. Things that are easy to mix up: **[confusing-bits.md](confusing-bits.md)**. Mock exams: **[mock/](mock/exam-1.md)**.

Built from the lecture slides for lectures 12 to 15 (vitamins A, K, D, E and the B group). Same method as [SSD Lock-In](https://github.com/albinjoby82-ops/SSD_Lock-In).

## Reading style (dyslexia-friendly)
- One idea per line. Short sentences.
- Facts in tables, not paragraphs.
- Lots of space between sections.
- Few brackets, little italics, no long bullet points.

## How each topic is built
- `notes/NN-topic.md`: the slides that matter, as pictures, with a short explanation of each, and **🧠 check questions inline** (answer before opening).
- Every topic starts with a **⭐ vitamin card**: names, active form, sources, numbers, function, deficiency, toxicity. That card is what the MCQs test.
- `questions/NN-topic.md`: end-of-topic test with
  1. **core questions** (explain, list, calculate), answered step by step, and
  2. **exam-style questions** (multiple choice, true/false), because the exam is MCQ.
- **Every equation gets a 📐 box:** a table of every symbol, *why* it holds, **"use it when…"**, and when it does NOT apply. The calculation questions have a **🔀 New numbers** button on the site.
- **Rule:** every answer in the questions is taught in that topic's notes (or an earlier one), and the answer cites the notes section (§). Nothing appears in an answer that isn't on the slides.

## Running it locally

```
python3 -m http.server 8000
```

then open http://localhost:8000. Opening `index.html` straight from disk will not work, because the site fetches the markdown files.

## Adding a lecture

1. Put the slide PDF in the folder (PDFs are git-ignored).
2. Render the slides you want as `img/NN/sXX.jpg`.
3. Write `notes/NN-name.md` and `questions/NN-name.md` in the same format as the others.
4. Add a row to the table in `TOPICS.md` under a `## Lecture NN — name` heading. The site reads the table.
5. For a calculation question, add a generator to `site/scramble.js` keyed `"NN-name#Qn"`.
