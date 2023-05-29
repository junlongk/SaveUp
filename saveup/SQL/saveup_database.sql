-- CREATE DATABASE IF NOT EXISTS saveup;
USE saveup;

-- CREATE TABLE user_data (
-- 	user_id VARCHAR(36) NOT NULL,
-- 	email VARCHAR(100) NOT NULL UNIQUE,
-- 	password VARCHAR(100) NOT NULL,
-- 	first_name VARCHAR(100) NOT NULL,
-- 	last_name VARCHAR(100) NOT NULL,
-- 	role ENUM('USER','ADMIN','PREMIUM') NOT NULL,
-- 	PRIMARY KEY (user_id)
-- );

-- CREATE TABLE user_account (
-- 	account_id VARCHAR(36) NOT NULL,
-- 	account_name VARCHAR(50) NOT NULL,
-- 	balance DECIMAL(10, 2) NOT NULL,
-- 	user_id VARCHAR(36) NOT NULL,
-- 	FOREIGN KEY (user_id)
-- 		REFERENCES user_data (user_id)
-- );

##########################
########## USER ##########
##########################

-- INSERT INTO user_data (user_id, email, password, first_name, last_name, role)
-- VALUES ("AAAAA", "abc@abc.com", "12345", "Alex", "Tan", "USER"); 

SELECT * FROM user_data;

SELECT * FROM user_data WHERE email="keejunlong@gmail.com";

SELECT * FROM user_data WHERE user_id = "f31d04a4-b101-45df-ad14-e746f527d3b7";

## Convert user to premium member
UPDATE user_data SET role = 'PREMIUM' WHERE user_id = "f31d04a4-b101-45df-ad14-e746f527d3b7";
UPDATE user_data SET role = 'USER' WHERE user_id = "f31d04a4-b101-45df-ad14-e746f527d3b7";


-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM user_data where email = "jason@gmail.com";
-- SET SQL_SAFE_UPDATES = 1;

##########################
######## ACCOUNTS ########
##########################

INSERT INTO user_account (account_id, account_name, balance, user_id)
VALUES ("BBBBB", "DBS", 500.00, "AAAAA");

SELECT * FROM user_account;

SELECT * FROM user_account WHERE account_id = "7c2893a2-c786-40ed-a517-884a0ce1d8a7";

SELECT account_name, balance FROM user_account WHERE user_id = "f31d04a4-b101-45df-ad14-e746f527d3b7";

UPDATE user_account SET balance = 1000.00 WHERE account_id = "BBBBB";

-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM user_account where account_id = "b57d0cc3-b777-41d9-a690-272c77b55db5";
-- SET SQL_SAFE_UPDATES = 1;





