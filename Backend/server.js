const express = require("express");
const mysql = require('mysql2/promise'); // Using promise interface
const cors = require("cors");
const fs = require('fs');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Pool (better for production)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/etc/secrets/ca.pem')
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on startup
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL Connected...");
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}
testConnection();

// CRUD Routes with async/await
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const [result] = await pool.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        res.json({ message: "User created!", id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        await pool.execute(
            "UPDATE users SET name=?, email=? WHERE id=?",
            [name, email, id]
        );
        res.json({ message: "User updated!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute("DELETE FROM users WHERE id=?", [id]);
        res.json({ message: "User deleted!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000...");
});