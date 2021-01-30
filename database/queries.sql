-- Get Employee
SELECT * FROM `employee` JOIN `user` ON `employee`.`user_id` =`user`.`user_id` JOIN `address` ON `employee`.`address_id` = `address`.`address_id` WHERE `employee`.`user_id` = 2 LIMIT 1;

