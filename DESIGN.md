# DESIGN.md

## Overview

The Tara Finance Research Agent is a backend service that answers finance-related questions using transaction, holdings, fund, and NAV data stored in PostgreSQL.

The system loads JSON datasets into PostgreSQL and exposes a REST API endpoint (`POST /ask`) that converts user questions into SQL-backed responses.

---

## Architecture

User

↓

POST /ask

↓

Express Server

↓

Query Routing Logic

↓

PostgreSQL Database

↓

JSON Response

---

## Components

### 1. Data Ingestion Layer

The ingestion script reads:

* transactions.json
* funds.json
* holdings.json

and imports the records into PostgreSQL.

File:

```text
src/mastra/scripts/ingest.ts
```

---

### 2. Database Layer

PostgreSQL is used as the primary datastore.

#### transactions

Stores spending activity.

Columns:

* id
* date
* merchant
* category
* amount
* currency
* memo

#### funds

Stores fund metadata.

Columns:

* fund_id
* fund_name
* category

#### fund_navs

Stores historical NAV values.

Columns:

* fund_id
* nav_date
* nav

#### holdings

Stores investment holdings.

Columns:

* fund_id
* fund_name
* units
* purchase_date
* purchase_nav

---

### 3. API Layer

Endpoint:

```text
POST /ask
```

Request:

```json
{
  "question": "What is my total spending?"
}
```

Response:

```json
{
  "answer": "Your total spending excluding transfers is ₹3547816.19."
}
```

---

## Supported Queries

The current implementation supports:

1. Total Spending
2. Top Spending Category
3. Top Merchants
4. Health Spending
5. Portfolio Value
6. Holdings Return
7. Fund Return

Questions are matched using keyword-based routing and translated into SQL queries.

---

## Grounding Strategy

All responses are generated directly from PostgreSQL queries.

The application does not fabricate financial values. Every answer is derived from transaction, holdings, fund, or NAV data stored in the database.

This ensures that responses remain grounded in the underlying dataset.

---

## Financial Calculations

### Total Spending

```text
SUM(amount)
```

### Top Category

```text
GROUP BY category
ORDER BY SUM(amount) DESC
```

### Portfolio Value

```text
SUM(units × latest_nav)
```

### Fund Return

```text
((latest_nav - purchase_nav) / purchase_nav) × 100
```

### Holding Return

```text
(units × latest_nav) - (units × purchase_nav)
```

---

## Design Decisions

### PostgreSQL

Chosen because:

* Structured relational data
* Strong SQL aggregation support
* Efficient analytical queries

### Express

Chosen because:

* Lightweight
* Easy REST API development
* Fast PostgreSQL integration

### JSON Import Pipeline

The provided assignment data is delivered as JSON files.

A dedicated ingestion process loads the data into PostgreSQL so that all analytical queries can execute efficiently.

---

## Observability

The application logs:

* Incoming questions
* Query execution flow
* Database access operations
* Success and failure states

Sensitive information such as passwords, API keys, and environment variables are never logged.

---

## Deployment

### Application Hosting

Render

### Database Hosting

Neon PostgreSQL

### Public URL

```text
https://tara-agent.onrender.com
```

### API Endpoint

```text
POST /ask
```

### Tradeoffs

* Render free tier may introduce cold-start latency.
* Neon free tier has compute and storage limits.

---

## Assumptions

1. JSON input data is valid.
2. Fund IDs are unique.
3. Holdings reference valid fund IDs.
4. Latest NAV represents current market value.
5. Spending calculations exclude transfers.

---

## Known Limitations

* Keyword-based routing supports only implemented question types.
* Complex natural language queries are not fully supported.
* No authentication or user management layer is implemented.
* Free-tier infrastructure may increase response latency.

---

## Future Improvements

1. LLM-based query understanding.
2. Tool-based agent architecture.
3. Query caching.
4. Authentication and authorization.
5. Advanced observability dashboards.
6. Automated evaluation suite.

---

## Author

Pragya Pal

Provue Engineering Assignment
