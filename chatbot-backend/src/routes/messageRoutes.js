const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
    const limit = req.query.limit || 50;
    db.all(
        'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?',
        [limit],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

router.post('/', (req, res) => {
    const { content, sender } = req.body;
    
    if (!content || !sender) {
        res.status(400).json({ error: 'Content and sender are required' });
        return;
    }

    db.serialize(() => {
        db.run(
            'INSERT INTO messages (content, sender) VALUES (?, ?)',
            [content, sender],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const userMessageId = this.lastID;

                db.get(
                    `SELECT response FROM responses 
                     WHERE lower(?) LIKE '%' || lower(keyword) || '%'
                     ORDER BY length(keyword) DESC LIMIT 1`,
                    [content],
                    (err, row) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }

                        const botResponse = row ? row.response : 
                            "I'm not sure how to respond to that. Can you please rephrase?";

                        db.run(
                            'INSERT INTO messages (content, sender) VALUES (?, ?)',
                            [botResponse, 'bot'],
                            function(err) {
                                if (err) {
                                    res.status(500).json({ error: err.message });
                                    return;
                                }

                                res.json({
                                    userMessage: {
                                        id: userMessageId,
                                        content,
                                        sender,
                                        timestamp: new Date()
                                    },
                                    botResponse: {
                                        id: this.lastID,
                                        content: botResponse,
                                        sender: 'bot',
                                        timestamp: new Date()
                                    }
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    db.run(
        'DELETE FROM messages WHERE id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Message deleted' });
        }
    );
});

module.exports = router;