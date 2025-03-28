const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Remote database host (not localhost)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("MySQL Connected...");
});

// CRUD Routes (No changes needed)
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [name, email], (err, result) => {
        if (err) throw err;
        res.json({ message: "User created!", id: result.insertId });
    });
});

app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = "UPDATE users SET name=?, email=? WHERE id=?";
    db.query(sql, [name, email, id], (err, result) => {
        if (err) throw err;
        res.json({ message: "User updated!" });
    });
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: "User deleted!" });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000...");
});
