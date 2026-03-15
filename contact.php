<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and provide a valid email.";
        exit;
    }

    try {
        // Send to Supabase
        $result = supabase_request("POST", "contact_messages", [
            "name" => $name,
            "email" => $email,
            "message" => $message
        ]);

        if ($result["status"] >= 200 && $result["status"] < 300) {
            http_response_code(200);
            echo "Thank you! Your message has been sent to Supabase.";
        } else {
            http_response_code(500);
            echo "Oops! Something went wrong with Supabase. Error: " . $result["response"];
        }
        
        // Also keep local DB as backup if $pdo exists
        if (isset($pdo)) {
            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message) VALUES (:name, :email, :message)");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':message', $message);
            $stmt->execute();
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo "Error: " . $e->getMessage();
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
