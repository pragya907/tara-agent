# Tara Finance Research Agent

A finance research agent built for the Provue Engineering Take-Home Assignment.

---

## Overview

Tara Finance Research Agent answers finance-related questions using transaction, fund, NAV, and holdings data stored in PostgreSQL.

The system ingests financial snapshots from JSON files into PostgreSQL and exposes a REST API endpoint (`POST /ask`) that returns human-readable answers generated from database queries.

---

## Features

* Ingests financial data from JSON files into PostgreSQL
* Provides REST API endpoints
* Computes total spending
* Identifies top spending categories
* Identifies top merchants
* Calculates portfolio value
* Calculates fund returns
* Calculates holding performance
* Uses PostgreSQL as the single source of truth
* Returns JSON responses

---

## Tech Stack

* TypeScript
* Node.js
* Express
* PostgreSQL
* Mastra
* Neon PostgreSQL
* Render

---

## Project Structure

```text
src/
└── mastra/
    ├── scripts/
    │   └── ingest.ts
    └── server.ts
```

---

## Database Schema

### transactions

Stores spending activity.

Columns:

* id
* date
* merchant
* category
* amount
* currency
* memo

### funds

Stores fund metadata.

Columns:

* fund_id
* fund_name
* category

### fund_navs

Stores historical NAV data.

Columns:

* id
* fund_id
* nav_date
* nav

### holdings

Stores owned investments.

Columns:

* id
* fund_id
* fund_name
* units
* purchase_date
* purchase_nav

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
```

Example:

```env
DATABASE_URL=postgresql://username:password@host/database
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Data Ingestion

Import sample datasets into PostgreSQL:

```bash
npx tsx src/mastra/scripts/ingest.ts
```

Expected Output:

```text
Loaded transactions
Loaded funds
Loaded holdings
```

---

## Run Server

Start the application:

```bash
npx tsx src/mastra/server.ts
```

Expected Output:

```text
Server running on port 3000
```

---

## API Documentation

### Health Check

**GET /**

Response:

```json
{
  "message": "Provue Tara API Running"
}
```

---

### Ask Endpoint

**POST /ask**

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

## Supported Questions

Examples:

* What is my total spending?
* What is my top spending category?
* Who are my top merchants?
* What is my portfolio value?
* Show fund returns
* Show holding returns

---

## Deployment

### Public URL

https://tara-agent.onrender.com

### API Endpoint

POST https://tara-agent.onrender.com/ask

### Example Request

```bash
curl -X POST https://tara-agent.onrender.com/ask \
-H "Content-Type: application/json" \
-d "{\"question\":\"what is my total spending?\"}"
```

---

## Deployment Stack

### Application Hosting

* Render

### Database Hosting

* Neon PostgreSQL

---

## Assumptions

* Input JSON files are valid.
* Fund IDs are unique.
* Holdings reference valid fund IDs.
* Latest NAV is treated as current NAV.
* Spending calculations exclude transfers.

---

## Known Limitations

* Keyword-based routing supports predefined question types.
* Complex natural language queries are not fully supported.
* Render free tier may introduce cold-start latency.
* No authentication layer is implemented.

---

## Author

Pragya Pal

Provue Engineering Assignment Submission
