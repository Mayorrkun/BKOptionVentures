-- BK Option Ventures - MySQL Database Schema
-- Run this file first in phpMyAdmin to create all tables

SET NAMES utf8mb4;
SET time_zone = '+01:00'; -- WAT (West Africa Time)

-- ─────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(60)      NOT NULL,
  name        VARCHAR(255)     NOT NULL,
  category    VARCHAR(100)     NOT NULL,
  price       DECIMAL(14, 2)   NOT NULL DEFAULT 0.00,
  price_unit  VARCHAR(20)      NOT NULL DEFAULT 'per day',
  type        ENUM('rental','sale') NOT NULL,
  description TEXT,
  stock       INT              DEFAULT NULL,  -- NULL for rentals, integer for sales
  created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Product Images  (one-to-many)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  product_id  VARCHAR(60)      NOT NULL,
  image_url   VARCHAR(500)     NOT NULL,
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_id (product_id),
  CONSTRAINT fk_pi_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Product Specs  (one-to-many)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_specs (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  product_id  VARCHAR(60)      NOT NULL,
  spec_text   VARCHAR(255)     NOT NULL,
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_id (product_id),
  CONSTRAINT fk_ps_product FOREIGN KEY (product_id)
    REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Contact Form Submissions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name       VARCHAR(255)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  phone      VARCHAR(60)   DEFAULT NULL,
  message    TEXT          NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
