# Rakhlo

> **Buy it. Save it. Remember it.**

Rakhlo is a lightweight, India-first Progressive Web App (PWA) for keeping a simple, searchable record of the things people buy and the information they may need later.

A purchase does not need to have a receipt to be useful in Rakhlo. Users can save a product with a date, price, seller, notes, photos, payment proof, receipt/invoice, warranty information, and reminders when available.

The core product is deliberately **AI-independent**. Everything essential — saving purchases, attaching documents, adding notes, tracking dates, searching records, and receiving reminders — should work without AI. AI will be introduced later as an optional layer for extraction, analysis, and natural-language experiences.

## Why Rakhlo?

People often lose track of:

- when they bought something
- how much they paid
- where they bought it
- where the receipt or invoice is
- how they paid
- what the seller told them verbally
- when a warranty expires
- when a return period ends
- when a service or other important date is due

This is especially common when purchases happen through a mix of local shops, online marketplaces, cash, UPI, cards, handwritten bills, and informal/verbal arrangements.

Rakhlo provides one simple place to keep that memory.

## Product Philosophy

Rakhlo is **not** intended to feel like enterprise inventory software, accounting software, or a document-management system.

The core interaction should be:

**What did I buy? → When? → How much? → Save whatever proof I have → Tell Rakhlo what I need to remember.**

Everything else is optional.

### Core principles

1. **Simple first:** ordinary people should understand the interface immediately.
2. **Receipt optional:** a purchase can exist without a receipt.
3. **AI optional** — the core application must work without AI.
4. **Evidence-aware** — distinguish uploaded/verified documents from user-entered memories.
5. **Reminder-first** — important dates should be actionable, not buried in records.
6. **India-first:** support ₹, Hindi, English, UPI/payment screenshots, local purchases, and informal purchase experiences.
7. **Mobile-first:** the primary experience should feel natural on Android.
8. **Privacy-first:** receipts, payment proofs, serial numbers, and purchase history are sensitive user data.
9. **Offline-friendly** — users should be able to capture important purchase information even with unreliable connectivity.
10. **Progressive complexity** — start with a tiny number of fields and reveal advanced options only when needed.

## Core Product

### Purchases

A purchase can contain:

- product/item name
- purchase date
- price
- seller/store
- category
- quantity
- product photo
- receipt/invoice
- payment proof
- serial number / IMEI
- warranty information
- return period
- notes
- custom reminders
- status / ownership information

Only the essential purchase information should be required.

### Documents

Documents and images may include:

- receipts
- invoices
- warranty cards
- payment screenshots
- product photographs
- other supporting documents

Documents are linked to purchases rather than treated as isolated files.

### Memories / Notes

Users can record information that may not exist in formal documentation.

Examples:

- "Shopkeeper said 2 years warranty."
- "Paid ₹5,000 cash and the remaining amount next month."
- "Bought this for mother's room."
- "Seller said free service after 6 months."

User-entered information must remain clearly distinguishable from verified/document-backed information.

### Reminders

Rakhlo should support:

- warranty expiry
- return deadline
- service due date
- payment due date
- renewal date
- custom dates
- configurable reminder offsets

Example:

> **Fridge warranty expires in 7 days.**

A reminder should take the user directly to the relevant purchase record.


## India-first Experience

The initial product should support:

- Indian Rupee formatting
- Hindi UI
- English UI
- simple Hinglish-friendly input
- UPI payment screenshots
- cash purchases
- card payments
- online marketplace invoices
- local-shop purchases
- handwritten receipts
- GST invoices where available
- verbal/user-recorded warranty information

The product should not assume that every purchase has a formal invoice.

## AI Strategy

AI is intentionally **not part of the core dependency graph**.

### Core without AI

- create/edit/delete purchases
- upload documents
- attach photos
- add notes
- create reminders
- search/filter
- notifications
- authentication
- data storage
- backup/sync

### Future AI capabilities

AI may later provide:

- receipt/invoice extraction
- automatic categorization
- warranty-date suggestions
- natural-language search
- spending analysis
- purchase summaries
- document classification
- duplicate detection
- useful purchase insights

AI suggestions must be reviewable and should never silently overwrite user data.

## MVP

The first production MVP should include:

- authentication
- mobile-first PWA
- add purchase
- edit purchase
- purchase list
- purchase detail page
- receipt/document upload
- payment-proof upload
- product photo
- notes
- warranty/custom reminder
- notification system
- basic search
- Hindi/English interface
- responsive desktop experience
- secure per-user data isolation

### Explicitly out of MVP

