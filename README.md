# VocalVault 🎙️💷

A voice-first personal expense tracker. Say what you spent, and VocalVault turns it into a structured, categorized expense — no typing required.

> "Spent fifteen pounds on coffee" → **£15.00** logged under **Food & Drink**, ready for you to confirm.

---

## Why VocalVault

Typing out every coffee, bus fare, and takeaway gets old fast — so logging stops happening. VocalVault removes the friction: talk for two seconds, review the parsed result, confirm, done. It started as a learning project to go deep on a full-stack build (React, Express, PostgreSQL) and became a genuinely useful daily tracker along the way.

## Features

- **Voice-first expense logging** — record with your mic, see a live transcript, and get an editable draft (amount, description, category) before anything saves
- **Smart parsing** — extracts amounts (including decimals, `£` symbols, and word-numbers like "fifteen"), strips filler words, and matches spending categories from keywords
- **Editable confirm step** — nothing is saved automatically; you always get to check and correct the parsed result first
- **Dashboard** — budget summary with a live percentage-used indicator, spending-by-category breakdown, and a recent expenses ledger
- **Full expense management** — view, edit, and delete any expense
- **Custom categories** — add, rename, and delete categories, and manage the keyword list each one matches against
- **Settings** — set your monthly budget and a default category for anything the parser can't confidently match

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Speech recognition | Web Speech API (browser-native) |
| Number parsing | `word-to-numbers` |

## Design

*"Notebook meets Modern Ledger"* — a paper-white canvas, deep ink-navy text, and a single muted forest-green accent. Clean borders over heavy shadows, generous whitespace, and a two-column Dashboard that puts voice capture front and center.

## Project Structure

```
vocalvault/
├── vocalvault-web/       # React frontend (Vite)
│   └── src/
│       ├── pages/        # Dashboard, Expense, Category, Setting
│       └── api/          # client.js — all backend communication
└── vocalvault-server/    # Express backend
    ├── routes/
    ├── controllers/
    ├── models/
    └── db/                # PostgreSQL connection
```

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL, running locally
- A Chromium-based browser (Chrome/Edge) for Web Speech API support

### Backend setup

```bash
cd vocalvault-server
npm install
```

Create a `.env` file:
```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=expense_tracker
```

Set up the database (in `psql`):
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  raw_text TEXT,
  source VARCHAR(10) DEFAULT 'manual' CHECK (source IN ('voice','manual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  monthly_budget NUMERIC(10,2) NOT NULL DEFAULT 1000,
  default_category_id INT REFERENCES categories(id) ON DELETE SET NULL
);
INSERT INTO settings (id) VALUES (1);
```

Run the server:
```bash
node index.js
```
> Note: no auto-reload — restart manually after backend code changes, or install `nodemon` for convenience.

### Frontend setup

```bash
cd vocalvault-web
npm install
npm run dev
```

Visit `http://localhost:5173`.

## How the Parser Works

1. **Amount extraction** — tries several patterns in order: `"X point Y"` decimals, `"X pounds Y"` compound amounts, plain `£X`/`X pounds`, and word-numbers ("fifteen" → 15)
2. **Description extraction** — strips the matched amount and filler words (spent, on, for, paid, bought), leaving the core description
3. **Category matching** — checks the leftover words against each category's keyword list; first match wins

If no currency word is present, or no keyword matches, the parser honestly returns `null` rather than guessing — you fix it in the confirm step instead.

## Known Limitations (v1)

- One spoken sentence = one expense. "Five pounds on coffee and ten on the bus" won't split into two entries yet.
- Speech recognition accuracy depends on the browser's built-in engine — mishearing is possible, which is exactly why the confirm/edit step exists before anything saves.
- Single-user — no accounts or login yet.

## Roadmap

See [`v2-roadmap.md`](./v2-roadmap.md) for planned features, including:
- Recurring costs & a "Safe to Spend" calculation
- Multi-user support (accounts, login)
- A flatmate expense splitter
- Gamified savings goals
- Optional Whisper API integration for improved transcription accuracy

## License

Personal learning project — license TBD.
