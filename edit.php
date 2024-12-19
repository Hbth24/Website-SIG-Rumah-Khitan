<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data dari formulir
    $id = intval($_POST['id']);
    $name = trim($_POST['name']);
    $address = trim($_POST['address']);
    $lat = floatval($_POST['lat']);
    $lng = floatval($_POST['lng']);

    // Validasi data
    if ($id && $name && $address && is_numeric($lat) && is_numeric($lng)) {
        // Query update data
        $stmt = $conn->prepare("UPDATE locations SET name=?, address=?, latitude=?, longitude=? WHERE id=?");
        $stmt->bind_param("ssdsi", $name, $address, $lat, $lng, $id);

        if ($stmt->execute()) {
            echo "Lokasi berhasil diperbarui!";
        } else {
            echo "Kesalahan saat memperbarui lokasi: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Data tidak valid!";
    }
} else {
    echo "Permintaan tidak valid.";
}

$conn->close();
?>
