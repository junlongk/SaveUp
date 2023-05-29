CREATE DATABASE IF NOT EXISTS saveup;
USE saveup;

CREATE TABLE user_data (
	user_id VARCHAR(36) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	role ENUM('USER','ADMIN','PREMIUM') NOT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE user_account (
	account_id VARCHAR(36) NOT NULL,
	account_name VARCHAR(50) NOT NULL,
	balance DECIMAL(10, 2) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	FOREIGN KEY (user_id)
		REFERENCES user_data (user_id)
);