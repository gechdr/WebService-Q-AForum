-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2023 at 04:12 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t4_6958`
--
CREATE DATABASE IF NOT EXISTS `t4_6958` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t4_6958`;

-- --------------------------------------------------------

--
-- Table structure for table `replies`
--

DROP TABLE IF EXISTS `replies`;
CREATE TABLE `replies` (
  `reply_id` varchar(4) NOT NULL,
  `post_id` varchar(4) NOT NULL,
  `user_id` varchar(4) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` varchar(250) NOT NULL,
  `created_at` varchar(30) NOT NULL,
  `updated_at` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `replies`
--

INSERT INTO `replies` (`reply_id`, `post_id`, `user_id`, `title`, `content`, `created_at`, `updated_at`) VALUES
('R001', 'T001', 'U003', NULL, 'Of course you are friend, Mei-senpai', '2023-03-16 13:35:55', NULL),
('R002', 'T002', 'U004', NULL, 'Don\'t believe that', '2023-03-16 13:36:26', NULL),
('R003', 'T001', 'U004', NULL, 'All hail Mei-senpai!', '2023-03-16 13:36:58', NULL),
('R004', 'T002', 'U003', NULL, 'Liar!!', '2023-03-16 13:37:24', NULL),
('R005', 'R002', 'U003', NULL, 'Of course Seele!', '2023-03-16 13:38:28', NULL),
('R006', 'T003', 'U004', NULL, 'That Awesome!', '2023-03-16 22:10:12', NULL),
('R007', 'T004', 'U003', NULL, 'Fantastic!', '2023-03-16 22:10:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `threads`
--

DROP TABLE IF EXISTS `threads`;
CREATE TABLE `threads` (
  `thread_id` varchar(4) NOT NULL,
  `user_id` varchar(4) NOT NULL,
  `title` varchar(64) NOT NULL,
  `content` varchar(250) NOT NULL,
  `viewers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` varchar(30) NOT NULL,
  `updated_at` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `threads`
--

INSERT INTO `threads` (`thread_id`, `user_id`, `title`, `content`, `viewers`, `created_at`, `updated_at`) VALUES
('T001', 'U001', 'Am I Really the Friend?', 'I’ve been so confused lately about my own self. Am I really the friend? Or am I actually the foe all along?', '[\"U001\",\"U002\"]', '2023-03-15 20:28:38', NULL),
('T002', 'U002', 'Mars explode?', 'I’ve been so confused lately about my own dream. So freak.', '[\"U001\",\"U002\"]', '2023-03-15 20:30:10', NULL),
('T003', 'U001', 'Another Sun?', 'There is no evidence of another sun in our solar system.', '[\"U001\",\"U002\"]', '2023-03-16 13:28:08', NULL),
('T004', 'U002', 'Alien?', 'The search for extraterrestrial life is an active area of scientific research', '[\"U001\",\"U002\"]', '2023-03-16 13:28:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` varchar(4) NOT NULL,
  `username` varchar(50) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `phone_number` varchar(12) NOT NULL,
  `bio` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `display_name`, `email`, `dob`, `phone_number`, `bio`) VALUES
('U001', 'raiden', 'Raiden Mei', 'raidenmei@hoyoverse.com', '1997-04-13', '123123123123', ''),
('U002', 'kaslana', 'Kiana Kaslana', 'kianakaslana@hoyoverse.com', '1998-12-07', '321321321321', ''),
('U003', 'zaychik', 'Bronya Zaychik', 'bronyazaychik@hoyoverse.com', '2000-08-18', '123321123321', ''),
('U004', 'vollerei', 'Seele Vollerei', 'seelevollerei@hoyoverse.com', '2001-10-18', '321123321123', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `replies`
--
ALTER TABLE `replies`
  ADD PRIMARY KEY (`reply_id`);

--
-- Indexes for table `threads`
--
ALTER TABLE `threads`
  ADD PRIMARY KEY (`thread_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
