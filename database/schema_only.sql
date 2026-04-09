USE student_ai;

CREATE TABLE IF NOT EXISTS app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'analyst',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_users (username, password, full_name, role) VALUES
('admin', '$2a$10$DUMMY_HASH', 'System Administrator', 'admin'),
('analyst', '$2a$10$DUMMY_HASH', 'Data Analyst', 'analyst');