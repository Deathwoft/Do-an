-- =========================================================
-- CO SO DU LIEU: CHAT ONLINE
-- He quan tri: MySQL 8.0+
-- Mo ta: CSDL quan ly tai khoan, cuoc tro chuyen va tin nhan
-- =========================================================

CREATE DATABASE IF NOT EXISTS chat_online
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chat_online;

-- 1. Tai khoan nguoi dung
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 2. Cuoc tro chuyen: ho tro phong chung va chat rieng
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_type ENUM('group', 'direct') NOT NULL DEFAULT 'direct',
    conversation_name VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Thanh vien cua moi cuoc tro chuyen
CREATE TABLE IF NOT EXISTS conversation_members (
    conversation_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    CONSTRAINT fk_members_conversation
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_members_user
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tin nhan
CREATE TABLE IF NOT EXISTS messages (
    message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    message_content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_conversation
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender
      FOREIGN KEY (sender_id) REFERENCES users(user_id)
      ON DELETE CASCADE,
    INDEX idx_messages_conversation_time (conversation_id, sent_at),
    INDEX idx_messages_sender (sender_id)
) ENGINE=InnoDB;

-- Tao san phong tro chuyen chung mac dinh
INSERT INTO conversations (conversation_type, conversation_name)
SELECT 'group', 'Phong chat chung'
WHERE NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE conversation_type = 'group'
      AND conversation_name = 'Phong chat chung'
);

-- =========================================================
-- Ket thuc tao CSDL.
-- Luu y: password_hash phai duoc tao bang ham bam mat khau
-- an toan o ung dung; khong luu mat khau dang van ban ro.
-- =========================================================
