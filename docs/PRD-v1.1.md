# Rakhlo: Product Requirements Document v1.1

**Status:** Approved product foundation  
**Version:** 1.1  
**Product:** Rakhlo  
**Domain:** rakhlo.xyz  
**Repository:** techykaif/rakhlo  
**Document purpose:** Define the product scope, principles, requirements, user experience, domain model, and MVP acceptance criteria before implementation.

---

## 1. Product Summary

Rakhlo is a lightweight, India-first Progressive Web App that helps people remember what they bought and retain the information associated with those purchases.

The core promise is:

> **Buy it. Save it. Remember it.**

A user can save a purchase even when there is no receipt. They can optionally attach a receipt, invoice, payment proof, product photo, warranty card, or other document. They can also record informal information, such as something a shopkeeper told them verbally, and create reminders for important dates.

The product is designed for ordinary consumers rather than businesses operating warehouses or formal inventory systems.

---

## 2. Problem Statement

People frequently need information about something they bought months or years ago:

- What did I buy?
- When did I buy it?
- How much did I pay?
- Where did I buy it?
- Do I still have the receipt?
- How did I pay?
- What did the seller tell me?
- Is it still under warranty?
- When does the return period end?
- When is the next service due?

The information is often fragmented across:

- paper receipts
- phone galleries
- WhatsApp conversations
- email
- marketplace accounts
- UPI/payment applications
- bank records
- physical warranty cards
- memory or verbal conversations

Rakhlo brings the relevant information together under a purchase record.

---

## 3. Product Vision

Rakhlo should become a **personal memory layer for purchases and things people own**.

The product should eventually allow a user to answer questions such as:

> "When did I buy this?"

> "Where is the invoice?"

> "How much did I pay?"

> "Is this still under warranty?"

> "What important dates do I have coming up?"

> "What did I buy last year?"

The first version does not need AI to answer these questions. Structured data, documents, search, and reminders are sufficient.

---

## 4. Target Users

### Primary users

Everyday consumers in India who purchase goods from a mixture of:

- local stores
- online marketplaces
- electronics shops
- appliance stores
- service providers
- small businesses
- informal sellers

The product should be understandable to users with different levels of technical literacy.

### Secondary users

Potential future audiences include:

- families
- students
- renters/homeowners
- professionals
- people managing household purchases
- users managing expensive personal belongings

Business inventory management is explicitly outside the initial target audience.

---

## 5. Product Principles

### 5.1 Simple first

A user should be able to save a basic purchase quickly.

The application must not require users to understand accounting, inventory terminology, SKUs, asset depreciation, or procurement workflows.

### 5.2 Receipt optional

A receipt is evidence, not the definition of a purchase.

The user must be able to create a purchase without a receipt.

### 5.3 AI optional

The core product must function without AI.

AI can enhance workflows but cannot be a hard dependency for:

- creating purchases
- viewing purchases
- editing purchases
- storing documents
- searching structured records
- creating reminders
- receiving notifications

### 5.4 Evidence-aware

The product must distinguish:

- uploaded documents
- user-entered information
- system-derived information

For example:

**Document-backed:** "Warranty until 30 September 2028" extracted from an uploaded invoice.

**User-recorded:** "Shopkeeper said two years warranty."

The UI should avoid presenting the second statement as official proof.

### 5.5 Reminder-first

Important dates should lead to useful action.

A notification should link directly to the relevant purchase.

### 5.6 India-first

The product should accommodate real Indian purchase behavior, including UPI screenshots, cash purchases, handwritten bills, local shops, GST invoices, and verbal information.

### 5.7 Privacy-first

Purchase records and attached documents can contain sensitive information. User data must be isolated and protected from the beginning.

### 5.8 Progressive complexity

The first screen should show only the fields necessary to save a useful purchase. Advanced details should be optional.

---

## 6. MVP Goals

The MVP must prove that a user can:

1. create a purchase quickly
2. save it without a receipt
3. attach available evidence
4. record additional memories/notes
5. set important dates
6. receive reminders
7. find the purchase later
8. use the product comfortably on Android
9. use Hindi or English
10. keep their data private

