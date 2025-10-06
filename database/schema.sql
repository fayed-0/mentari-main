-- Database untuk Mentari Hospital Management System
-- Jalankan script ini di phpMyAdmin atau MySQL command line

CREATE DATABASE IF NOT EXISTS mentari_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mentari_db;

-- Tabel untuk menyimpan data spesialisasi
CREATE TABLE IF NOT EXISTS specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    -- Added 2025-09-25: column to support admin hide/show without deleting
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan data dokter
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    specialization_id INT,
    image VARCHAR(255),
    schedule TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    experience_years INT DEFAULT 0,
    education TEXT,
    biography TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (specialization_id) REFERENCES specializations(id) ON DELETE SET NULL
);

-- Tabel untuk menyimpan jadwal dokter
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Tabel untuk fasilitas rumah sakit
CREATE TABLE IF NOT EXISTS facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk testimonial
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_image VARCHAR(255),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    testimonial_text TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk pengaturan about us
CREATE TABLE IF NOT EXISTS about_us (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255),
    section VARCHAR(50) NOT NULL DEFAULT 'main',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data untuk spesialisasi
INSERT INTO specializations (name, slug, description, icon) VALUES
('Anestesi', 'anestesi', 'Pelayanan anestesi & perawatan intensif perioperatif', 'anastesi.svg'),
('Pediatri / Anak', 'pediatri', 'Kesehatan bayi, anak & remaja', 'baby.svg'),
('Bedah Anak', 'bedah-anak', 'Tindakan bedah khusus untuk pasien anak', 'bedah anak.svg'),
('Bedah Ortopedi', 'bedah-ortopedi', 'Bedah tulang, persendian & cedera muskuloskeletal', 'bedah ortopedi.svg'),
('Bedah Plastik', 'bedah-plastik', 'Rekonstruksi & estetik jaringan tubuh', 'bedah pelastik.svg'),
('Bedah Saraf', 'bedah-saraf', 'Bedah otak, tulang belakang & sistem saraf perifer', 'bedah saraf.svg'),
('Bedah Umum', 'bedah-umum', 'Tindakan bedah organ umum & emergensi', 'bedah umum.svg'),
('Kardiologi', 'kardiologi', 'Diagnostik & terapi penyakit jantung', 'cardiology.svg'),
('Kardiovaskular', 'kardiovaskular', 'Gangguan pembuluh darah & sistem vaskular', 'kardiovaskular.svg'),
('Gigi / Kedokteran Gigi', 'kedokteran-gigi', 'Perawatan kesehatan gigi & mulut', 'dentistry.svg'),
('Dermatologi', 'dermatologi', 'Kulit, rambut & kuku', 'dermatology.svg'),
('Endokrinologi', 'endokrinologi', 'Gangguan hormon & metabolisme', 'Endokrinologi.svg'),
('Gastroenterologi', 'gastroenterologi', 'Saluran cerna, hati & pankreas', 'Gastroenterologi.svg'),
('Nefrologi', 'nefrologi', 'Penyakit ginjal & gangguan fungsi ginjal', 'Nefrologi.svg'),
('Pulmonologi', 'pulmonologi', 'Penyakit paru & pernapasan', 'Pulmonologi.svg'),
('Urologi', 'urologi', 'Saluran kemih & sistem reproduksi pria', 'Urologi.svg'),
('Farmasi Klinik', 'farmasi', 'Manajemen terapi obat & informasi farmasi', 'farmasi.svg'),
('Fisioterapi', 'fisioterapi', 'Rehabilitasi fungsi gerak & fisik', 'fisioterapi.svg'),
('Rehabilitasi Klinik', 'rehabilitasi-klinik', 'Pemulihan pasca cedera & kondisi kronis', 'rehabilitas klinik.svg'),
('Geriatri', 'geriatri', 'Kesehatan usia lanjut terpadu', 'geriatri.svg'),
('Ginekologi', 'ginekologi', 'Kesehatan reproduksi wanita', 'ginekologi.svg'),
('Obstetri & Ginekologi', 'obstetri-ginekologi', 'Kehamilan, persalinan & reproduksi', 'gynecology.svg'),
('Gizi Klinik', 'gizi-klinik', 'Terapi nutrisi medis & dietetik', 'gizi klinik.svg'),
('Hematologi', 'hematologi', 'Gangguan darah & pembekuan', 'hematologi.svg'),
('Imunologi & Alergi', 'imunologi-alergi', 'Gangguan imun & reaksi alergi', 'imun&alergi.svg'),
('Penyakit Infeksi', 'penyakit-infeksi', 'Infeksi bakteri, virus & tropis', 'infeksi.svg'),
('Laktasi', 'laktasi', 'Konsultasi menyusui & manajemen ASI', 'laktasi.svg'),
('Mata / Oftalmologi', 'mata', 'Pemeriksaan & tindakan kesehatan mata', 'mata.svg'),
('Neurologi', 'neurologi', 'Gangguan otak, saraf & neuromuskular', 'neurologi.svg'),
('Onkologi', 'onkologi', 'Deteksi & terapi kanker terpadu', 'ongkologi.svg'),
('Perawatan Paliatif', 'perawatan-paliatif', 'Pendampingan nyeri & kualitas hidup pasien terminal', 'paliatif.svg'),
('Patologi Klinik', 'patologi-klinik', 'Analisa laboratorium diagnostik', 'patologi klinik.svg'),
('Perinatologi', 'perinatologi', 'Perawatan bayi baru lahir berisiko', 'perinatologi.svg'),
('Psikiatri', 'psikiatri', 'Kesehatan jiwa & gangguan psikiatrik', 'psikiatri.svg'),
('Psikologi Klinis', 'psikologi-klinis', 'Evaluasi & terapi psikologis klinis', 'psikologi klinis.svg'),
('Radiologi', 'radiologi', 'Pencitraan medis diagnostik & intervensi', 'radiologi.svg'),
('Reumatologi', 'reumatologi', 'Penyakit autoimun & sendi', 'reumatologi.svg'),
('THT (Otolaringologi)', 'tht', 'Telinga, hidung, tenggorok & terkait', 'tht.svg'),
('Perawatan Luka', 'perawatan-luka', 'Manajemen luka akut & kronis', 'woundcare.svg'),
('Kesehatan Tulang', 'kesehatan-tulang', 'Pencegahan & perawatan kesehatan tulang', 'bone.svg');

