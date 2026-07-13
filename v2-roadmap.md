# VocalVault — V2 Roadmap

Ideas parked for after the current week's deadline. Not scoped into the v1 build because each requires new data models and meaningfully more time than the current sprint has room for. Ordered roughly by how self-contained/cheap each is to bolt on later.

---

## 1. Recurring Costs & "Safe to Spend"

**Problem it solves:** Student finance is cyclical — a loan or paycheck lands, then rent/bills/subscriptions disappear immediately. Standard "total spent this month" doesn't reflect what's actually safe to spend.

**Feature:** Let the user lock in recurring costs (rent, Spotify, Wi-Fi, gym). At the start of each month, these are subtracted upfront from the balance, so the Dashboard shows a true "Safe to Spend" figure instead of just a running total.

**Rough scope:**
- New `recurring_expenses` table (name, amount, category, day-of-month or frequency)
- Date logic to determine "start of month" and apply deductions
- New calculation feeding into the existing budget summary card (Safe to Spend = budget − recurring costs − spent so far)
- Minor UI: a settings/recurring-costs list to add/edit/remove these

**Why it's first in this list:** No new "concept" needed (no other users, no shared state) — it only extends the existing `expenses`-style schema and Dashboard. Most self-contained of the three.

---

## 2. Gamified Savings & "Leftover" Challenges ("Vault")

**Problem it solves:** Standard budgeting is passive and boring — no reward for staying under budget.

**Feature:** Set a budget for a category/period (e.g. £40/week for takeout). If under budget, don't just roll the leftover into next period — treat it as a win. Let the user create a "Vault" (a savings goal like a GPU, trip, or concert ticket) and automatically route leftover amounts toward it. Streaks/visual rewards for consecutive under-budget periods.

**Rough scope:**
- New `goals`/`vaults` table (name, target amount, current amount)
- New `budget_periods` concept (weekly/category budgets, separate from the single monthly cap)
- Streak-tracking logic (consecutive periods under budget)
- New UI: goal creation, progress bars, streak display

**Why it's second:** Bigger than it sounds — needs its own data model (goals) and a periods/streaks concept that doesn't exist yet. Estimated 2+ days of real work.

---

## 3. Group Expense / Flatmate Splitter

**Problem it solves:** Living with flatmates means chasing people for money or mentally tallying who bought what (cleaning supplies, toilet paper, milk).

**Feature:** Log a shared expense, hit "Split with N people," and the app tracks net balance — who owes what, accurately, without manual tallying.

**Rough scope:**
- Entirely new **people/contacts** concept — the current schema is single-user with no notion of "other people" at all
- Split-calculation logic (equal or custom splits)
- Running balance system per person
- New UI: add flatmate, log split expense, view balances

**Why it's last:** This is close to a second app bolted onto the first — it introduces a core concept (other people, shared balances) that nothing else in VocalVault currently has. Highest scope of the three; should not be started until the core single-user app is fully stable.

---

---

## 4. Multi-User Support (headline v2 item)

**Problem it solves:** v1 is single-user by design. The goal of eventually sharing VocalVault with friends — and the Flatmate Splitter above — both require the app to know about more than one person.

**Feature:** Real user accounts — registration, login, and per-user data isolation, so each person has their own expenses, categories, and settings.

**Rough scope:**
- New `users` table + authentication (password hashing, sessions or JWT)
- Every existing table (`expenses`, `categories`, `settings`) gains a `user_id` column
- Every backend query gains a `WHERE user_id = $X` filter
- Every API endpoint needs to know who's asking (auth middleware)
- Frontend: login/register screens, protected routes, token handling

**Why it's now the headline item:** This isn't a small addition — realistically a week or more of new work, touching every file in the app. But it's also the prerequisite for #3 (Flatmate Splitter) and the actual goal of sharing the app with friends. Migrating a single-user schema to multi-user later (adding `user_id` columns) is a well-trodden, mechanical path — nothing built in v1 needs to be thrown away to do this.

---

## 5. Whisper API for Improved Speech Accuracy

**Problem it solves:** The browser's built-in Web Speech API (free, no setup) occasionally mishears words, especially amounts and less common vocabulary. There's no control over its underlying recognition model.

**Feature:** Swap (or offer as an option) OpenAI's Whisper API for transcription — a purpose-built, generally more accurate speech model.

