var express = require('express');
var cors = require('cors');
var bcrypt = require('bcryptjs');
var dotenv = require('dotenv');
dotenv.config();

var db = require('./config/db');
var authMiddleware = require('./middleware/authMiddleware');
var authRoutes = require('./routes/auth');
var studentRoutes = require('./routes/students');
var exportRoutes = require('./routes/export');
var updateKeyRoute = require('./routes/update-key');
var smsRoutes = require('./routes/sms');

var app = express();
var PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/export', authMiddleware, exportRoutes);
app.use('/api/sms/update-key', authMiddleware, updateKeyRoute);
app.use('/api/sms', authMiddleware, smsRoutes);

app.get('/api/health', function(req, res) {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function initializeDefaults() {
    try {
        await db.query(
            'CREATE TABLE IF NOT EXISTS app_users (' +
            'id INT AUTO_INCREMENT PRIMARY KEY,' +
            'username VARCHAR(50) UNIQUE NOT NULL,' +
            'password VARCHAR(255) NOT NULL,' +
            'full_name VARCHAR(100),' +
            'role VARCHAR(20) DEFAULT "analyst",' +
            'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP' +
            ')'
        );

        var adminHash = bcrypt.hashSync('admin123', 10);
        await db.query(
            'INSERT IGNORE INTO app_users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
            ['admin', adminHash, 'System Administrator', 'admin']
        );
        console.log('Admin ready -> admin / admin123');

        var analystHash = bcrypt.hashSync('analyst123', 10);
        await db.query(
            'INSERT IGNORE INTO app_users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
            ['analyst', analystHash, 'Data Analyst', 'analyst']
        );
        console.log('Analyst ready -> analyst / analyst123');
    } catch (error) {
        console.error('Init error:', error.message);
    }
}

app.listen(PORT, function() {
    console.log('Backend running on http://localhost:5000');
    initializeDefaults();
});