CREATE DATABASE IF NOT EXISTS saveup;
USE saveup;

CREATE TABLE user_data (
	user_id VARCHAR(36) NOT NULL,
	email VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	role ENUM('USER','ADMIN') NOT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE user_account (
	account_id VARCHAR(36) NOT NULL,
	name VARCHAR(50) NOT NULL,
	balance INT NOT NULL,
    user_id VARCHAR(36) NOT NULL,
	FOREIGN KEY (user_id)
		REFERENCES user_data (user_id)
);

SELECT * FROM user_data;

SET SQL_SAFE_UPDATES = 0;
DELETE FROM user_data where email = 'jason@gmail.com';
SET SQL_SAFE_UPDATES = 1;