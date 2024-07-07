CREATE TABLE knowledge (
  knowledge_id INT AUTO_INCREMENT PRIMARY KEY,
  knowledge_title VARCHAR(255) NOT NULL,
  knowledge_detail TEXT NOT NULL,
  knowledge_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  knowledge_creator VARCHAR(100) NOT NULL,
  knowledge_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
  tags VARCHAR(255) DEFAULT NULL,
  views INT DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT NULL
);