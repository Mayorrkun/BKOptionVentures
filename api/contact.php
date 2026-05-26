<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$body    = json_decode(file_get_contents('php://input'), true);
$name    = trim($body['name']    ?? '');
$email   = trim($body['email']   ?? '');
$phone   = trim($body['phone']   ?? '');
$message = trim($body['message'] ?? '');

// Basic validation
if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'name, email, and message are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit;
}

$db   = db();
$stmt = $db->prepare("INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $name, $email, $phone, $message);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not save your message. Please try again.']);
    $stmt->close();
    exit;
}

$stmt->close();
echo json_encode(['success' => true]);
