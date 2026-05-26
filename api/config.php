<?php
// ─────────────────────────────────────────────────────────────────────────────
// Database credentials
// Fill these in AFTER you create the database on Hostinger cPanel.
// ─────────────────────────────────────────────────────────────────────────────
define('DB_HOST', 'localhost');       // Usually 'localhost' on Hostinger shared
define('DB_NAME', '');    // e.g.  u355801186_bkventure
define('DB_USER', '');    // e.g.  u355801186_bkventure
define('DB_PASS', 'Bkventure1');

// API key used to protect admin (write) operations.
// Must match ADMIN_PASSWORD in src/config.js
define('API_KEY', 'bkoption2026');

// ─────────────────────────────────────────────────────────────────────────────
// Opens and returns a mysqli connection, or sends a 500 and exits on failure.
// ─────────────────────────────────────────────────────────────────────────────
function db(): mysqli {
    static $conn = null;
    if ($conn !== null) return $conn;

    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
