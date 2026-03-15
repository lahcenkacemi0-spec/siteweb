<?php
// Database configuration
$host = 'localhost';
$db_name = 'portfolio_db';
$username = 'root'; // default for local xampp/wamp
$password = ''; // default for local xampp/wamp

// Supabase configuration
$supabase_url = 'https://ljdpeafhvtqurdqkzhnr.supabase.co';
$supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZHBlYWZodnRxdXJkcWt6aG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzQzOTEsImV4cCI6MjA4ODk1MDM5MX0._vmTOG-vfioazOf7pIPIo8hzAl7yxe1krKQfBAZO6GY';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Optional: Log local DB error or handle it silently if using Supabase
    // die("Connection failed: " . $e->getMessage());
}

/**
 * Helper function to interact with Supabase REST API
 */
function supabase_request($method, $table, $data = null) {
    global $supabase_url, $supabase_key;
    
    $url = $supabase_url . "/rest/v1/" . $table;
    $ch = curl_init($url);
    
    $headers = [
        "apikey: " . $supabase_key,
        "Authorization: Bearer " . $supabase_key,
        "Content-Type: application/json",
        "Prefer: return=minimal"
    ];
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === "POST") {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        "status" => $status_code,
        "response" => $response
    ];
}
?>
