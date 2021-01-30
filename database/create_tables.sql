SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `university_management`.`user`;
DROP TABLE IF EXISTS `university_management`.`faculty`;
DROP TABLE IF EXISTS `university_management`.`subject`;
DROP TABLE IF EXISTS `university_management`.`course`;
DROP TABLE IF EXISTS `university_management`.`group`;
DROP TABLE IF EXISTS `university_management`.`announcement`;
DROP TABLE IF EXISTS `university_management`.`comment`;
DROP TABLE IF EXISTS `university_management`.`admin`;
DROP TABLE IF EXISTS `university_management`.`address`;
DROP TABLE IF EXISTS `university_management`.`student`;
DROP TABLE IF EXISTS `university_management`.`employee`;
DROP TABLE IF EXISTS `university_management`.`building`;
DROP TABLE IF EXISTS `university_management`.`grade`;
DROP TABLE IF EXISTS `university_management`.`room`;
DROP TABLE IF EXISTS `university_management`.`event`;
DROP TABLE IF EXISTS `university_management`.`student_group`;
DROP TABLE IF EXISTS `university_management`.`employee_group`;
DROP TABLE IF EXISTS `university_management`.`term`;
DROP TABLE IF EXISTS `university_management`.`schedule_item`;

SET foreign_key_checks = 1;

CREATE TABLE `university_management`.`user` (
    `user_id`   INT UNSIGNED                         NOT NULL AUTO_INCREMENT,
    `user_type` ENUM('Admin', 'Employee', 'Student') NOT NULL,
    `email`     VARCHAR(255)                         NOT NULL,
    `password`  VARCHAR(60)                          NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE (`email`)
);

CREATE TABLE `faculty` (
    `faculty_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`faculty_id`)
);

CREATE TABLE `university_management`.`subject` (
    `subject_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `faculty_id` INT UNSIGNED NOT NULL,
    `name`       VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`subject_id`)
);

CREATE TABLE `university_management`.`course` (
    `course_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subject_id` INT UNSIGNED NOT NULL,
    `name`      VARCHAR(50)   NOT NULL,
    PRIMARY KEY (`course_id`)
);

CREATE TABLE `university_management`.`group` (
    `group_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` INT UNSIGNED NOT NULL,
    `name`      VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`group_id`)
);

CREATE TABLE `university_management`.`announcement`(
    `announcement_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`         INT UNSIGNED NOT NULL,
    `title`           VARCHAR(255) NOT NULL,
    `description`     TEXT         NOT NULL,
    `content`         TEXT         NOT NULL,
    `created_at`      DATETIME     NOT NULL,
    PRIMARY KEY (`announcement_id`)
);

CREATE TABLE `university_management`.`comment`(
    `comment_id`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `announcement_id` INT UNSIGNED NOT NULL,
    `user_id`         INT UNSIGNED NOT NULL,
    `content`         TEXT         NOT NULL,
    `created_at`      DATETIME     NOT NULL,
    PRIMARY KEY (`comment_id`)
);

CREATE TABLE `university_management`.`admin`(
    `admin_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`  INT UNSIGNED NOT NULL,
    PRIMARY KEY (`admin_id`)
);

