
# ZRE DEMO

**Live site:** https://nam-chu-2.github.io/zre-demo/

## Background
- This is a demo to for Zappavigna Real Estate (ZRE) that demostrates the far-reaching power, and utility of large-language model powered tools. 
- Who is ZRE: ZRE is a private real estate investment firm in Ottawa. As part of their portfolio, ZRE owns several real estate properties in the Ottawa region and are looking to expand their real estate footprint in the coming years. 

## Objective
- ZRE is a paper-first company, relying on traditional methods such as trial-and-error, and word-of-mouth. Currently, they do not have any digital infrastructure that models or predicts the best course of action. 
- ZRE makes three decisions that can be aided with data:
  - buying a house, 
  - selling a house, 
  - renting property
- As proof of concept, this demo will demonstrate what an AI-first / AI-aided digital infrastructure can do in terms of helping them wiht thie decision-making. 

## Scope
- remake the investment calculator, and make it dynamic. 
- include a website, and deploy it for zre to see
- set the stage for the scope of these tools through easy-to-understand visual and graphics

---

## What was built

A single-page, client-side React app (no backend — all math runs in the browser):

1. **Hero** — the pitch in one picture: ZRE's own "Zapp's Number Checker v2.0"
   spreadsheet (277 Stoneway Drive) redrawn as a paper ledger flowing into a live
   decision panel.
2. **The three decisions** — Buy / Sell / Rent cards framing what data can inform
   each call and what paper methods can't do.
3. **The calculator** — tabbed Buy | Sell | Rent, every output updating live:
   - **Buy** loads pre-filled with the exact 277 Stoneway numbers and reproduces
     the spreadsheet to the cent ($1,645.93 payment, $267.99/mo net). Adds cap
     rate, cash-on-cash, break-even rent, a 10-year equity vs cash-flow
     projection, and a mortgage-rate sensitivity chart (±2 pts).
   - **Sell** — net proceeds with Canadian 50%-inclusion capital-gains treatment,
     total & annualized return, sell-now vs hold-5-years comparison.
   - **Rent** — suggested rent range from 8 Ottawa neighbourhood benchmarks
     (demo seed data), with driver breakdown and revenue at 2/5/8% vacancy.
4. **Roadmap** — Phase 1 (this demo) → rent prediction → vacancy & appreciation
   forecasts → portfolio Monte Carlo.

### Structure

```
src/
  components/   UI sections, calculator tabs, charts
  lib/          calculation engine — pure functions, JSDoc'd formulas, unit tests
  data/         typed demo seed data (Ottawa neighbourhood benchmark rents)
resources/      the original Number_Checker_ZRE.xlsx this demo replicates
```

### Develop

```bash
npm install
npm run dev       # local dev server
npm test          # unit tests (mortgage payment, cap rate, net proceeds, …)
npm run build     # production build to dist/
```

### Deploy

Hosted on GitHub Pages from the `gh-pages` branch:

```bash
npm run build && npx gh-pages -d dist
```
