# stock_financial_analyzer


A comprehensive tool for financial statement analysis that provides detailed insights into company financial health through automated ratio calculations and intelligent analysis.

## Features

- **Automated Financial Data Retrieval**: Fetches real-time financial statements from Yahoo Finance
- **Comprehensive Ratio Analysis**: Calculates key financial ratios including:
  - Liquidity ratios (Current, Quick, Cash)
  - Solvency ratios (Debt-to-Equity, Debt-to-Assets)
  - Profitability metrics (ROE, ROA, Net Margin)
  - Per-share metrics (EPS, Book Value per Share)
- **Intelligent Analysis**: Generates detailed financial analysis using OpenRouter API
- **Professional Reports**: Export analysis as Word documents
- **Interactive Dashboard**: Clean, user-friendly Streamlit interface

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. Clone or download this repository

2. Install required dependencies:
```bash
pip install streamlit pandas numpy yahooquery python-docx requests
```

3. Create a `.streamlit/secrets.toml` file in your project directory:
```toml
[general]
OPENROUTER_API_KEY = "your_openrouter_api_key_here"
```

## Usage

### Running the Application

1. Navigate to the project directory in your terminal

2. Run the Streamlit app:
```bash
streamlit run financial_analysis_cleaned.py
```

3. Open your browser to the provided local URL (typically http://localhost:8501)

### Using the Dashboard

1. **Enter Stock Ticker**: Type the stock symbol (e.g., AAPL, MSFT, TSLA) in the input field
2. **Configure Settings**: 
   - Toggle "Generate Analysis" to enable/disable automated analysis
   - Enable "Debug Mode" for troubleshooting
3. **Click Analyze**: The app will fetch and analyze financial data
4. **Review Results**: View comprehensive metrics and analysis
5. **Download Report**: Export the complete analysis as a Word document

## Financial Metrics Explained

### Liquidity Ratios
- **Current Ratio**: Measures ability to pay short-term obligations (Higher is better, >2 is strong)
- **Quick Ratio**: Like current ratio but excludes inventory (>1 is healthy)
- **Cash Ratio**: Most conservative liquidity measure using only cash

### Solvency Ratios
- **Debt-to-Equity**: Shows company leverage (<1 is conservative)
- **Debt-to-Assets**: Percentage of assets financed by debt

### Profitability Metrics
- **ROE (Return on Equity)**: How effectively company uses shareholder money (>15% is excellent)
- **ROA (Return on Assets)**: How efficiently company uses its assets
- **Net Margin**: Profit as percentage of revenue

### Performance Metrics
- **EPS (Earnings Per Share)**: Company profit per share
- **Free Cash Flow**: Cash available after capital expenditures
- **Book Value per Share**: Net asset value per share

## API Configuration

The application uses OpenRouter API for generating financial analysis. To obtain an API key:

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Generate an API key
4. Add the key to your `.streamlit/secrets.toml` file

Note: The application will still function without an API key by using rule-based analysis.

## File Structure

```
project/
│
├── financial_analysis_cleaned.py   # Main application file
├── README.md                        # This file
└── .streamlit/
    └── secrets.toml                 # API keys (create this)
```

## Troubleshooting

### Common Issues

**Issue: "Module not found" errors**
- Solution: Install all required packages using pip install command above

**Issue: "No OpenRouter API key provided"**
- Solution: Create `.streamlit/secrets.toml` file with your API key, or use rule-based analysis

**Issue: "Invalid ticker symbol"**
- Solution: Verify the ticker symbol is correct and listed on Yahoo Finance

**Issue: Data not loading**
- Solution: Check your internet connection and verify the company has financial data available

### Debug Mode

Enable Debug Mode in the sidebar to see:
- API configuration status
- Detailed error messages
- Request/response information

## Limitations

- Financial data depends on Yahoo Finance availability
- Analysis is based on most recent annual financial statements
- Some tickers may not have complete financial data
- API rate limits may apply for analysis generation

## Support

Need help or want to support our startup?
- Email: [gizhayes27@gmail.com](mailto:gizhayes27@gmail.com)
- Join our [Telegram Group](https://t.me/+0WciZpJaSOhhMmM0)

## Disclaimer

This tool is for educational and informational purposes only. It is not financial advice. Always consult with a qualified financial advisor before making investment decisions. The developers are not responsible for any financial decisions made based on this tool's output.

## License

This project is provided as-is for educational purposes.

## Version

Current Version: 1.0

## Credits

Developed by Orbann_ai

---

**Note**: Always verify financial data from multiple sources before making investment decisions.