- AI receipt extraction
- conversational AI
- advanced spending analytics
- marketplace integrations
- automatic bank/UPI transaction imports
- social/sharing features
- complex inventory accounting
- depreciation/accounting
- business/warehouse inventory
- subscription management

These can be considered after the core workflow is stable.

## Suggested Architecture

The initial technical direction is:

- **Frontend:** Next.js + TypeScript
- **UI:** responsive, mobile-first component system
- **PWA:** installable web app with service worker and app manifest
- **Backend:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **File storage:** Supabase Storage
- **Authorization:** PostgreSQL Row Level Security
- **Notifications:** web push / supported notification infrastructure
- **AI:** optional future service, isolated from core domain logic

The exact stack can evolve, but the architectural principle should remain:

> **The domain model and core workflows must not depend on an AI provider.**

## High-Level Domain Model

The initial domain should separate these concepts:

    User
     ├── Purchases
     │    ├── Items
     │    ├── Documents
     │    ├── Payments
     │    ├── Notes
     │    ├── Warranty
     │    └── Reminders
     └── Notification Preferences

A single purchase may contain multiple items.

For example:

    Amazon Order #12345
    ₹7,500

    Items
    ├── SSD — ₹5,500
    └── USB Cable — ₹2,000

    Documents
    └── Invoice

    Payment
    └── UPI proof

This distinction should be preserved in the database even if the initial UI presents the experience as one simple purchase.


## Security & Privacy

Rakhlo may contain sensitive personal information, including:

- payment screenshots
- invoices
- addresses
- phone numbers
- serial numbers
- purchase history

Security requirements include:

- strict per-user authorization
- Row Level Security for user-owned records
- private document storage
- secure signed access to private files
- server-side validation for sensitive operations
- no client-side exposure of privileged credentials
- safe file upload validation
- audit-friendly data mutations
- careful handling of notification payloads

The application should follow least-privilege principles from the beginning.

## Roadmap

### Phase 1 — Foundation

- project architecture
- authentication
- database schema
- storage
- PWA foundation
- design system
- localization foundation
- security/RLS

### Phase 2 — Core MVP

- purchases
- documents
- payment proofs
- notes
- reminders
- notifications
- search
- purchase details

### Phase 3 — Quality

- offline-first improvements
- sync handling
- export/import
- backups
- accessibility
- performance
- error recovery
- observability

### Phase 4 — Intelligence

- OCR/extraction
- automatic categorization
- natural-language search
- spending insights
- warranty intelligence

### Phase 5 — Expansion

Potential future areas:

- household/shared purchases
- family accounts
- product/service history
- insurance information
- maintenance records
- recurring purchases
- richer analytics
- native mobile applications if justified

## UX Direction

The interface should feel closer to a simple personal notebook than business software.

Primary action:

> **+ Add Purchase**

A typical flow:

    Add Purchase
         ↓
    What did you buy?
         ↓
    When / How much?
         ↓
    Optional proof & details
         ↓
    Optional reminder
         ↓
    Save

A user should be able to save a basic purchase in seconds.

## Repository Structure

The repository is intended to evolve toward a structure similar to:

    .
    ├── app/                 # Application routes and pages
    ├── components/          # Reusable UI components
    ├── lib/                 # Domain/application utilities
    ├── hooks/               # React hooks
    ├── services/            # External/service integrations
    ├── supabase/            # Database migrations and backend configuration
    ├── public/              # Static/PWA assets
    ├── docs/                # Product and technical documentation
    ├── tests/               # Automated tests
    └── README.md

The actual structure should follow the implementation rather than forcing empty directories prematurely.


## Documentation

Product and technical decisions live under \`docs/\`.

- [PRD v1.1](./docs/PRD-v1.1.md)
- [Authentication setup](./docs/AUTH-SETUP.md)
- [Deployment policy](./docs/DEPLOYMENT.md)
- [Testing strategy](./docs/TESTING.md)

Documentation should be updated when product scope or important architectural decisions change.

## Development Principles

Before implementing a feature:

1. Check whether it belongs in the core product.
2. Keep the happy path simple.
3. Avoid making AI a prerequisite.
4. Keep sensitive data private.
5. Validate server-side.
6. Design mobile-first.
7. Make failure states explicit.
8. Add tests for important domain logic.
9. Prefer small, reversible changes.
10. Update documentation when behavior or architecture changes.

## Status

**Stage:** Product definition / foundation

The repository is being built from the product requirements upward. The first goal is a reliable, simple MVP rather than a feature-heavy launch.

## License

License will be defined before the first public production release.