---

## 7. MVP Non-Goals

The MVP will not attempt to provide:

- warehouse inventory management
- business procurement
- accounting
- depreciation
- automatic bank integrations
- automatic UPI transaction imports
- marketplace integrations
- social sharing
- family collaboration
- conversational AI
- AI receipt extraction
- advanced financial forecasting
- insurance claims processing
- native Android/iOS applications
- complex subscription management

These may be evaluated after the core product is stable.

---

## 8. Core User Journey

### 8.1 Add a purchase

User opens Rakhlo.

They select:

**+ Add Purchase**

The minimum form asks:

- What did you buy?
- When did you buy it?
- How much did you pay?

Optional fields can then be added:

- seller
- category
- quantity
- product photo
- receipt/invoice
- payment proof
- serial number/IMEI
- warranty
- return period
- notes
- custom reminders

The user saves the purchase.

### 8.2 No receipt

If the user does not have a receipt:

- no error is shown
- no document upload is required
- the purchase is still fully valid
- the user can add a note explaining the situation

Example:

> "No receipt. Shopkeeper said two-year warranty."

The user may manually add a warranty date.

### 8.3 With receipt

If a receipt exists:

- user uploads or photographs it
- it is stored privately
- it is attached to the purchase
- metadata can be added manually in MVP
- future AI/OCR can extract information later

### 8.4 Payment proof

The user may attach:

- UPI screenshot
- card payment screenshot
- bank transaction screenshot
- payment receipt
- other proof

Payment proof is optional and should not be confused with an invoice.

### 8.5 Reminder

The user can create:

- warranty expiry reminder
- return deadline
- service reminder
- payment reminder
- renewal reminder
- custom reminder

The user should be able to choose when they are reminded.

---

## 9. Purchase Record Requirements

### Required fields

The MVP should require:

| Field | Requirement |
|---|---|
| User | Required |
| Product/item name | Required |
| Purchase date | Required |
| Amount | Required |

### Optional fields

| Field | Requirement |
|---|---|
| Seller/store | Optional |
| Category | Optional |
| Quantity | Optional |
| Product photo | Optional |
| Receipt/invoice | Optional |
| Payment proof | Optional |
| Serial number | Optional |
| IMEI | Optional |
| Warranty | Optional |
| Return period | Optional |
| Notes | Optional |
| Reminders | Optional |
| Status | Optional/defaulted |

The UI may collect additional information later, but the minimum viable purchase must remain small.

---

## 10. Items and Purchases

The domain model must distinguish a **purchase** from an **item**.

One purchase/order may contain multiple items.

Example:

**Purchase**

Amazon order #12345  
Total: ₹7,500

**Items**

- SSD: ₹5,500
- USB cable: ₹2,000

This allows the application to evolve toward item-level warranty, serial number, and ownership information without redesigning the entire database.

The initial UI may still make this feel like one simple purchase.

---

## 11. Documents

A document belongs to a purchase and should have metadata.

Possible document types:

- receipt
- invoice
- warranty card
- payment proof
- product photo
- other

### Requirements

- private by default
- associated with exactly one user's data
- associated with a purchase
- viewable from the purchase detail screen
- deletable by the owner
- validated before storage
- protected from unauthorized access

File size and type limits should be defined in the technical implementation.

---

## 12. Notes and Memories

Notes are free-form user-entered information.

Examples:

- "Shopkeeper said 2 years warranty."
- "Bought for parents."
- "Paid cash."
- "Seller promised free installation."
- "Need to call service center after six months."

Notes are not treated as verified evidence.

The UI should use simple language such as:

**My note**

rather than suggesting that a verbal statement is an official warranty document.

---

## 13. Warranty Model

Warranty should be optional.

Possible data:

- warranty duration
- warranty start date
- warranty end date
- provider/seller
- notes
- source

Source should distinguish at least:

- user-entered
- document-backed
- system-derived

### Example

**Warranty**

Ends: 30 September 2028

Source:

**Added by you**

Note:

> "Shopkeeper said two years."

The system must not label this as verified.

---

## 14. Return Period

