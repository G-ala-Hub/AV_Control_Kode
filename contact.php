<?php
require_once __DIR__ . '/vendor/autoload.php'; // Ensure this path is correct

use Dotenv\Dotenv;
use Respect\Validation\Validator as v;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__, '.env.production');
$dotenv->load();

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: https://www.avcontrolkode.com.au");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log POST data for debugging
    file_put_contents('php://stderr', print_r($_POST, true));

    // Sanitize and validate inputs
    $cf_name = htmlspecialchars($_POST['cf-name'] ?? '', ENT_QUOTES, 'UTF-8');
    $cf_email = filter_var($_POST['cf-email'] ?? '', FILTER_SANITIZE_EMAIL);
    $cf_subject = htmlspecialchars($_POST['cf-subject'] ?? '', ENT_QUOTES, 'UTF-8');
    $cf_message = htmlspecialchars($_POST['cf-message'] ?? '', ENT_QUOTES, 'UTF-8');

    // Validate email format
    if (!filter_var($cf_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Invalid email address."]);
        exit();
    }

    // Validate name and message length
    if (empty($cf_name) || empty($cf_message)) {
        echo json_encode(["error" => "Name and message are required."]);
        exit();
    }

    // Prevent email header injection
    if (preg_match("/[\r\n]/", $cf_email)) {
        echo json_encode(["error" => "Invalid email format (header injection attempt detected)."]);
        exit();
    }

    // Use environment variables for recipient email and other settings
    $mailTo = $_ENV['EMAIL_RECIPIENT'];

    // Prepare email headers
    $headers = "From: ".$cf_email."\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $txt = "You have received an email from ".$cf_name.".\n\n".$cf_message;

    // Send email
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
