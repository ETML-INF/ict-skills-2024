-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Feb 04, 2023 at 02:57 PM
-- Server version: 8.0.32
-- PHP Version: 8.0.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `skills`
--

-- --------------------------------------------------------

--
-- Table structure for table `click`
--

CREATE TABLE `click`
(
    `id`        int       NOT NULL,
    `url_id`    int       NOT NULL,
    `timestamp` timestamp NOT NULL                                            DEFAULT CURRENT_TIMESTAMP,
    `browser`   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `language`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    `referrer`  varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

--
-- Dumping data for table `click`
--

INSERT INTO `click` (`id`, `url_id`, `timestamp`, `browser`, `language`, `referrer`)
VALUES (1, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (2, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (3, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (4, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (5, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (6, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (7, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (8, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (9, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (10, 3, '2023-03-18 11:30:00', 'chrome', 'en', 'https://www.example.org'),
       (11, 3, '2023-03-18 11:30:00', 'chrome', 'de', 'https://www.example.org'),
       (12, 3, '2023-03-18 11:30:00', 'chrome', 'de', 'https://www.example.org'),
       (13, 3, '2023-03-18 11:30:00', 'chrome', 'de', 'https://www.example.org'),
       (14, 3, '2023-03-18 11:30:00', 'chrome', 'de', 'https://www.example.org'),
       (15, 3, '2023-03-18 11:30:00', 'chrome', 'de', 'https://www.example.org'),
       (16, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (17, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (18, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (19, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (20, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (21, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org'),
       (22, 3, '2023-03-18 12:30:00', 'chrome', 'de', 'https://www.example.org');

-- --------------------------------------------------------

--
-- Table structure for table `url`
--

CREATE TABLE `url`
(
    `id`         int          NOT NULL,
    `short_code` varchar(50)  NOT NULL,
    `target_url` varchar(300) NOT NULL,
    `edit_token` varchar(100) NOT NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

--
-- Dumping data for table `url`
--

INSERT INTO `url` (`id`, `short_code`, `target_url`, `edit_token`)
VALUES (1, 'ictranks2022', 'https://www.ict-berufsbildung.ch/resources/SwissSkills_Bern_2022_Ranglisten_ICTskills.pdf',
        '8eb94b47-a02c-4e84-9e42-96750b15b42c'),
       (2, 'put-test', 'https://www.example.org/optimize', '443b8432-abbb-44bf-9c9e-23f2d13c2f7f'),
       (3, 'stats-test', 'https://www.example.org/test', '3d84d360-4087-4bdf-b74f-78e85f8eb51b');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `click`
--
ALTER TABLE `click`
    ADD PRIMARY KEY (`id`),
    ADD KEY `url_id_fk` (`url_id`);

--
-- Indexes for table `url`
--
ALTER TABLE `url`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `short_code_unique` (`short_code`),
    ADD UNIQUE KEY `edit_token_unique` (`edit_token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `click`
--
ALTER TABLE `click`
    MODIFY `id` int NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 23;

--
-- AUTO_INCREMENT for table `url`
--
ALTER TABLE `url`
    MODIFY `id` int NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `click`
--
ALTER TABLE `click`
    ADD CONSTRAINT `click_ibfk_1` FOREIGN KEY (`url_id`) REFERENCES `url` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;
