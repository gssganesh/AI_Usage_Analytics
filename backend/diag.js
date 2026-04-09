require('dotenv').config({ path: '../backend/.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM olsstudent_ai_dataset_csv');
        fs.writeFileSync('db_result.txt', 'COUNT: ' + rows[0].count);
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('db_result.txt', 'ERROR: ' + e.message);
        process.exit(1);
    }
}
check();
