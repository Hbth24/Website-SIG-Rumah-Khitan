// Inisialisasi Map
const map = L.map('map').setView([-6.990210244906605, 110.42287885444824], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = new Map(); // Store markers with location IDs
let editModal; // Bootstrap modal instance

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modal
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
});

const fetchLocations = async () => {
    try {
        const response = await fetch('ambil_lokasi.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
};

const populateTable = async () => {
    const locations = await fetchLocations();
    const tableBody = document.getElementById('locationTable');
    tableBody.innerHTML = '';
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers.clear();

    locations.forEach(location => {
        // Add marker
        const marker = L.marker([location.latitude, location.longitude]).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>${location.address}`);
        markers.set(location.id, marker);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${location.name}</td>
            <td>${location.address}</td>
            <td>${location.latitude}</td>
            <td>${location.longitude}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editLocation(${location.id}, '${location.name.replace(/'/g, "\\'")}', '${location.address.replace(/'/g, "\\'")}', ${location.latitude}, ${location.longitude})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteLocation(${location.id})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

const editLocation = (id, name, address, lat, lng) => {
    // Fill the edit form with location data
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editAddress').value = address;
    document.getElementById('editLat').value = lat;
    document.getElementById('editLng').value = lng;

    // Show the modal
    editModal.show();
};

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    
    try {
        const response = await fetch('edit.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.text();
        alert(result);
        
        // Hide the modal and refresh the table
        editModal.hide();
        await populateTable();
    } catch (error) {
        console.error('Error updating location:', error);
        alert('Terjadi kesalahan saat memperbarui lokasi');
    }
});

const addLocation = async () => {
    const name = prompt('Masukkan nama lokasi:');
    const address = prompt('Masukkan alamat:');
    const lat = parseFloat(prompt('Masukkan latitude:'));
    const lng = parseFloat(prompt('Masukkan longitude:'));

    if (name && address && !isNaN(lat) && !isNaN(lng)) {
        try {
            const response = await fetch('tambah.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    name, address, lat, lng
                })
            });

            const result = await response.text();
            alert(result);
            await populateTable();
        } catch (error) {
            console.error('Error adding location:', error);
            alert('Terjadi kesalahan saat menambah lokasi');
        }
    } else {
        alert('Data tidak valid.');
    }
};

// Simplified delete function
const deleteLocation = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
        try {
            const formData = new URLSearchParams();
            formData.append('id', id);

            const response = await fetch('delete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            
            const result = await response.text();
            alert(result);
            await populateTable();
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus lokasi');
        }
    }
};

// Initialize the table and map markers
populateTable();