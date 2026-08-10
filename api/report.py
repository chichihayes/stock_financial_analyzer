"""
Vercel Python serverless function: POST /api/report

Body: { "ticker": "AAPL", "ratios": {...}, "analysis": "..." }
Returns the generated DOCX report as a binary download.
"""
import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from lib.finance_core import create_docx_report, from_jsonable  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def _send_error(self, status, message):
        body = json.dumps({"error": message}).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length) if content_length else b"{}"
            payload = json.loads(raw_body.decode("utf-8"))
        except Exception:
            self._send_error(400, "Invalid JSON body.")
            return

        ticker_symbol = (payload.get("ticker") or "REPORT").upper()
        ratios = payload.get("ratios")
        analysis = payload.get("analysis") or "No analysis generated."

        if not ratios:
            self._send_error(400, "Missing 'ratios' in request body.")
            return

        try:
            bio = create_docx_report(ticker_symbol, from_jsonable(ratios), analysis)
            data = bio.read()

            self.send_response(200)
            self.send_header(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
            self.send_header(
                "Content-Disposition",
                f'attachment; filename="{ticker_symbol}_Financial_Analysis.docx"',
            )
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self._send_error(500, f"Error generating report: {str(e)}")
