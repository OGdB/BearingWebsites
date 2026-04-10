<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'missing_fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'invalid_email']);
    exit;
}

if ($recaptcha_response === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'recaptcha_missing']);
    exit;
}

$ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret'   => RECAPTCHA_SECRET_KEY,
    'response' => $recaptcha_response,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$result = curl_exec($ch);
curl_close($ch);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'recaptcha_unreachable']);
    exit;
}

$recaptcha_data = json_decode($result, true);
if (empty($recaptcha_data['success'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'recaptcha_failed']);
    exit;
}

$safe_name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$safe_message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$to      = 'info@techassistent.nl';
$subject = '=?UTF-8?B?' . base64_encode('Contactformulier TechAssistent – ' . $safe_name) . '?=';
$body    = "Naam:    $safe_name\r\nE-mail:  $email\r\n\r\nBericht:\r\n$safe_message";
$headers = implode("\r\n", [
    'From: noreply@techassistent.nl',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
]);

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'send_failed']);
}
