<?php 
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id > 0) {
        // Gunakan prepared statement untuk keamanan
        $stmt = $conn->prepare("DELETE FROM locations WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo "Lokasi berhasil dihapus!";
        } else {
            echo "Error menghapus lokasi: " . $stmt->error;
        }
        
        $stmt->close();
    } else {
        echo "ID tidak valid!";
    }
} else {
    echo "Metode request tidak valid!";
}

$conn->close();
?>