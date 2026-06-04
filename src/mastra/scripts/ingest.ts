import dotenv from "dotenv";
import { Pool } from "pg";
import fs from "fs";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ingest() {
  try {
    const transactions = JSON.parse(
      fs.readFileSync("../data/sample_a/transactions.json", "utf-8")
    );

    const funds = JSON.parse(
      fs.readFileSync("../data/sample_a/funds.json", "utf-8")
    );

    const holdings = JSON.parse(
      fs.readFileSync("../data/sample_a/holdings.json", "utf-8")
    );

    console.log(`Loaded ${transactions.length} transactions`);
    console.log(`Loaded ${funds.length} funds`);
    console.log(`Loaded ${holdings.length} holdings`);

    for (const fund of funds) {
      await pool.query(
        `
        INSERT INTO funds (fund_id, fund_name, category)
        VALUES ($1, $2, $3)
        ON CONFLICT (fund_id) DO NOTHING
        `,
        [fund.id, fund.name, fund.category]
      );

      for (const nav of fund.nav) {
        await pool.query(
          `
          INSERT INTO fund_navs (fund_id, nav_date, nav)
          VALUES ($1, $2, $3)
          `,
          [fund.id, nav.date, nav.value]
        );
      }
    }

    for (const txn of transactions) {
      await pool.query(
        `
        INSERT INTO transactions
        (id, date, merchant, category, amount, currency, memo)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (id) DO NOTHING
        `,
        [txn.id, txn.date, txn.merchant, txn.category, txn.amount, txn.currency, txn.memo]
      );
    }

    for (const holding of holdings) {
      await pool.query(
        `
        INSERT INTO holdings
        (fund_id, fund_name, units, purchase_date, purchase_nav)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          holding.fund_id,
          holding.fund_name,
          holding.units,
          holding.purchase_date,
          holding.purchase_nav,
        ]
      );
    }

    console.log("All data imported successfully!");

    await pool.end();
  } catch (error) {
    console.error(error);
  }
}

ingest();