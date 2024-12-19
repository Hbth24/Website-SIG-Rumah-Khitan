<?php
$host = "localhost";   // Sesuaikan
$user = "root";        // Sesuaikan
$pass = "";            // Sesuaikan
$db = "sig_pemetaan";  // Nama database

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