Return information should be separate from warranty.

Possible data:

- return start date
- return end date
- seller/platform
- return conditions note
- source

Example:

> **Return ends in 2 days**

The notification should link to the purchase and its documents.

---

## 15. Reminder System

Reminders are a core feature rather than an add-on.

### Reminder types

- warranty
- return
- service
- payment
- renewal
- custom

### Reminder configuration

Each reminder should support:

- title
- target date
- reminder offsets
- enabled/disabled state
- associated purchase
- optional note
- completion/dismissal state

### Suggested default offsets

For relevant date-based reminders, the product may offer:

- 30 days before
- 14 days before
- 7 days before
- 3 days before
- 1 day before
- on the date

Users should be able to customize these.

The notification engine must be designed so future reminder types can be added without changing the core purchase model.

---

## 16. Notifications

Notifications should be concise and actionable.

Examples:

> **Fridge warranty expires in 7 days.**

> **Your return window ends tomorrow.**

> **AC service is due today.**

Selecting the notification should open the relevant purchase.

Notifications should avoid exposing sensitive document details in lock-screen text where possible.

---

## 17. Search and Retrieval

MVP search should support structured matching across:

- item/product name
- seller
- category
- notes
- purchase date
- amount

Useful filters may include:

- date range
- category
- seller
- amount range
- has receipt
- has payment proof
- has warranty
- warranty expiring soon

AI-powered natural-language search is not required for MVP.

---

## 18. Home Screen

The home screen should prioritize action.

Suggested structure:

1. greeting
2. Add Purchase
3. Things needing attention
4. Recent purchases
5. Search
6. My Things / categories

The interface should avoid overwhelming users with analytics.

---

## 19. Purchase Detail

A purchase detail page should provide a complete view.

Example:

**Samsung Refrigerator**

**₹35,000**

Bought: 30 September 2026  
Seller: Sharma Electronics

### Proof

- Receipt
- Payment proof
- Product photo

### Warranty

Until: 30 September 2028  
Source: Added by you

### Notes

> Shopkeeper said two-year warranty.

### Reminders

- Warranty expiry
- Service reminder

The user should be able to edit every user-owned field.

---

## 20. Localization

Initial languages:

- English
- Hindi

Requirements:

- all user-facing strings must be translatable
- dates and currency should follow locale conventions
- Hindi should be natural and simple
- terminology should favor everyday language
- technical terminology should not leak into the UI

Potential future languages can be added through the same localization architecture.

---

## 21. PWA Requirements

The application should be installable on supported mobile browsers.

MVP requirements:

- web app manifest
- installable experience
- responsive UI
- mobile-first navigation
- service worker
- appropriate icons
- theme metadata
- offline/error fallback

Offline support should evolve toward reliable purchase capture and synchronization, but full offline parity is not required for the first implementation if it materially increases complexity.

---

## 22. Accessibility

The application should target accessible defaults:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- screen-reader labels
- accessible form validation
- touch-friendly controls
- meaningful error messages

Accessibility should be treated as part of the component system, not a final cleanup task.

---

## 23. Security Requirements

### Authentication

- secure authentication
- protected routes
- session handling
- account recovery

### Database

- Row Level Security
- user ownership enforced at database level
- no trust in client-provided user IDs
- server-side validation

### Storage

- private buckets for sensitive documents
- signed URLs or equivalent protected access
- file type/size validation
- safe filename handling

### Secrets

- privileged credentials must never be exposed to the browser
- environment variables must be separated by environment
- service-role keys must remain server-side

### Notifications

Notification content should minimize sensitive information.

---

## 24. Data Model - Initial Concept

The initial schema should be designed around:

### users

Managed primarily through the authentication system.

### purchases

Core purchase record.

Potential fields:

- id
- user_id
- title
- purchase_date
- amount
- currency
- seller_name
- category_id
- quantity
- status
- notes
- created_at
- updated_at

### purchase_items

Potential fields:

- id
- purchase_id
- name
- quantity
- unit_price
- serial_number
- imei
- notes
- status

### documents

Potential fields:

- id
- user_id
- purchase_id
- type
- storage_path
- filename
- mime_type
- size
- created_at

