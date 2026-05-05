<?php
declare(strict_types=1);

function sanitize_single_line(string $value): string {
    $value = trim($value);
    // Prevent header/body injection via new lines.
    $value = preg_replace("/[\r\n]+/", " ", $value) ?? '';
    // Remove null bytes.
    $value = str_replace("\0", '', $value);
    return $value;
}

function redirect_to(string $url): void {
    header("Location: " . $url);
    exit;
}

$name = isset($_POST['name']) ? (string)$_POST['name'] : '';
$email = isset($_POST['email']) ? (string)$_POST['email'] : '';
$phone = isset($_POST['phone']) ? (string)$_POST['phone'] : '';
$message = isset($_POST['message']) ? (string)$_POST['message'] : '';

$name = sanitize_single_line($name);
$email = sanitize_single_line($email);
$phone = trim($phone);
$message = trim($message);

// Phone can only be "+<countrycode><digits>"
$phone = preg_replace('/\s+/', '', $phone) ?? '';
$phone = str_replace("\0", '', $phone);

$isNameValid = preg_match('/^[A-Za-z ]{2,}$/', $name) === 1;
$isEmailValid = filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
$isPhoneValid = preg_match('/^\+\d{7,15}$/', $phone) === 1;
$isMessageValid = mb_strlen($message) >= 10;

if (!($isNameValid && $isEmailValid && $isPhoneValid && $isMessageValid)) {
    redirect_to('pages/contact.html?status=error');
}

$subject = 'New Contact Message - Al Qamar Perfumes';
$to = 'alqamarperfumes1@gmail.com';

$dateTime = date('Y-m-d H:i:s T');
$body = ""
    . "New Contact Message - Al Qamar Perfumes\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Message:\n{$message}\n\n"
    . "Date/Time: {$dateTime}\n";

// Basic, safe headers for plain text email.
$from = 'no-reply@mqperfume.com';
$emailForReplyTo = preg_replace("/[\r\n]+/", '', $email) ?? $email;
$headers = ""
    . "MIME-Version: 1.0\r\n"
    . "Content-type: text/plain; charset=UTF-8\r\n"
    . "From: Al Qamar Perfumes <{$from}>\r\n"
    . "Reply-To: {$emailForReplyTo}\r\n";

// Suppress mail() warnings; redirects must still occur.
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    redirect_to('pages/contact.html?status=success&mail=1');
}

redirect_to('pages/contact.html?status=error&mail=0');