CREATE TABLE `university_management`.`address`(
    `address_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `street`       VARCHAR(200) NOT NULL,
    `house_number` VARCHAR(10)  NOT NULL,
    `flat_number`  VARCHAR(10)      NULL,
    `postcode`     VARCHAR(20)  NOT NULL,
    `city`         VARCHAR(100) NOT NULL,
    `country`      VARCHAR(100) NOT NULL,
    PRIMARY KEY (`address_id`)
);

CREATE TABLE `university_management`.`student`(
    `student_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`      INT UNSIGNED NOT NULL,
    `address_id`   INT UNSIGNED NOT NULL,
    `first_name`   VARCHAR(100) NOT NULL,
    `last_name`    VARCHAR(100) NOT NULL,
    `album_number` VARCHAR(15)  NOT NULL,
    `birth_date`   DATE         NOT NULL,
    `pesel`        VARCHAR(11)  NOT NULL,
    `phone_number` VARCHAR(9)   NOT NULL,
    PRIMARY KEY (`student_id`)
);

CREATE TABLE `university_management`.`employee`(
    `employee_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`      INT UNSIGNED NOT NULL,
    `address_id`   INT UNSIGNED NOT NULL,
    `first_name`   VARCHAR(100) NOT NULL,
    `last_name`    VARCHAR(100) NOT NULL,
    `birth_date`   DATE         NOT NULL,
    `pesel`        VARCHAR(11)  NOT NULL,
    `phone_number` VARCHAR(9)   NOT NULL,
    PRIMARY KEY (`employee_id`)
);

CREATE TABLE `university_management`.`building`(
    `building_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `address_id`  INT UNSIGNED NOT NULL,
    `name`        VARCHAR(200) NOT NULL,
    PRIMARY KEY (`building_id`)
);

CREATE TABLE `university_management`.`grade`(
    `grade_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id`    INT UNSIGNED NOT NULL,
    `student_id`   INT UNSIGNED NOT NULL,
    `employee_id`  INT UNSIGNED NOT NULL,
    `name`         VARCHAR(100) NOT NULL,
    `description`  TEXT         NOT NULL,
    `value`        float(2,1)   NOT NULL,
    PRIMARY KEY (`grade_id`)
);

CREATE TABLE `university_management`.`room`(
    `room_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `building_id` INT UNSIGNED NOT NULL,
    `number`      VARCHAR(10)  NOT NULL,
    PRIMARY KEY (`room_id`)
);

CREATE TABLE `university_management`.`event`(
    `event_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_id`  INT UNSIGNED NOT NULL,
    `group_id`     INT UNSIGNED NOT NULL,
    `room_id`      INT UNSIGNED NOT NULL,
    `name`         VARCHAR(100) NOT NULL,
    `date`         DATE         NOT NULL,
    `time_from`    TIME         NOT NULL,
    `time_to`      TIME         NOT NULL,
    PRIMARY KEY (`event_id`)
);

CREATE TABLE `university_management`.`term` (
    `term_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(150) NOT NULL,
    `date_from` DATE NOT NULL,
    `date_to`   DATE NOT NULL,
    PRIMARY KEY (`term_id`)
);

CREATE TABLE `university_management`.`student_group`(
    `student_id` INT UNSIGNED NOT NULL,
    `group_id`   INT UNSIGNED NOT NULL,
    PRIMARY KEY (`student_id`, `group_id`)
);

CREATE TABLE `university_management`.`employee_group`(
    `employee_id` INT UNSIGNED NOT NULL,
    `group_id`    INT UNSIGNED NOT NULL,
    PRIMARY KEY (`employee_id`, `group_id`)
);