### payments

Potential fields:

- id
- purchase_id
- amount
- method
- paid_at
- reference
- notes
- document_id

### warranties

Potential fields:

- id
- purchase_id or item_id
- start_date
- end_date
- provider
- source
- notes

### reminders

Potential fields:

- id
- user_id
- purchase_id
- type
- title
- due_at
- enabled
- completed_at
- notes
- created_at
- updated_at

### categories

Potential fields:

- id
- user_id
- name
- icon
- created_at

System categories may exist while allowing user-defined categories later.

---

## 25. Data Integrity

Important business rules:

1. A purchase must belong to exactly one user.
2. A document must not be accessible to another user.
3. A reminder must belong to the same user as its purchase.
4. Deleting a purchase must have an explicit policy for its children.
5. Monetary amounts must use a precise database representation rather than floating-point arithmetic.
6. Dates must be stored consistently and displayed according to locale.
7. Reminder processing must be idempotent.
8. Client-side validation must be complemented by server/database validation.
9. Uploaded files must not be trusted based solely on client-provided MIME type.
10. User-provided notes must be treated as untrusted text.

---

## 26. AI Boundary

AI may be added behind explicit application boundaries.

### AI may:

- suggest extracted fields
- classify documents
- suggest categories
- summarize purchases
- answer questions using authorized user data
- suggest warranty dates when evidence is available

### AI must not:

- silently modify records
- create unsupported facts
- present guesses as verified information
- bypass authorization
- receive unnecessary private documents
- become required for basic application functionality

The database remains the source of truth.

---

## 27. Future AI Workflow

A future receipt workflow may look like:

**Upload receipt**

↓

**Extracted suggestions**

- Product: Samsung Refrigerator
- Date: 30 Sep 2026
- Amount: ₹35,000
- Seller: Sharma Electronics
- Warranty: 2 years

↓

**User reviews**

↓

**Confirm**

↓

**Structured record saved**

AI output is therefore a suggestion layer, not the authoritative record.

---

## 28. Analytics and Insights

Future analytics may include:

- total spending
- spending by category
- spending by seller
- yearly/monthly trends
- warranty exposure
- upcoming obligations
- purchase frequency

Analytics must be clearly distinguished from accounting.

Rakhlo should not claim that its totals constitute formal financial records unless the product later implements the necessary controls.

---

## 29. Error Handling

Important error states should be designed before implementation.

Examples:

### Upload fails

> "We couldn't save this document. Your purchase is safe. Try uploading again."

### Notification permission denied

> "Notifications are off. You can enable them in your browser settings."

### Offline

> "You're offline. Your saved purchase will sync when you're connected."

### Invalid date

> "Please choose a valid date."

### Unauthorized resource

Do not reveal whether another user's record exists.

---

## 30. Performance Goals

The application should feel lightweight on mid-range Android devices and typical Indian mobile networks.

Goals:

- fast initial shell load
- small JavaScript footprint where practical
- optimized images
- lazy loading for documents
- pagination/infinite loading for long purchase histories
- minimal unnecessary network requests
- graceful slow-network states

Performance should be measured rather than assumed.

---

## 31. Testing Strategy

Testing should cover:

### Unit tests

- date calculations
- reminder scheduling
- warranty calculations
- currency handling
- validation
- search/filter logic

### Integration tests

- authentication
- purchase CRUD
- document ownership
- reminder creation
- database authorization

### End-to-end tests

Critical journey:

**Sign in → Add purchase → Save → Open purchase → Add reminder → Receive/process reminder**

The first implementation should establish testing infrastructure before the feature set becomes large.

---

## 32. Observability

Production readiness should include:

- structured application errors
- client/server error tracking
- notification processing visibility
- failed upload visibility
- database performance monitoring
- audit-friendly mutation logs where appropriate

No sensitive document contents should be unnecessarily copied into logs.

---

## 33. MVP Acceptance Criteria

The MVP is ready for initial real-user testing when:

### Purchase

- a user can create a purchase in a few steps
- receipt is optional
- amount and date are stored correctly
- purchase can be edited and deleted according to defined policy

