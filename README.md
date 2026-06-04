# Tara Finance Research Agent

A finance-research agent built for the Provue Engineering Take-Home Assignment.

## Features

* Ingests financial data from JSON files into PostgreSQL
* Provides a REST API endpoint (`POST /ask`)
* Answers spending and portfolio-related questions
* Computes:

  * Total spending
  * Top spending category
  * Top merchants
  * Portfolio value
  * Fund returns
  * Holding performance
* Uses PostgreSQL as the source of truth

---

## Tech Stack

* TypeScript
* Node.js
* Express
* PostgreSQL
* Mastra

---

## Project Structure

src/mastra/
├── scripts/
│ └── ingest.ts
├── server.ts

---

## Database Setup

Create a PostgreSQL database:

CREATE DATABASE provue_tara;

Update `.env`:

DATABASE_URL=your_postgres_connection_string

---

## Install Dependencies

npm install

---

## Data Ingestion

Load sample data into PostgreSQL:

npx tsx src/mastra/scripts/ingest.ts

Expected Output:

Loaded transactions
Loaded funds
Loaded holdings
All data imported successfully

---

## Run Server

npx tsx src/mastra/server.ts

Expected Output:

Server running on http://localhost:3000

---

## API Usage

### Health Check

GET /

Response:

{
"message": "Provue Tara API Running"
}

---

### Ask Endpoint

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

## Supported Questions

* What is my total spending?
* What is my top spending category?
* Who are my top merchants?
* What is my portfolio value?
* Show fund returns
* Show holding returns

---

## Deployment

The application can be deployed on:

* Render
* Railway
* Fly.io

---

## Author

Pragya Pal
Provue Engineering Assignment Submission
