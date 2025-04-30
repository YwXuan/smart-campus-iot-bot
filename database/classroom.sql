-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2025 at 11:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `classroom`
--

-- --------------------------------------------------------

--
-- Table structure for table `classroom`
--

CREATE TABLE `classroom` (
  `room_id` varchar(10) NOT NULL,
  `room_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classroom`
--

INSERT INTO `classroom` (`room_id`, `room_name`) VALUES
('R001', '綜合大樓301'),
('R101', '資管一教室'),
('R102', '資管二教室');

-- --------------------------------------------------------

--
-- Table structure for table `classroom_device`
--

CREATE TABLE `classroom_device` (
  `id` int(11) NOT NULL,
  `room_id` varchar(10) NOT NULL,
  `device_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classroom_device`
--

INSERT INTO `classroom_device` (`id`, `room_id`, `device_id`) VALUES
(1, 'R001', 'AC001'),
(2, 'R001', 'AC002'),
(3, 'R001', 'PC001'),
(4, 'R001', 'PC002'),
(5, 'R001', 'LAMP001'),
(6, 'R001', 'LAMP002');

-- --------------------------------------------------------

--
-- Table structure for table `courseuser`
--

CREATE TABLE `courseuser` (
  `id` int(11) NOT NULL,
  `schedule_id` varchar(10) NOT NULL,
  `user_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courseuser`
--

INSERT INTO `courseuser` (`id`, `schedule_id`, `user_id`) VALUES
(1, 'S001', 'S000001'),
(2, 'S001', 'T000001'),
(3, 'S002', 'S000002'),
(4, 'S002', 'T000002');

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `device_id` varchar(10) NOT NULL,
  `device_type` enum('冷氣','風扇','電腦','電燈') NOT NULL,
  `zone` enum('前半部','後半部') NOT NULL,
  `model` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`device_id`, `device_type`, `zone`, `model`) VALUES
('AC001', '冷氣', '前半部', 'Daikin A-321'),
('AC002', '冷氣', '後半部', 'Daikin A-321'),
('AC003', '冷氣', '前半部', 'LG Inverter Cool'),
('LAMP001', '電燈', '前半部', 'LED-TW-18'),
('LAMP002', '電燈', '後半部', 'LED-TW-18'),
('PC001', '電腦', '前半部', 'i7-PC-01'),
('PC002', '電腦', '後半部', 'i7-PC-02');

-- --------------------------------------------------------

--
-- Table structure for table `devicedetail_ac`
--

CREATE TABLE `devicedetail_ac` (
  `device_id` varchar(10) NOT NULL,
  `temperature` float DEFAULT NULL,
  `mode` enum('冷氣','送風','除濕') DEFAULT NULL,
  `watt` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `devicedetail_ac`
--

INSERT INTO `devicedetail_ac` (`device_id`, `temperature`, `mode`, `watt`) VALUES
('AC001', 26, '冷氣', 750),
('AC002', 27, '除濕', 680);

-- --------------------------------------------------------

--
-- Table structure for table `devicedetail_pc`
--

CREATE TABLE `devicedetail_pc` (
  `device_id` varchar(10) NOT NULL,
  `status` enum('開機','關機') DEFAULT NULL,
  `watt` float DEFAULT NULL,
  `cpu_usage` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `devicedetail_pc`
--

INSERT INTO `devicedetail_pc` (`device_id`, `status`, `watt`, `cpu_usage`) VALUES
('PC001', '開機', 250, 42.5),
('PC002', '關機', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `positiontype`
--

CREATE TABLE `positiontype` (
  `position_id` int(11) NOT NULL,
  `position_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `positiontype`
--

INSERT INTO `positiontype` (`position_id`, `position_name`) VALUES
(1, '學生'),
(2, '老師');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `schedule_id` varchar(10) NOT NULL,
  `room_id` varchar(10) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `room_id`, `start_time`, `end_time`) VALUES
('S001', 'R101', '2025-04-20 08:00:00', '2025-04-20 10:00:00'),
('S002', 'R102', '2025-04-20 10:10:00', '2025-04-20 12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `seat`
--

CREATE TABLE `seat` (
  `seat_id` varchar(10) NOT NULL,
  `room_id` varchar(10) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `device_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seat`
--

INSERT INTO `seat` (`seat_id`, `room_id`, `seat_number`, `device_id`) VALUES
('S001', 'R001', 1, 'PC-001'),
('S002', 'R001', 2, 'PC-002');

-- --------------------------------------------------------

--
-- Table structure for table `seatassignment`
--

CREATE TABLE `seatassignment` (
  `assignment_id` int(11) NOT NULL,
  `user_id` varchar(10) NOT NULL,
  `seat_id` varchar(10) NOT NULL,
  `assign_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swiperecord`
--

CREATE TABLE `swiperecord` (
  `record_id` int(11) NOT NULL,
  `user_id` varchar(10) NOT NULL,
  `timestamp` datetime NOT NULL,
  `room_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `swiperecord`
--

INSERT INTO `swiperecord` (`record_id`, `user_id`, `timestamp`, `room_id`) VALUES
(1, 'S000001', '2025-04-20 07:55:00', 'R101'),
(2, 'T000001', '2025-04-20 07:57:00', 'R101'),
(3, 'S000002', '2025-04-20 10:05:00', 'R102'),
(4, 'T000002', '2025-04-20 10:07:00', 'R102'),
(6, 'T000001', '2025-04-19 15:00:00', 'R101'),
(7, 'T000001', '2025-04-19 15:00:00', 'R101'),
(8, 'T000001', '2025-04-19 15:00:00', 'R101'),
(9, 'T000001', '2025-04-19 15:00:00', 'R101');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `rfid_uid` varchar(100) NOT NULL,
  `position_id` int(11) NOT NULL,
  `line_user_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `rfid_uid`, `position_id`, `line_user_id`) VALUES
('S000001', '小明', 'UID001', 1, NULL),
('S000002', '小美', 'UID002', 1, NULL),
('S000003', '阿強', 'UID003', 1, NULL),
('S000004', '小呆', 'UID007', 1, NULL),
('T000001', '王老師', 'UID004', 2, 'U6b3e0c8a1234567890abcdef'),
('T000002', '林老師', 'UID005', 2, NULL),
('T000003', '陳老師', 'UID008', 2, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `classroom_device`
--
ALTER TABLE `classroom_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `device_id` (`device_id`);

--
-- Indexes for table `courseuser`
--
ALTER TABLE `courseuser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `courseuser_ibfk_2` (`user_id`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`device_id`);

--
-- Indexes for table `devicedetail_ac`
--
ALTER TABLE `devicedetail_ac`
  ADD PRIMARY KEY (`device_id`);

--
-- Indexes for table `devicedetail_pc`
--
ALTER TABLE `devicedetail_pc`
  ADD PRIMARY KEY (`device_id`);

--
-- Indexes for table `positiontype`
--
ALTER TABLE `positiontype`
  ADD PRIMARY KEY (`position_id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`seat_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `seatassignment`
--
ALTER TABLE `seatassignment`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `seat_id` (`seat_id`),
  ADD KEY `seatassignment_ibfk_1` (`user_id`);

--
-- Indexes for table `swiperecord`
--
ALTER TABLE `swiperecord`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `rfid_uid` (`rfid_uid`),
  ADD UNIQUE KEY `line_user_id` (`line_user_id`),
  ADD KEY `position_id` (`position_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classroom_device`
--
ALTER TABLE `classroom_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `courseuser`
--
ALTER TABLE `courseuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `seatassignment`
--
ALTER TABLE `seatassignment`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `swiperecord`
--
ALTER TABLE `swiperecord`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classroom_device`
--
ALTER TABLE `classroom_device`
  ADD CONSTRAINT `classroom_device_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `classroom` (`room_id`),
  ADD CONSTRAINT `classroom_device_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`);

--
-- Constraints for table `courseuser`
--
ALTER TABLE `courseuser`
  ADD CONSTRAINT `courseuser_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedule` (`schedule_id`),
  ADD CONSTRAINT `courseuser_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `devicedetail_ac`
--
ALTER TABLE `devicedetail_ac`
  ADD CONSTRAINT `devicedetail_ac_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`);

--
-- Constraints for table `devicedetail_pc`
--
ALTER TABLE `devicedetail_pc`
  ADD CONSTRAINT `devicedetail_pc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `classroom` (`room_id`);

--
-- Constraints for table `seat`
--
ALTER TABLE `seat`
  ADD CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `classroom` (`room_id`);

--
-- Constraints for table `seatassignment`
--
ALTER TABLE `seatassignment`
  ADD CONSTRAINT `seatassignment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seatassignment_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`seat_id`);

--
-- Constraints for table `swiperecord`
--
ALTER TABLE `swiperecord`
  ADD CONSTRAINT `swiperecord_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `swiperecord_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `classroom` (`room_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positiontype` (`position_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