### Evidence

- receipt can be uploaded
- payment proof can be uploaded
- product photo can be uploaded
- documents are private to the owner

### Memory

- user can add notes
- user can manually record verbal information
- notes are visibly user-provided

### Reminders

- warranty reminder can be created
- custom reminder can be created
- notifications are scheduled correctly
- notification opens the relevant purchase
- reminder processing is safe against duplicate sends

### Search

- user can find purchases by product name
- user can find purchases by seller
- user can filter by date/category where implemented

### Localization

- English UI works
- Hindi UI works
- no hard-coded user-facing strings remain in core UI

### PWA

- app can be installed on supported mobile browsers
- responsive mobile interface works
- basic offline/error fallback exists

### Security

- users cannot access another user's purchase
- users cannot access another user's documents
- privileged credentials are not exposed client-side

---

## 34. Release Strategy

### Development

Build the foundation in small, reviewable changes.

### Internal testing

Use realistic purchase scenarios:

1. local purchase with no receipt
2. local purchase with handwritten receipt
3. online purchase with invoice
4. UPI payment proof
5. cash payment
6. warranty entered verbally
7. multiple reminders
8. purchase with multiple items

### Pilot

Test with a small group of real users before broad launch.

Focus on:

- time required to add a purchase
- whether users understand the terminology
- whether reminders are useful
- whether Hindi wording is natural
- whether users trust document storage
- which fields people actually use

---

## 35. Product Success Signals

Early product evaluation should focus on behavior rather than vanity metrics.

Useful signals:

- percentage of users who successfully add their first purchase
- time to first saved purchase
- percentage of purchases with optional evidence
- reminder creation rate
- reminder engagement
- repeat usage
- searches performed
- number of purchases stored per active user
- document upload success rate
- notification delivery success

These metrics should help determine which workflows deserve investment.

---

## 36. Future Expansion Areas

Once the core product is validated, possible expansions include:

### Family / household

- shared household inventory
- shared documents
- family reminders
- permissions

### Product history

- repairs
- servicing
- replacement parts
- ownership transfer

### Documents

- manuals
- insurance
- registration documents
- certificates

### Financial context

- installments
- payment schedules
- purchase budgets

### Intelligence

- natural-language search
- automatic categorization
- spending insights
- warranty intelligence

These are deliberately not part of v1.1 MVP scope.

---

## 37. Decisions Locked by PRD v1.1

The following decisions are considered foundational:

1. Rakhlo is a consumer purchase-memory product, not enterprise inventory software.
2. Receipt upload is optional.
3. Payment proof is optional.
4. User notes can capture verbal/informal information.
5. User-recorded information must be distinguishable from documented evidence.
6. Warranty and custom reminders are core functionality.
7. The product is PWA-first.
8. Hindi and English are initial languages.
9. The core application must work without AI.
10. AI is a future enhancement layer.
11. Supabase/PostgreSQL is the initial backend direction.
12. Sensitive documents are private by default.
13. Database authorization is mandatory.
14. The purchase domain should support multiple items per purchase.
15. The MVP prioritizes simplicity over feature volume.

---

## 38. Open Questions for Implementation

These questions should be resolved during technical design rather than guessed inside feature code:

- exact notification provider and browser support strategy
- offline synchronization architecture
- file size/type limits
- document retention/deletion behavior
- purchase deletion and child-record cascade policy
- exact category strategy
- whether amounts are stored in minor units or a decimal type
- timezone handling for reminders
- notification retry policy
- backup/export format
- analytics provider, if any
- final license
- production hosting configuration

Open questions must not weaken the locked product principles above.

---

## 39. Definition of Done for Product Foundation

The product foundation is complete when:

- the README accurately describes the product
- this PRD is committed under docs/
- architecture decisions are documented
- database/domain design is ready for implementation
- security boundaries are explicit
- MVP scope is frozen enough to begin engineering
- future AI capabilities have clear boundaries
- the first implementation can proceed without redefining the product at every feature

---

**Rakhlo v1.1**

> **Save it once. Let Rakhlo remember the rest.**
