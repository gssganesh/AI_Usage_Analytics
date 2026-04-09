const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

var JWT_SECRET = 'student_ai_performance_secret_key_2024';

// POST /api/auth/signup
router.post('/signup', async function(req, res) {
    try {
        var username = req.body.username;
        var password = req.body.password;
        var fullName = req.body.full_name || username;

        // ADD THESE TWO LINES HERE
        console.log('--- NEW SIGNUP ATTEMPT ---');
        console.log('Username:', username, '| Full Name:', fullName);

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters.' });
        }
        if (password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters.' });
        }

        var rows = await db.query('SELECT id FROM app_users WHERE username = ?', [username]);
        if (rows[0].length > 0) {
            console.log('SIGNUP FAILED: Username already exists');
            return res.status(400).json({ message: 'Username already exists.' });
        }

        var hash = bcrypt.hashSync(password, 10);
        await db.query(
            'INSERT INTO app_users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
            [username, hash, fullName, 'analyst']
        );

        // ADD THIS LINE HERE
        console.log('SIGNUP SUCCESS: User "' + username + '" saved to database');

        var token = jwt.sign(
            { id: 0, username: username, role: 'analyst', full_name: fullName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token: token,
            user: { id: 0, username: username, role: 'analyst', full_name: fullName }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// POST /api/auth/login
router.post('/login', async function(req, res) {
    try {
        var username = req.body.username;
        var password = req.body.password;

        // ADD THESE TWO LINES
        console.log('--- LOGIN ATTEMPT ---');
        console.log('Username:', username);

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        var rows = await db.query('SELECT * FROM app_users WHERE username = ?', [username]);
        rows = rows[0];

        if (!rows || rows.length === 0) {
            console.log('LOGIN FAILED: User not found');
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        var user = rows[0];
        var isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            console.log('LOGIN FAILED: Wrong password');
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // ADD THIS LINE
        console.log('LOGIN SUCCESS: "' + username + '" logged in as ' + user.role);

        var token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                full_name: user.full_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// GET /api/auth/verify
router.get('/verify', function(req, res) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'No token' });
    }
    var token = authHeader.split(' ')[1];
    try {
        var decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: { id: decoded.id, username: decoded.username, role: decoded.role, full_name: decoded.full_name } });
    } catch (e) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});
module.exports = router;