"""
Vercel Python serverless function: GET /api/analyze?ticker=AAPL&useAi=true

Fetches balance sheet / income statement / cash flow data for a ticker,
computes financial ratios, and (optionally) generates a written analysis.
Returns everything as JSON for the Next.js frontend to render.
"""
import json
import os
import sys
import traceback
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from lib.finance_core import (  # noqa: E402
    clean_balance_sheet,
    clean_income_statement,
    clean_cash_flow_statement,
    calculate_financial_ratios,
    generate_financial_analysis_openrouter,
    generate_rule_based_analysis,
    to_jsonable,
)


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        ticker_symbol = (query.get("ticker", [""])[0] or "").strip().upper()
        use_ai = (query.get("useAi", ["true"])[0] or "true").lower() == "true"

        if not ticker_symbol:
            self._send_json(400, {"error": "Missing required 'ticker' query parameter."})
            return

        try:
            balance_sheet = clean_balance_sheet(ticker_symbol)
            income_statement = clean_income_statement(ticker_symbol)
            cash_flow = clean_cash_flow_statement(ticker_symbol)
            ratios = calculate_financial_ratios(balance_sheet, income_statement, cash_flow)

            log = []
            if use_ai:
                analysis, log = generate_financial_analysis_openrouter(ticker_symbol, ratios)
            else:
                analysis = generate_rule_based_analysis(ratios)

            self._send_json(200, {
                "ticker": ticker_symbol,
                "ratios": to_jsonable(ratios),
                "analysis": analysis,
                "log": log,
            })
        except Exception as e:
            self._send_json(500, {
                "error": f"Error occurred: {str(e)}",
                "detail": traceback.format_exc(),
            })
