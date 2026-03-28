-- Alphagnito CRM Database Setup Script
-- Run this file to initialize the database schema

CREATE DATABASE IF NOT EXISTS alphagnito_crm;
USE alphagnito_crm;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  agent_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  properties INT DEFAULT 0,
  inspections INT DEFAULT 0,
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_company (company_name)
);

-- Sample data for agents
INSERT INTO agents (agent_name, company_name, email, phone, properties, inspections, status) VALUES
('Michael', 'Bluenest reality', 'michael@bluenest.com', '+44 7911 234567', 18, 42, 'Active'),
('Olivia Harris', 'Urbankey estates', 'olivia@urbankey.com', '+44 8911 234567', 2, 10, 'Active'),
('Daniel', 'Bluenest reality', 'daniel@primelet.com', '+44 7822 456789', 18, 20, 'Inactive'),
('Wilson', 'City homes', 'wilson@cityhomes.com', '+44 7822 456789', 10, 10, 'Active'),
('Sophie', 'City homes', 'sophie@cityhomes.com', '+44 7700 112233', 12, 10, 'Suspended'),
('Turner Bruno', 'Primelet agents', 'turner@horizon.com', '+44 7555 998877', 20, 20, 'Active');
