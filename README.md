# Palette

**Colour conversion, tint ramps and WCAG contrast — all arithmetic local.**

**[Live: https://quantumcoder-14.github.io/palette/](https://quantumcoder-14.github.io/palette/)** — nothing to install.

One self-contained `index.html`. No build step, no framework, no dependencies to install.

## What it does

- **Convert** between HEX, RGB and HSL, with one click to copy each format
- **Tint ramp** — nine steps from light to dark, click any swatch to load it
- **Contrast checker** — paste your text and background colours and see the live ratio with a
  preview in your actual colours
- **WCAG 2.1 verdicts** — AA and AAA for both normal and large text, each marked pass or fail

## Why the contrast maths matters

`#767676` on white looks fine to most people and passes AA at 4.54:1. `#777777` looks
identical and fails at 4.48:1. That is the whole argument for checking rather than eyeballing:
the difference is invisible and the threshold is hard.

The ratio uses the WCAG relative-luminance formula, including the 0.03928 linearisation step
that most quick implementations skip.

## Local only

No server, no analytics. The colours you type are never sent anywhere.

## Tests

```bash
node tests/test.js     # 21 assertions
```

Known conversions (red to HSL, white to HSL), luminance of black and white, the 21:1
black-on-white ratio, the WCAG thresholds at their exact boundaries, and ramp ordering.

## Run it

Open `index.html`, or host it anywhere static. To publish on GitHub Pages: **Settings →
Pages → Deploy from a branch → `main` → `/ (root)`**.

## Licence

MIT with Commons Clause. Copyright (c) 2026 Siddhant Neekhra. See [LICENSE.md](LICENSE.md).
