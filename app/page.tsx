"use client";

import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import { formatNumber, formatPercentage, formatRatio } from "@/lib/format";

type Ratios = {
  "Balance Sheet Date": string;
  "Income Statement Date": string;
  "Cash Flow Date": string;
  "Current Ratio": number | null;
  "Quick Ratio": number | null;
  "Cash Ratio": number | null;
  "Debt-to-Equity Ratio": number | null;
  "Debt-to-Assets Ratio": number | null;
  "Book Value per Share (BVPS)": number | null;
  "Return on Equity (ROE)": number | null;
  "Return on Assets (ROA)": number | null;
  "Net Margin": number | null;
  EPS: number | null;
  Revenue: number | null;
  "Net Income": number | null;
  "Free Cash Flow": number | null;
};

type AnalyzeResponse = {
  ticker: string;
  ratios: Ratios;
  analysis: string | null;
  usedAi: boolean;
  aiError?: string | null;
  error?: string;
};

export default function Home() {
  const [ticker, setTicker] = useState("AAPL");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function handleAnalyze() {
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze?ticker=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!result) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: result.ticker,
          ratios: result.ratios,
          analysis: result.analysis,
        }),
      });
      if (!res.ok) throw new Error("Report generation failed.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.ticker}_Financial_Analysis.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Could not generate the report. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const r = result?.ratios;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-gray-100">Orbann_ai</h1>
        <p className="mt-1 text-sm text-gray-400">
          A comprehensive tool for financial statement analysis. Contact:{" "}
          <a className="text-accent hover:underline" href="mailto:gizhayes27@gmail.com">
            gizhayes27@gmail.com
          </a>{" "}
          · Community:{" "}
          <a className="text-accent hover:underline" href="https://t.me/+0WciZpJaSOhhMmM0" target="_blank" rel="noreferrer">
            Join our Telegram
          </a>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Left column: input parameters */}
        <aside className="md:col-span-1">
          <div className="rounded-lg border border-border bg-panel p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Input Parameters
            </h2>
            <label className="mb-1 block text-xs text-gray-400">Enter Stock Ticker</label>
            <input
              className="mb-3 w-full rounded-md border border-border bg-ink px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="AAPL"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />

            <p className="mb-3 text-xs text-gray-500">
              Analysis is always AI-generated via OpenRouter — there is no
              rule-based fallback. If the AI call fails, you'll see an
              explicit error instead of generated text.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-md bg-accent px-3 py-2 text-sm font-semibold text-ink transition hover:bg-accentDim disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>

            {error && (
              <div className="mt-3 rounded-md border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>
        </aside>

        {/* Right column: results */}
        <section className="md:col-span-3">
          {!result && !loading && (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-gray-500">
              Enter a ticker and click Analyze to fetch financial data.
            </div>
          )}

          {r && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Statement Dates
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <MetricCard label="Balance Sheet" value={String(r["Balance Sheet Date"])} />
                  <MetricCard label="Income Statement" value={String(r["Income Statement Date"])} />
                  <MetricCard label="Cash Flow" value={String(r["Cash Flow Date"])} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Financial Performance
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MetricCard label="Revenue" value={formatNumber(r.Revenue)} />
                  <MetricCard label="Net Income" value={formatNumber(r["Net Income"])} />
                  <MetricCard label="EPS" value={formatNumber(r.EPS)} />
                  <MetricCard label="Free Cash Flow" value={formatNumber(r["Free Cash Flow"])} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Profitability Metrics
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <MetricCard label="ROE" value={formatPercentage(r["Return on Equity (ROE)"])} />
                  <MetricCard label="ROA" value={formatPercentage(r["Return on Assets (ROA)"])} />
                  <MetricCard label="Net Margin" value={formatPercentage(r["Net Margin"])} />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Liquidity & Solvency
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <MetricCard label="Current Ratio" value={formatRatio(r["Current Ratio"])} />
                  <MetricCard label="Quick Ratio" value={formatRatio(r["Quick Ratio"])} />
                  <MetricCard label="Cash Ratio" value={formatRatio(r["Cash Ratio"])} />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <MetricCard label="Debt/Equity" value={formatRatio(r["Debt-to-Equity Ratio"])} />
                  <MetricCard label="Debt/Assets" value={formatRatio(r["Debt-to-Assets Ratio"])} />
                  <MetricCard label="Book Value/Share" value={formatNumber(r["Book Value per Share (BVPS)"])} />
                </div>
              </div>

              {result?.analysis && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Financial Analysis
                    </h3>
                    <span
                      className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent"
                      title="Generated by the OpenRouter AI model"
                    >
                      AI-generated
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap rounded-lg border border-border bg-panel p-4 text-sm leading-relaxed text-gray-200">
                    {result.analysis}
                  </div>
                </div>
              )}

              {result && !result.analysis && result.aiError && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Financial Analysis
                    </h3>
                    <span className="rounded-full bg-red-900/40 px-2 py-0.5 text-xs font-medium text-red-300">
                      AI analysis failed
                    </span>
                  </div>
                  <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-300">
                    {result.aiError}
                    <div className="mt-2 text-xs text-red-400">
                      No analysis text was generated — nothing here is a
                      substitute for the AI response. Check that
                      OPENROUTER_API_KEY is set correctly in your Vercel
                      project's environment variables and try again.
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full rounded-md border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? "Preparing report…" : "Download Full Report (DOCX)"}
              </button>

              <footer className="border-t border-border pt-6 text-sm text-gray-400">
                <h4 className="mb-1 font-semibold text-gray-300">Support</h4>
                <p>
                  Need help or want to support our startup? Email:{" "}
                  <a className="text-accent hover:underline" href="mailto:gizhayes27@gmail.com">
                    gizhayes27@gmail.com
                  </a>{" "}
                  · Join our{" "}
                  <a className="text-accent hover:underline" href="https://t.me/+0WciZpJaSOhhMmM0" target="_blank" rel="noreferrer">
                    Telegram Group
                  </a>
                </p>
                <p className="mt-1 text-xs text-gray-600">orbann_ai</p>
              </footer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
