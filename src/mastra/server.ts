import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Provue Tara API Running" });
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const q = String(question || "").toLowerCase();

  try {
    if (q.includes("total") && q.includes("spending")) {
      const result = await pool.query(`
        SELECT SUM(amount) AS total
        FROM transactions
        WHERE category <> 'transfer'
      `);

      return res.json({
        answer: `Your total spending excluding transfers is ₹${Number(result.rows[0].total).toFixed(2)}.`,
      });
    }

    if (q.includes("top") && q.includes("category")) {
      const result = await pool.query(`
        SELECT category, SUM(amount) AS total
        FROM transactions
        WHERE category <> 'transfer'
        GROUP BY category
        ORDER BY total DESC
        LIMIT 1
      `);

      return res.json({
        answer: `Your top spending category is ${result.rows[0].category} with ₹${Number(result.rows[0].total).toFixed(2)}.`,
      });
    }

    if (q.includes("top") && q.includes("merchant")) {
      const result = await pool.query(`
        SELECT merchant, SUM(amount) AS total
        FROM transactions
        WHERE category <> 'transfer'
        GROUP BY merchant
        ORDER BY total DESC
        LIMIT 5
      `);

      const list = result.rows
        .map((r, i) => `${i + 1}. ${r.merchant}: ₹${Number(r.total).toFixed(2)}`)
        .join("; ");

      return res.json({ answer: `Your top merchants are: ${list}` });
    }

    if (q.includes("health")) {
      const result = await pool.query(`
        SELECT SUM(amount) AS total
        FROM transactions
        WHERE category = 'health'
      `);

      return res.json({
        answer: `Total health spending: ₹${Number(result.rows[0].total).toFixed(2)}`,
      });
    }

    if (q.includes("portfolio")) {
      const result = await pool.query(`
        SELECT 
          SUM(h.units * latest.nav) AS current_value,
          SUM((h.units * latest.nav) - (h.units * h.purchase_nav)) AS gain
        FROM holdings h
        JOIN LATERAL (
          SELECT nav
          FROM fund_navs fn
          WHERE fn.fund_id = h.fund_id
          ORDER BY nav_date DESC
          LIMIT 1
        ) latest ON true
      `);

      return res.json({
        answer: `Your portfolio is worth ₹${Number(result.rows[0].current_value).toFixed(2)}. Your total gain/loss is ₹${Number(result.rows[0].gain).toFixed(2)}.`,
      });
    }

    if (q.includes("holding") || q.includes("realised return")) {
      const result = await pool.query(`
        SELECT 
          h.fund_name,
          ((h.units * latest.nav) - (h.units * h.purchase_nav)) AS gain,
          (((latest.nav - h.purchase_nav) / h.purchase_nav) * 100) AS return_percent
        FROM holdings h
        JOIN LATERAL (
          SELECT nav
          FROM fund_navs fn
          WHERE fn.fund_id = h.fund_id
          ORDER BY nav_date DESC
          LIMIT 1
        ) latest ON true
        ORDER BY return_percent DESC
      `);

      const list = result.rows
        .map((r) => `${r.fund_name}: ₹${Number(r.gain).toFixed(2)}, ${Number(r.return_percent).toFixed(2)}%`)
        .join("; ");

      return res.json({ answer: `Your holdings realised returns are: ${list}` });
    }

    if (q.includes("fund") && q.includes("return")) {
      const result = await pool.query(`
        SELECT 
          f.fund_name,
          (((last_nav.nav - first_nav.nav) / first_nav.nav) * 100) AS return_percent
        FROM funds f
        JOIN LATERAL (
          SELECT nav FROM fund_navs fn
          WHERE fn.fund_id = f.fund_id
          ORDER BY nav_date ASC
          LIMIT 1
        ) first_nav ON true
        JOIN LATERAL (
          SELECT nav FROM fund_navs fn
          WHERE fn.fund_id = f.fund_id
          ORDER BY nav_date DESC
          LIMIT 1
        ) last_nav ON true
        ORDER BY return_percent DESC
      `);

      const list = result.rows
        .map((r) => `${r.fund_name}: ${Number(r.return_percent).toFixed(2)}%`)
        .join("; ");

      return res.json({ answer: `Fund returns are: ${list}` });
    }

    return res.json({
      answer:
        "I can answer questions about total spending, top category, top merchants, health spending, portfolio value, holdings return, and fund return.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "Database error" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 