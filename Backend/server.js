const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "userdb",
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Create User
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [name, email], (err, result) => {
        if (err) throw err;
        res.json({ message: "User created!", id: result.insertId });
    });
});

// Read Users
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update User
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = "UPDATE users SET name=?, email=? WHERE id=?";
    db.query(sql, [name, email, id], (err, result) => {
        if (err) throw err;
        res.json({ message: "User updated!" });
    });
});

// Delete User
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: "User deleted!" });
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000...");
});
    