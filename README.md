# Financial Analysis Dashboard (Orbann_ai)

**Live app:** [stock-financial-analyzer.vercel.app](https://stock-financial-analyzer.vercel.app)

A tool for financial statement analysis: fetches a company's balance sheet,
income statement, and cash flow from Yahoo Finance, computes the key
liquidity/solvency/profitability ratios, generates an AI-written analysis
via OpenRouter, and exports everything as a Word document.

**There is no rule-based fallback.** If the OpenRouter call fails for any
reason (missing/invalid `OPENROUTER_API_KEY`, API error, network error),
`/api/analyze` returns `analysis: null` with an explicit `aiError` message
instead of generated text — so a failure can never be mistaken for a real
AI response.

This started as a **Streamlit** app and has been rebuilt as a **Next.js +
Vercel Python Serverless Functions** app so it can be deployed on Vercel.

## Why not just deploy the Streamlit app to Vercel?

Streamlit needs a long-lived stateful Python process (it reruns the whole
script and keeps `st.session_state` in memory between interactions).
Vercel only runs stateless, short-lived serverless functions — there's no
persistent process to host a Streamlit server on. So the app was split into:

- **Frontend** — a Next.js/React dashboard (`app/`) that replicates the
  original UI (ticker input, metric cards, analysis panel, DOCX download).
- **Backend** — two Python serverless functions under `api/` that do the
  actual work, reusing the original logic (now Streamlit-free) from
  `lib/finance_core.py`:
  - `GET /api/analyze?ticker=AAPL&useAi=true` — fetches data, computes
    ratios, generates the analysis, returns JSON.
  - `POST /api/report` — takes the ratios/analysis and returns a generated
    `.docx` file.

## Project structure

```
financial-analysis/
├── app/                  # Next.js frontend (App Router)
│   ├── layout.tsx
│   ├── page.tsx          # Dashboard UI
│   └── globals.css
├── components/
│   └── MetricCard.tsx
├── lib/
│   ├── finance_core.py   # Core analysis logic (Streamlit-free)
│   └── format.ts         # Client-side number/percent formatting
├── api/
│   ├── analyze.py        # Vercel Python function: fetch + compute + analyze
│   └── report.py         # Vercel Python function: build the .docx report
├── requirements.txt      # Python deps for the /api functions
└── package.json          # Node deps for the Next.js frontend
```

## Local development

You need Node.js 18+ and Python 3.9+.

1. Install frontend dependencies:
   ```bash
   npm install
   ```
2. Install the Vercel CLI (it runs both the Next.js dev server and the
   Python functions together, which plain `next dev` can't do):
   ```bash
   npm install -g vercel
   vercel dev
   ```
3. Copy `.env.example` to `.env.local` and add your OpenRouter key —
   required, since there's no fallback without it:
   ```bash
   cp .env.example .env.local
   ```
4. Open the local URL that `vercel dev` prints (defaults to
   `http://localhost:3000`).

## Deploying to Vercel

1. Push this folder to a GitHub repo (or use the one it's already in).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
   Vercel auto-detects the Next.js frontend and the Python functions in
   `api/` — no extra configuration needed.
3. In **Project Settings → Environment Variables**, add:
   - `OPENROUTER_API_KEY` — your OpenRouter API key. Required — without it,
     every analysis request returns an explicit `aiError` instead of any
     generated text.
4. Deploy. That's it — no `vercel.json` needed, Vercel picks up the
   Python runtime for `api/*.py` automatically from `requirements.txt`.

Or from the CLI, inside this folder:
```bash
vercel        # preview deploy
vercel --prod # production deploy
```

## Financial Metrics Explained

### Liquidity Ratios
- **Current Ratio**: Ability to pay short-term obligations (>2 is strong)
- **Quick Ratio**: Like current ratio but excludes inventory (>1 is healthy)
- **Cash Ratio**: Most conservative liquidity measure, cash only

### Solvency Ratios
- **Debt-to-Equity**: Company leverage (<1 is conservative)
- **Debt-to-Assets**: Percentage of assets financed by debt

### Profitability Metrics
- **ROE (Return on Equity)**: Effectiveness of using shareholder money (>15% is excellent)
- **ROA (Return on Assets)**: Efficiency of asset use
- **Net Margin**: Profit as a percentage of revenue

### Performance Metrics
- **EPS**: Earnings per share
- **Free Cash Flow**: Cash available after capital expenditures
- **Book Value per Share**: Net asset value per share

## Limitations

- Financial data depends on Yahoo Finance availability via `yahooquery`.
- Analysis is based on the most recent annual financial statements.
- Some tickers may not have complete financial data.
- OpenRouter API rate limits may apply for AI-generated analysis.

## Support

- Email: [gizhayes27@gmail.com](mailto:gizhayes27@gmail.com)
- Telegram: [Join our group](https://t.me/+0WciZpJaSOhhMmM0)

## Disclaimer

This tool is for educational and informational purposes only. It is not
financial advice. Always consult a qualified financial advisor before
making investment decisions.