-- Insert sample data untuk dokter
INSERT INTO doctors (name, specialization, specialization_id, image, schedule, phone, email, experience_years, education) VALUES
('Dr. Ahmad Sutrisno, Sp.JP', 'Kardiologi', 7, 'doc1.jpg', 'Senin-Jumat: 08:00-14:00', '081234567890', 'ahmad.sutrisno@mentari.com', 15, 'Spesialis Jantung dan Pembuluh Darah, Universitas Indonesia'),
('Dr. Siti Nurhaliza, Sp.A', 'Anak', 16, 'doc2.jpg', 'Senin-Sabtu: 09:00-15:00', '081234567891', 'siti.nurhaliza@mentari.com', 12, 'Spesialis Anak, Universitas Gadjah Mada'),
('Dr. Budi Santoso, Sp.B', 'Bedah Umum', 6, 'doc3.jpg', 'Selasa-Kamis: 07:00-13:00', '081234567892', 'budi.santoso@mentari.com', 18, 'Spesialis Bedah Umum, Universitas Airlangga'),
('Dr. Maya Sari, Sp.M', 'Mata', 14, 'doc4.jpg', 'Senin-Jumat: 10:00-16:00', '081234567893', 'maya.sari@mentari.com', 10, 'Spesialis Mata, Universitas Padjadjaran');

-- Insert sample data untuk about us
INSERT INTO about_us (title, description, section, order_index) VALUES
('24 Jam Siaga', 'Rumah Sakit Mentari melayani pasien 24 jam setiap hari dengan tim medis yang profesional dan berpengalaman.', 'services', 1),
('Lokasi Strategis', 'Berlokasi di pusat kota dengan akses mudah dari berbagai arah, memudahkan pasien dan keluarga untuk berkunjung.', 'services', 2),
('Tim Medis Berpengalaman', 'Didukung oleh dokter spesialis dan tenaga medis berpengalaman dengan peralatan medis terkini.', 'services', 3);

-- Insert sample testimonial
INSERT INTO testimonials (patient_name, patient_image, rating, testimonial_text, is_featured, is_approved) VALUES
('Ibu Sari Wulandari', 'img1.png', 5, 'Pelayanan di RS Mentari sangat memuaskan. Dokter dan perawatnya sangat ramah dan profesional.', TRUE, TRUE),
('Bapak Joko Widodo', 'img2.png', 5, 'Fasilitas lengkap dan modern. Proses administrasi juga cepat dan mudah.', TRUE, TRUE);