**Rough scope:**
- Record raw audio client-side instead of using the browser's live transcription
- Send audio to Whisper's API, handle API keys/costs
- Adjust the confirm/edit draft flow to work with async transcription (Whisper isn't instant like the live browser API)

**Note:** This was actually considered and set aside early in the project (alongside a Malaysian Ringgit/Manglish context) before settling on the Web Speech API for cost/complexity reasons. Revisit only if recognition accuracy remains a real pain point after v1 usage — the confirm/edit draft card already exists as a safety net for mishearing, so this is a nice-to-have, not a blocker.

---

## 6. Deployment Prep (infrastructure, not a feature)

**Problem it solves:** v1 works fully on `localhost` but is not yet safe or functional to deploy to a public URL.

**Gaps to close before deploying:**
- **No authentication** — currently anyone with the URL has full access to all data. Deploying publicly without auth means exposing financial data to anyone who finds the link. Realistically blocked on item #4 above, or at minimum a basic password gate.
- **Hardcoded `localhost:3000` URLs** — every function in `client.js` points at localhost; needs to become an environment variable (e.g. `import.meta.env.VITE_API_URL`) before the frontend can talk to a real deployed backend.
- **Environment variables for credentials** — `.env` currently holds DB credentials locally; needs equivalent env var setup on whatever hosting platform is chosen (Render, Railway, etc.), never committed.
- **No production error handling** — failed requests currently just `console.error`; a deployed app needs user-facing error states instead of silent console failures.
- **Not stress-tested** — empty states, long inputs, concurrent use haven't been deliberately tested.

**Note:** This is a different *kind* of work than the feature items above — infrastructure and security, not new functionality. Treat "v1 works for me locally" and "v1 is deployed and safe to share" as two separate milestones, not one continuous task.

---

## Known v1 limitations / polish backlog (not v2 — small items to close out v1)

- Multi-expense sentences (e.g. "five pounds on coffee and ten pounds on bus fare") are parsed as a single expense; the second amount is silently lost. Deferred a guardrail message ("sounds like multiple expenses — please record one at a time") to the polish pass; full splitting logic is v2-scale work (see below).
- Remove the temporary "Type a test transcript..." input on the Dashboard once real mic input is confirmed reliable — it was a dev-only stand-in.
- No empty/loading states yet (e.g. Dashboard before the initial fetch resolves, or an empty expenses list).
- Amount-extraction regex has been hardened (handles `£50`-style bare symbols, decimal points, word/numeric variants) but transcripts with **no currency word at all** (e.g. "spent fifteen on coffee") still correctly return `amount: null` by design — the confirm/edit draft card is the intended safety net for this, not a parser fix.
- Quick mobile/responsive pass — a breakpoint exists in `Dashboard.css` but hasn't been deliberately tested on a narrow screen.

---

## Multi-expense sentence splitting (parked inside item, not separately numbered)

**Problem:** "spent five pounds on coffee and ten pounds on bus fare" currently produces one (wrong) draft instead of two.

**Why it's hard:** Splitting on "and"/"then" naively breaks phrases like "fish and chips" or "coffee and cake" that are legitimately one item. Properly solving this is a real natural-language problem, not a quick fix — likely 1+ day of edge-case work. A cheap interim guardrail (detect multiple currency-word matches in one transcript, prompt the user to record separately) was deferred to the v1 polish backlog above instead of solving the general case.

---

## Sequencing note

None of these should be started before:
1. The current week's plan is fully shipped (Dashboard polish, Categories upgrades, Settings, backend wiring, voice modal, bug-fix pass)
2. The voice input modal specifically is working end-to-end, since it's the core feature and the riskiest unknown

**Update:** both of the above are now done — the voice modal works end-to-end with real speech, and all four pages are fully wired and CRUD-complete. v1 is feature-complete for local/personal use as of this session.

Recommended order when picked back up: **#1 (Recurring/Safe to Spend) → #4 (Multi-user) → #3 (Flatmate Splitter, needs #4) → #2 (Vault) → #5 (Whisper) → #6 (Deployment)**, roughly reflecting value delivered vs. how much each depends on other unbuilt pieces. Deployment prep (#6) can happen in parallel with any of the above once auth (#4) is at least underway.