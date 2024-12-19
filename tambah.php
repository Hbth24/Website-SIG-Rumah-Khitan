<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $address = $_POST['address'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];

    if (!empty($name) && !empty($address) && is_numeric($lat) && is_numeric($lng)) {
        $sql = "INSERT INTO locations (name, address, latitude, longitude) 
                VALUES ('$name', '$address', '$lat', '$lng')";

        if ($conn->query($sql) === TRUE) {
            echo "Lokasi berhasil ditambahkan!";
        } else {
            echo "Kesalahan: " . $conn->error;
        }
    } else {
        echo "Data tidak valid!";
    }
}
$conn->close();
?>
