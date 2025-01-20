const express = require('express');
const cors = require('cors');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/messages', messageRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});