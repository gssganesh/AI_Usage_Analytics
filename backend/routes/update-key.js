const express = require('express');
const router = express.Router();

router.post('/update-key', async function(req, res) {
    try {
        var fs = require('fs');
        var config = require('../config.json');

        if (!config.telegram_bot_token || config.telegram_bot_token === 'YOUR_MASTER_KEY_HERE') {
            return res.json({ success: false, action: 'missing', message: 'config.json is missing or token placeholder is not replaced.' });
        }

        try {
            await fetch('https://api.telegram.org/bot' + config.telegram_bot_token + '/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Old tokens revoked.');
        } catch (e) {
            console.log('Revoke failed (this is ok):', e.message);
        }

        var createResult = await fetch('https://api.telegram.org/bot' + config.telegram_bot_token + '/createToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Student AI Alert Token',
                scopes: ['send_messages'],
                user_id: Number(config.telegram_chat_id)
            })
        });

        var result = await createResult.json();

        if (!result.ok) {
            return res.json({ success: false, action: 'bot_error', message: 'Telegram error: ' + result.description });
        }

        config.telegram_bot_token = result.result;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        console.log('New token saved! Try the alert button in 10 seconds.');
        res.json({ success: true, message: 'New token generated. Try the alert button now.' });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: 'Error: ' + error.message });
    }
});

module.exports = router;