const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const dbPath = process.env.DB_PATH || path.join(__dirname, "chatbot.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to SQLite database");
    initializeDatabase();
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                sender TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword TEXT NOT NULL,
                response TEXT NOT NULL
            )
        `);

        db.run(`
            INSERT OR IGNORE INTO responses (keyword, response) VALUES 
            ('hello', 'Hi there! How can I help you today?'),
            ('help', 'I can assist you with general inquiries, provide information, or help you navigate our services.'),
            ('bye', 'Goodbye! Have a great day!'),
            ('thanks', 'You''re welcome! Let me know if you need anything else.'),
            ('time', 'The current time is ' || datetime('now', 'localtime')),
            ('name', 'My name is Cleo.'),
            ('day', 'Today is ' || strftime('%A', 'now', 'localtime') || '.'),
            ('meaning', 'Cleo means "glory" or "pride" and is derived from the Greek word "kleos".')
        `);
    });
}

module.exports = db;
