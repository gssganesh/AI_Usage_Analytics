var express = require('express');
var router = express.Router();

router.post('/send', async function(req, res) {
    try {
        var { title, text, target } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'Alert text is required' });

        var results = [];
        
        // Final configuration for recipients
        var allRecipients = [
            { 
                key: 'student',
                name: 'Student Notification', 
                token: process.env.TELEGRAM_BOT_TOKEN, 
                chat: process.env.TELEGRAM_CHAT_ID 
            },
            { 
                key: 'admin',
                name: 'Admin Notification', 
                token: process.env.TELEGRAM_BOT_TOKEN_ADMIN || process.env.TELEGRAM_BOT_TOKEN, 
                chat: process.env.TELEGRAM_CHAT_ID_ADMIN 
            }
        ];

        // Filter based on target if provided
        var recipients = allRecipients;
        if (target === 'student') recipients = allRecipients.filter(r => r.key === 'student');
        if (target === 'admin') recipients = allRecipients.filter(r => r.key === 'admin');

        for (var r of recipients) {
            if (!r.token || !r.chat) {
                console.log('Skipping ' + r.name + ' (Incomplete config)');
                continue;
            }

            try {
                var url = 'https://api.telegram.org/bot' + r.token + '/sendMessage';
                var s = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: r.chat,
                        text: '🚨 <b>' + title + '</b>\n\n' + text,
                        parse_mode: 'HTML'
                    })
                });
                var data = await s.json();
                results.push({ name: r.name, success: data.ok });
            } catch (err) {
                console.error('Failed ' + r.name + ':', err.message);
                results.push({ name: r.name, success: false, error: err.message });
            }
        }

        if (results.some(r => r.success)) {
            res.json({ 
                success: true, 
                message: 'Alerts processed (' + results.filter(r => r.success).length + '/' + recipients.filter(rc => rc.token && rc.chat).length + ' delivered)',
                details: results 
            });
        } else {
            res.status(500).json({ success: false, message: 'All notification attempts failed', details: results });
        }
    } catch (error) {
        console.error('Global SMS error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to process alerts: ' + error.message });
    }
});

module.exports = router;