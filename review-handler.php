<?php
declare(strict_types=1);

function sanitize_single_line(string $value): string {
    $value = trim($value);
    // Prevent header/body injection via new lines.
    $value = preg_replace("/[\r\n]+/", " ", $value) ?? '';
    $value = str_replace("\0", '', $value);
    return $value;
}

function redirect_to(string $url): void {
    header("Location: " . $url);
    exit;
}

$ratingRaw = isset($_POST['rating']) ? (string)$_POST['rating'] : '';
$experience = isset($_POST['experience']) ? (string)$_POST['experience'] : '';
$query = isset($_POST['query']) ? (string)$_POST['query'] : '';
$suggestions = isset($_POST['suggestions']) ? (string)$_POST['suggestions'] : '';
$repurchaseLikelihood = isset($_POST['repurchase_likelihood']) ? (string)$_POST['repurchase_likelihood'] : '';

$ratingRaw = sanitize_single_line($ratingRaw);
$experience = trim($experience);
$query = sanitize_single_line($query);
$suggestions = sanitize_single_line($suggestions);
$repurchaseLikelihood = sanitize_single_line($repurchaseLikelihood);

$allowedLikelihoods = [
    'very_unlikely',
    'unlikely',
    'neutral',
    'likely',
    'very_likely',
];

$rating = ctype_digit($ratingRaw) ? (int)$ratingRaw : 0;
$isRatingValid = $rating >= 1 && $rating <= 5;
$isExperienceValid = mb_strlen($experience) >= 15;
$queryTrimmed = trim($query);
$suggestionsTrimmed = trim($suggestions);

$isLikelihoodValid = in_array($repurchaseLikelihood, $allowedLikelihoods, true);

if (!($isRatingValid && $isExperienceValid && $isLikelihoodValid)) {
    redirect_to('pages/about.html?status=error');
}

$to = 'perfumesmq1@gmail.com';
$subject = 'New Customer Review - Al Qamar Perfumes';
$dateTime = date('Y-m-d H:i:s T');

$body = ""
    . "New Customer Review - Al Qamar Perfumes\n\n"
    . "Rating: {$rating} / 5\n"
    . "Experience:\n{$experience}\n\n"
    . "Query: " . ($queryTrimmed !== '' ? $queryTrimmed : 'N/A') . "\n"
    . "Suggestions: " . ($suggestionsTrimmed !== '' ? $suggestionsTrimmed : 'N/A') . "\n"
    . "Likelihood to purchase again: {$repurchaseLikelihood}\n\n"
    . "Date/Time: {$dateTime}\n";

$from = 'no-reply@alqamarperfumes.com';
$headers = ""
    . "MIME-Version: 1.0\r\n"
    . "Content-type: text/plain; charset=UTF-8\r\n"
    . "From: Al Qamar Perfumes <{$from}>\r\n";

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    redirect_to('pages/about.html?status=success&mail=1');
}

redirect_to('pages/about.html?status=error&mail=0');