CREATE TABLE `university_management`.`schedule_item` (
    `schedule_item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `group_id`         INT UNSIGNED NOT NULL,
    `term_id`          INT UNSIGNED NOT NULL,
    `room_id`          INT UNSIGNED NOT NULL,
    `day`              ENUM(
                          'Poniedziałek',
                          'Wtorek',
                          'Środa',
                          'Czwartek',
                          'Piątek',
                          'Sobota',
                          'Niedziela'
                      )            NOT NULL,
    `week`            ENUM(
                          'Parzysty i Nieparzysty',
                          'Parzysty',
                          'Nieparzysty'
                      )            NOT NULL,
    `time_from`       TIME         NOT NULL,
    `time_to`         TIME         NOT NULL,
    PRIMARY KEY (`schedule_item_id`)
);

ALTER TABLE `university_management`.`subject`
ADD CONSTRAINT FK_FacultySubject
FOREIGN KEY (`faculty_id`) REFERENCES `university_management`.`faculty`(`faculty_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`course`
ADD CONSTRAINT FK_SubjectCourse
FOREIGN KEY (`subject_id`) REFERENCES `university_management`.`subject`(`subject_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`group`
ADD CONSTRAINT FK_CourseGroup
FOREIGN KEY (`course_id`) REFERENCES `university_management`.`course`(`course_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`announcement`
ADD CONSTRAINT FK_UserAnnouncement
FOREIGN KEY (`user_id`) REFERENCES `university_management`.`user`(`user_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`comment`
ADD CONSTRAINT FK_AnnouncementComment
FOREIGN KEY (`announcement_id`) REFERENCES `university_management`.`announcement`(`announcement_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`comment`
ADD CONSTRAINT FK_UserComment
FOREIGN KEY (`user_id`) REFERENCES `university_management`.`user`(`user_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`admin`
ADD CONSTRAINT FK_UserAdmin
FOREIGN KEY (`user_id`) REFERENCES `university_management`.`user`(`user_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`student`
ADD CONSTRAINT FK_UserStudent
FOREIGN KEY (`user_id`) REFERENCES `university_management`.`user`(`user_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`student`
ADD CONSTRAINT FK_AddressStudent
FOREIGN KEY (`address_id`) REFERENCES `university_management`.`address`(`address_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`employee`
ADD CONSTRAINT FK_UserEmployee
FOREIGN KEY (`user_id`) REFERENCES `university_management`.`user`(`user_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`employee`
ADD CONSTRAINT FK_AddressEmployee
FOREIGN KEY (`address_id`) REFERENCES `university_management`.`address`(`address_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`building`
ADD CONSTRAINT FK_AddressBuilding
FOREIGN KEY (`address_id`) REFERENCES `university_management`.`address`(`address_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`grade`
ADD CONSTRAINT FK_EmployeeGrade
FOREIGN KEY (`employee_id`) REFERENCES `university_management`.`employee`(`employee_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`room`
ADD CONSTRAINT FK_BuildingRoom
FOREIGN KEY (`building_id`) REFERENCES `university_management`.`building`(`building_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`event`
ADD CONSTRAINT FK_EmployeeEvent
FOREIGN KEY (`employee_id`) REFERENCES `university_management`.`employee`(`employee_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`event`
ADD CONSTRAINT FK_GroupEvent
FOREIGN KEY (`group_id`) REFERENCES `university_management`.`group`(`group_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`event`
ADD CONSTRAINT FK_RoomEvent
FOREIGN KEY (`room_id`) REFERENCES `university_management`.`room`(`room_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`student_group`
ADD CONSTRAINT FK_StudentGroup
FOREIGN KEY (`student_id`) REFERENCES `university_management`.`student`(`student_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`student_group`
ADD CONSTRAINT FK_GroupStudent
FOREIGN KEY (`group_id`) REFERENCES `university_management`.`group`(`group_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`employee_group`
ADD CONSTRAINT FK_EmployeeGroup
FOREIGN KEY (`employee_id`) REFERENCES `university_management`.`employee`(`employee_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`employee_group`
ADD CONSTRAINT FK_GroupEmployee
FOREIGN KEY (`group_id`) REFERENCES `university_management`.`group`(`group_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`schedule_item`
ADD CONSTRAINT FK_TermScheduleItem
FOREIGN KEY (`term_id`) REFERENCES `university_management`.`term`(`term_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`schedule_item`
ADD CONSTRAINT FK_GroupScheduleItem
FOREIGN KEY (`group_id`) REFERENCES `university_management`.`group`(`group_id`) ON DELETE CASCADE;

ALTER TABLE `university_management`.`schedule_item`
ADD CONSTRAINT FK_RoomScheduleItem
FOREIGN KEY (`room_id`) REFERENCES `university_management`.`room`(`room_id`) ON DELETE CASCADE;
