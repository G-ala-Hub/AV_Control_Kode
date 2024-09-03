<?php
require_once __DIR__ . '/vendor/autoload.php'; // Ensure this path is correct

use Dotenv\Dotenv;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://127.0.0.1:5502");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log POST data
    file_put_contents('php://stderr', print_r($_POST, true));

    $cf_name = htmlspecialchars($_POST['cf-name'] ?? '');
    $cf_email = filter_var($_POST['cf-email'] ?? '', FILTER_SANITIZE_EMAIL);
    $cf_subject = htmlspecialchars($_POST['cf-subject'] ?? '');
    $cf_message = htmlspecialchars($_POST['cf-message'] ?? '');

    if (!filter_var($cf_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Invalid email address."]);
        exit();
    }

    $mailTo = $_ENV['EMAIL_RECIPIENT'];
    $headers = "From: ".$cf_email."\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $txt = "You have received an email from ".$cf_name.".\n\n".$cf_message;

    if (mail($mailTo, $cf_subject, $txt, $headers)) {
        header("Content-Type: application/json");
        echo json_encode(["message" => "Email sent successfully!"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Email sending failed."]);
    }
    exit();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request method."]);
}
?>
