# DESIGN.md

## Overview

The Tara Finance Research Agent is a backend service that answers finance-related questions using financial transaction and portfolio data stored in PostgreSQL.

The system loads JSON datasets into PostgreSQL and exposes a REST API endpoint (`POST /ask`) that translates user questions into database queries and returns human-readable answers.

---

## Architecture

User
↓
POST /ask
↓
Express Server
↓
Business Logic
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

and inserts the data into PostgreSQL.

File:

src/mastra/scripts/ingest.ts

---

### 2. Database Layer

PostgreSQL is used as the primary datastore.

Tables:

#### transactions

Stores user spending activity.

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

Stores NAV history.

Columns:

* fund_id
* nav_date
* nav

#### holdings

Stores portfolio holdings.

Columns:

* fund_id
* fund_name
* units
* purchase_date
* purchase_nav

---

### 3. API Layer

Endpoint:

POST /ask

Request:

{
"question": "What is my total spending?"
}

Response:

{
"answer": "Your total spending is ₹3547816.19"
}

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

Questions are matched using keyword-based routing and mapped to SQL queries.

---

## Design Decisions

### PostgreSQL

Chosen because:

* Structured relational data
* Strong SQL support
* Easy aggregation and analytics

### Express

Chosen because:

* Lightweight
* Easy REST API development
* Fast integration with PostgreSQL

### JSON Import Pipeline

Data is provided as JSON files in the assignment.

A dedicated ingestion script imports data once into PostgreSQL so analytical queries can be executed efficiently.

---

## Assumptions

1. JSON data is valid.
2. Fund IDs are unique.
3. Holdings reference valid fund IDs.
4. Latest NAV represents current fund value.
5. Spending calculations exclude transfers.

---

## Future Improvements

1. Natural language query classification using LLMs.
2. Tool-based agent architecture.
3. Query caching.
4. Authentication and user accounts.
5. Observability and monitoring dashboards.
6. Deployment scaling and rate limiting.

---

## Author

Pragya Pal

Provue Engineering Assignment
