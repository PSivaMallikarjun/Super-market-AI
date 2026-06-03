<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repository contains everything you need to run the Super-market-AI demo locally and understand how it integrates an LLM (via the Gemini API) to provide supermarket-specific assistant features.

View your app in AI Studio: https://ai.studio/apps/7275f701-7c33-4bb2-bff3-fc652b25c986

## About Super-market-AI

Super-market-AI is an AI-powered assistant and analytics demo built to showcase how language models can enhance shopper experiences and store operations. The app provides conversational access to supermarket data and prototype features such as:

- Conversational shopping assistant: ask product questions, find product locations, check promotions, and get ingredient/substitute suggestions.
- Smart shopping lists: generate, optimize, and group shopping lists by aisle or meal plan.
- Receipt parsing (OCR): extract items, quantities, and prices from receipt images and produce expense summaries.
- Inventory & restock suggestions (prototype): analyze simple sales/stock data to recommend restock actions.
- Product recommendations and cross-sell: suggest complementary items or promotions using product context.
- Analytics dashboard (prototype): visualize spending, top categories, and receipt-derived metrics.

The demo integrates a frontend, backend routing, and optional components (OCR, vector DB, database) to illustrate a realistic pipeline for LLM-driven supermarket features.

> Note: Some features are prototypes and require optional services (OCR provider, vector database) to be enabled and configured.

## Run Locally

Prerequisites:
- Node.js (v16+ recommended)
- A Gemini API key (or compatible LLM API key)

1. Install dependencies

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root and set at minimum:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Optional environment variables (depends on enabled features):

   - `VECTOR_DB_URL` and `VECTOR_DB_API_KEY` — for embeddings + semantic search (e.g., Pinecone, Weaviate).
   - `OCR_API_KEY` — if using a third-party OCR provider for receipt parsing.
   - `DATABASE_URL` — persistent DB (Postgres/SQLite) for receipts, sessions, analytics.
   - `NODE_ENV=development|production`

3. Start the app

   ```bash
   npm run dev
   ```

Open the URL printed in the console (usually http://localhost:3000).

## High-level Architecture

- Frontend: conversational UI to ask questions, upload receipts, view shopping lists and analytics.
- Backend API: validates requests and orchestrates calls to the LLM, OCR, vector DB, and database.
- Language Model (Gemini API): powers natural-language understanding and generation tasks.
- Optional components: OCR for receipt parsing, vector DB for embedding search, and a DB for persistence.

Typical flows:
- Query flow: user asks a question → backend fetches relevant context (product catalog/embeddings) → backend calls Gemini with a prompt → Gemini returns an answer → frontend displays it.
- Receipt flow: user uploads a receipt image → backend calls OCR → structured items saved to DB → backend summarizes with Gemini → frontend displays parsed receipt and category breakdown.

## Configuration & Extensibility

To make the demo more production-like, consider:

- Product catalog: import a CSV/DB of items (name, category, aisle, price) for accurate lookups.
- Embeddings: compute embeddings for product descriptions and receipts to enable semantic search and similarity-based recommendations.
- OCR improvements: swap or tune OCR provider (Tesseract, Google Cloud Vision) for higher parsing accuracy.
- User accounts: add authentication and persist user preferences/purchase history for personalization.

## Usage Examples

- Natural questions: "Which pasta sauces are on discount?" or "What's a cheaper substitute for almond milk?"
- Build lists: "Create a shopping list for vegetarian dinners this week" — produces grouped items by aisle.
- Receipt parsing: Upload `receipt.png` to get parsed items, totals, and categorized spending.
- Cross-sell: After selecting a product, ask "what else should I buy with this?" for bundled recommendations.

## Deployment

The app can be deployed to platforms that support Node.js. General checklist:

- Ensure `GEMINI_API_KEY` (and any OCR/VECTOR_DB keys) are set in production environment variables.
- Configure CORS and HTTPS.
- Use managed DB/vector DB services for production readiness.

Suggested targets:
- Vercel (frontend + serverless API routes)
- Heroku / Render / Fly / AWS / GCP for full-stack deployments

## Security & Cost Considerations

- Keep API keys out of source control. Use `.env` locally and secrets management in CI/CD.
- LLM calls may incur cost — batch or cache repeated queries and minimize context size where possible.
- Validate and sanitize user-provided content before using it in prompts to prevent prompt injection.

## Troubleshooting

- Authentication errors: verify `GEMINI_API_KEY` is valid and not rate-limited.
- App won't start: ensure `npm install` completed and Node version is compatible.
- OCR parsing errors: try different receipt images or switch OCR provider/configuration.

## Contributing

Contributions are welcome. Ideas:
- Add unit/integration tests for parsing and API routes.
- Add realistic product datasets and catalog importers.
- Improve prompts and response handling for reliability and safety.

## License

MIT
