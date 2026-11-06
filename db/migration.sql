-- KertaMarga Bali: skema auth MySQL MariaDB
-- Jalankan dengan: mysql -u <user> -p < db/migration.sql
-- Atau sesuaikan nama database sebelum eksekusi

CREATE DATABASE IF NOT EXISTS kertamarga_bali CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kertamarga_bali;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  identifier VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('siswa', 'guru') NOT NULL DEFAULT 'siswa',
  interests JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_identifier (identifier),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User aplikasi dengan hak akses terbatas, ganti password setelah dibaca
CREATE USER IF NOT EXISTS 'kertamarga_app'@'localhost' IDENTIFIED BY 'ganti-dengan-password-kuat';
CREATE USER IF NOT EXISTS 'kertamarga_app'@'127.0.0.1' IDENTIFIED BY 'ganti-dengan-password-kuat';
GRANT SELECT, INSERT, UPDATE, DELETE ON kertamarga_bali.users TO 'kertamarga_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON kertamarga_bali.users TO 'kertamarga_app'@'127.0.0.1';
FLUSH PRIVILEGES;
