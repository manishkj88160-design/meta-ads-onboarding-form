-- Add isMasterAdmin column to admin_users table
ALTER TABLE admin_users ADD COLUMN isMasterAdmin varchar(10) NOT NULL DEFAULT 'false';

-- Create master_admins table
CREATE TABLE master_admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  masterId VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
