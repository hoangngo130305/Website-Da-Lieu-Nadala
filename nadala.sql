-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2025 at 06:09 AM
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
-- Database: `nadala`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `name`, `email`, `phone`, `role_id`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'Nguyễn Quản Trị', 'admin@nadala.com', '0909000001', 1, '2025-08-11 22:55:02', '2025-08-11 22:55:02', NULL),
(2, 'staff01', 'e10adc3949ba59abbe56e057f20f883e', 'Trần Nhân Viên', 'staff01@nadala.com', '0909000002', 2, '2025-08-11 22:55:02', '2025-08-11 22:55:02', NULL),
(3, 'admin1', 'pass123', 'Nguyễn Văn A', 'a@nadala.com', '0901111111', 1, '2025-08-11 22:57:06', '2025-08-11 22:57:06', NULL),
(4, 'staff1', 'pass123', 'Trần Thị B', 'b@nadala.com', '0902222222', 2, '2025-08-11 22:57:06', '2025-08-11 22:57:06', NULL),
(5, 'admin2', 'pbkdf2_sha256$600000$J18bqh4Rm3QkM9xez86lEx$QySBiJlW+ROmf7RShNLbIKGa1WWkFr8CV4sTwqmfgdw=', NULL, NULL, NULL, NULL, '2025-08-13 04:19:24', '2025-08-13 04:19:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `action_date` datetime DEFAULT current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_logs`
--

INSERT INTO `admin_logs` (`id`, `admin_id`, `action`, `action_date`, `details`) VALUES
(1, 1, 'Thêm dịch vụ mới', '2025-08-11 22:57:06', 'Massage thư giãn toàn thân'),
(2, 2, 'Xác nhận đơn hàng', '2025-08-11 22:57:06', 'Đơn hàng ID: 1');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL COMMENT 'Định danh lịch hẹn',
  `service_id` int(11) NOT NULL COMMENT 'ID dịch vụ (FK)',
  `doctor_id` int(11) NOT NULL COMMENT 'ID bác sĩ (FK)',
  `customer_name` varchar(255) NOT NULL COMMENT 'Tên khách hàng',
  `customer_phone` varchar(20) NOT NULL COMMENT 'Số điện thoại khách',
  `customer_email` varchar(255) DEFAULT NULL COMMENT 'Email khách hàng',
  `customer_notes` text DEFAULT NULL COMMENT 'Ghi chú khách hàng',
  `date` date NOT NULL COMMENT 'Ngày hẹn',
  `time` varchar(10) NOT NULL COMMENT 'Khung giờ hẹn',
  `status` varchar(50) NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái (VD: pending, confirmed)',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `service_id`, `doctor_id`, `customer_name`, `customer_phone`, `customer_email`, `customer_notes`, `date`, `time`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Nguyễn Văn A', '0901234567', 'vana@example.com', 'Muốn khám sớm', '2025-08-20', '08:00', 'pending', '2025-08-15 16:59:39', '2025-08-15 16:59:39'),
(2, 2, 1, 'Trần Thị B', '0907654321', 'thib@example.com', NULL, '2025-08-21', '10:00', 'confirmed', '2025-08-15 16:59:39', '2025-08-15 16:59:39'),
(3, 1, 2, 'Phạm Văn C', '0912345678', 'vanc@example.com', 'Mang theo kết quả xét nghiệm', '2025-08-22', '09:00', 'pending', '2025-08-15 16:59:39', '2025-08-15 16:59:39'),
(7, 2, 2, 'dddddd', '0776555566', 'hoang@gmail.com', 'ss', '2025-08-04', '09:00', 'pending', '2025-08-30 03:50:26', '2025-08-30 03:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add permission', 1, 'add_permission'),
(2, 'Can change permission', 1, 'change_permission'),
(3, 'Can delete permission', 1, 'delete_permission'),
(4, 'Can view permission', 1, 'view_permission'),
(5, 'Can add group', 2, 'add_group'),
(6, 'Can change group', 2, 'change_group'),
(7, 'Can delete group', 2, 'delete_group'),
(8, 'Can view group', 2, 'view_group'),
(9, 'Can add content type', 3, 'add_contenttype'),
(10, 'Can change content type', 3, 'change_contenttype'),
(11, 'Can delete content type', 3, 'delete_contenttype'),
(12, 'Can view content type', 3, 'view_contenttype'),
(13, 'Can add log entry', 4, 'add_logentry'),
(14, 'Can change log entry', 4, 'change_logentry'),
(15, 'Can delete log entry', 4, 'delete_logentry'),
(16, 'Can view log entry', 4, 'view_logentry'),
(17, 'Can add session', 5, 'add_session'),
(18, 'Can change session', 5, 'change_session'),
(19, 'Can delete session', 5, 'delete_session'),
(20, 'Can view session', 5, 'view_session'),
(21, 'Can add User', 6, 'add_user'),
(22, 'Can change User', 6, 'change_user'),
(23, 'Can delete User', 6, 'delete_user'),
(24, 'Can view User', 6, 'view_user'),
(25, 'Can add contact', 7, 'add_contact'),
(26, 'Can change contact', 7, 'change_contact'),
(27, 'Can delete contact', 7, 'delete_contact'),
(28, 'Can view contact', 7, 'view_contact'),
(29, 'Can add news', 8, 'add_news'),
(30, 'Can change news', 8, 'change_news'),
(31, 'Can delete news', 8, 'delete_news'),
(32, 'Can view news', 8, 'view_news'),
(33, 'Can add order', 9, 'add_order'),
(34, 'Can change order', 9, 'change_order'),
(35, 'Can delete order', 9, 'delete_order'),
(36, 'Can view order', 9, 'view_order'),
(37, 'Can add order type', 10, 'add_ordertype'),
(38, 'Can change order type', 10, 'change_ordertype'),
(39, 'Can delete order type', 10, 'delete_ordertype'),
(40, 'Can view order type', 10, 'view_ordertype'),
(41, 'Can add page', 11, 'add_page'),
(42, 'Can change page', 11, 'change_page'),
(43, 'Can delete page', 11, 'delete_page'),
(44, 'Can view page', 11, 'view_page'),
(45, 'Can add product', 12, 'add_product'),
(46, 'Can change product', 12, 'change_product'),
(47, 'Can delete product', 12, 'delete_product'),
(48, 'Can view product', 12, 'view_product'),
(49, 'Can add product category', 13, 'add_productcategory'),
(50, 'Can change product category', 13, 'change_productcategory'),
(51, 'Can delete product category', 13, 'delete_productcategory'),
(52, 'Can view product category', 13, 'view_productcategory'),
(53, 'Can add Role', 14, 'add_role'),
(54, 'Can change Role', 14, 'change_role'),
(55, 'Can delete Role', 14, 'delete_role'),
(56, 'Can view Role', 14, 'view_role'),
(57, 'Can add service', 15, 'add_service'),
(58, 'Can change service', 15, 'change_service'),
(59, 'Can delete service', 15, 'delete_service'),
(60, 'Can view service', 15, 'view_service'),
(61, 'Can add review', 16, 'add_review'),
(62, 'Can change review', 16, 'change_review'),
(63, 'Can delete review', 16, 'delete_review'),
(64, 'Can view review', 16, 'view_review'),
(65, 'Can add payment', 17, 'add_payment'),
(66, 'Can change payment', 17, 'change_payment'),
(67, 'Can delete payment', 17, 'delete_payment'),
(68, 'Can view payment', 17, 'view_payment'),
(69, 'Can add order status history', 18, 'add_orderstatushistory'),
(70, 'Can change order status history', 18, 'change_orderstatushistory'),
(71, 'Can delete order status history', 18, 'delete_orderstatushistory'),
(72, 'Can view order status history', 18, 'view_orderstatushistory'),
(73, 'Can add order shipping', 19, 'add_ordershipping'),
(74, 'Can change order shipping', 19, 'change_ordershipping'),
(75, 'Can delete order shipping', 19, 'delete_ordershipping'),
(76, 'Can view order shipping', 19, 'view_ordershipping'),
(77, 'Can add order detail', 20, 'add_orderdetail'),
(78, 'Can change order detail', 20, 'change_orderdetail'),
(79, 'Can delete order detail', 20, 'delete_orderdetail'),
(80, 'Can view order detail', 20, 'view_orderdetail'),
(81, 'Can add appointment', 21, 'add_appointment'),
(82, 'Can change appointment', 21, 'change_appointment'),
(83, 'Can delete appointment', 21, 'delete_appointment'),
(84, 'Can view appointment', 21, 'view_appointment'),
(85, 'Can add admin log', 22, 'add_adminlog'),
(86, 'Can change admin log', 22, 'change_adminlog'),
(87, 'Can delete admin log', 22, 'delete_adminlog'),
(88, 'Can view admin log', 22, 'view_adminlog');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `message`, `created_at`) VALUES
(1, 'Khách J', 'j@gmail.com', '0907777777', 'Tôi muốn hỏi về dịch vụ massage', '2025-08-11 22:57:06'),
(2, 'HoangNgo', 'hoangngoAZ8799@gmail.com', NULL, 'f', '2025-08-16 08:55:35'),
(3, 'string', 'string', NULL, 'string', '2025-09-01 03:33:29'),
(4, 'string', 'string', NULL, 'string', '2025-09-01 03:33:49'),
(5, 'ddddd', 'binh@gmail.com', NULL, 'dddddddddddd', '2025-09-01 03:42:47');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL COMMENT 'Định danh khách hàng',
  `name` varchar(255) NOT NULL COMMENT 'Tên khách hàng',
  `phone` varchar(20) NOT NULL COMMENT 'Số điện thoại',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email khách hàng',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Nguyễn Văn A', '0901234567', 'vana@example.com', '2025-08-15 17:01:42', '2025-08-15 17:01:42'),
(2, 'Trần Thị B', '0912345678', 'thib@example.com', '2025-08-15 17:01:42', '2025-08-15 17:01:42'),
(3, 'Lê Văn C', '0923456789', 'vanc@example.com', '2025-08-15 17:01:42', '2025-08-15 17:01:42'),
(4, 'Phạm Thị D', '0934567890', 'thid@example.com', '2025-08-15 17:01:42', '2025-08-15 17:01:42'),
(5, 'Hoàng Văn E', '0945678901', 'vane@example.com', '2025-08-15 17:01:42', '2025-08-15 17:01:42');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(4, 'admin', 'logentry'),
(22, 'api', 'adminlog'),
(21, 'api', 'appointment'),
(7, 'api', 'contact'),
(8, 'api', 'news'),
(9, 'api', 'order'),
(20, 'api', 'orderdetail'),
(19, 'api', 'ordershipping'),
(18, 'api', 'orderstatushistory'),
(10, 'api', 'ordertype'),
(11, 'api', 'page'),
(17, 'api', 'payment'),
(12, 'api', 'product'),
(13, 'api', 'productcategory'),
(16, 'api', 'review'),
(14, 'api', 'role'),
(15, 'api', 'service'),
(6, 'api', 'user'),
(2, 'auth', 'group'),
(1, 'auth', 'permission'),
(3, 'contenttypes', 'contenttype'),
(5, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-08-11 16:28:55.168749'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-08-11 16:28:55.215533'),
(3, 'auth', '0001_initial', '2025-08-11 16:28:55.390322'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-08-11 16:28:55.434528'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-08-11 16:28:55.441683'),
(6, 'auth', '0004_alter_user_username_opts', '2025-08-11 16:28:55.449022'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-08-11 16:28:55.455505'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-08-11 16:28:55.458706'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-08-11 16:28:55.466086'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-08-11 16:28:55.474246'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-08-11 16:28:55.482513'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-08-11 16:28:55.494349'),
(13, 'auth', '0011_update_proxy_permissions', '2025-08-11 16:28:55.502945'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-08-11 16:28:55.509330'),
(15, 'api', '0001_initial', '2025-08-11 16:33:14.742375'),
(16, 'admin', '0001_initial', '2025-08-11 16:33:50.265041'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-08-11 16:33:50.275049'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-08-11 16:33:50.287141'),
(19, 'sessions', '0001_initial', '2025-08-11 16:33:50.315451'),
(20, 'api', '0002_remove_user_role', '2025-08-12 06:12:12.685380');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('eaesmgplc2pq6ox8ds02ez4siiggyaq3', '.eJxVjMsOwiAQRf-FtSEwZQRcuu83EGBmpGrapI-V8d-1SRe6veec-1Ipb2tL28JzGkhdFKjT71ZyffC4A7rn8TbpOo3rPBS9K_qgi-4n4uf1cP8OWl7at2bjQpFYBCN0UL1UiQwZLKB4YEExHaELuUM6-4jWFTJssQTrSATV-wPvPTgQ:1umUBU:zNXJqOljkz3H4VT7uUa82hJbGS1l5WXAuky9eGumbWs', '2025-08-28 09:23:44.947736');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL COMMENT 'Định danh bác sĩ',
  `name` varchar(255) NOT NULL COMMENT 'Tên bác sĩ',
  `title` varchar(100) NOT NULL COMMENT 'Chức danh (VD: Bác sĩ trưởng)',
  `specialization` varchar(255) NOT NULL COMMENT 'Chuyên môn',
  `image` varchar(255) DEFAULT NULL COMMENT 'Đường dẫn ảnh',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `title`, `specialization`, `image`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'Nguyễn Văn A', 'Bác sĩ trưởng', 'Da liễu', '/img/doctors/nguyen-van-a.jpg', '2025-08-15 16:51:35', '2025-08-15 16:51:35', 1),
(2, 'Trần Thị B', 'Bác sĩ', 'Điều trị mụn', '/img/doctors/tran-thi-b.jpg', '2025-08-15 16:51:35', '2025-08-15 16:51:35', 1),
(3, 'Lê Văn C', 'Bác sĩ', 'Chăm sóc da', '/img/doctors/le-van-c.jpg', '2025-08-15 16:51:35', '2025-08-15 16:51:35', 1),
(4, 'Phạm Thị D', 'Bác sĩ', 'Thẩm mỹ da', '/img/doctors/pham-thi-d.jpg', '2025-08-15 16:51:35', '2025-08-15 16:51:35', 1);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `image`, `created_at`) VALUES
(1, 'Khai trương cơ sở mới', 'Nadala khai trương cơ sở mới tại Hà Nội với nhiều ưu đãi', 'opening.jpg', '2025-08-11 22:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `order_type_id` int(11) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `confirmed_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `phone`, `email`, `address`, `order_type_id`, `total_amount`, `status`, `confirmed_by`, `updated_by`, `created_at`) VALUES
(1, 'Lê Văn A', '0912345678', 'a@gmail.com', '123 Đường ABC, Quận 1', 1, 430000.00, 'completed', 1, NULL, '2025-08-11 22:55:02'),
(2, 'Nguyễn Thị B', '0987654321', 'b@gmail.com', '456 Đường XYZ, Quận 3', 2, 500000.00, 'processing', 2, NULL, '2025-08-11 22:55:02'),
(3, 'Nguyễn Văn E', '0905555555', 'e@gmail.com', 'Hà Nội', 1, 400000.00, 'completed', 1, NULL, '2025-08-11 22:57:06'),
(4, 'Trần Thị F', '0906666666', 'f@gmail.com', 'TP.HCM', 2, 500000.00, 'processing', 2, NULL, '2025-08-11 22:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00
) ;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `service_id`, `quantity`, `price`) VALUES
(1, 1, 1, NULL, 1, 250000.00),
(2, 1, 2, NULL, 1, 150000.00),
(3, 1, 3, NULL, 1, 180000.00),
(4, 2, NULL, 1, 1, 500000.00),
(5, 1, 1, NULL, 2, 250000.00),
(6, 2, NULL, 1, 1, 500000.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_shipping`
--

CREATE TABLE `order_shipping` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `shipping_method` varchar(100) DEFAULT NULL,
  `shipping_status` enum('pending','shipped','delivered','returned') DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `shipping_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` enum('pending','processing','completed','cancelled') NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_date` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_types`
--

CREATE TABLE `order_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_types`
--

INSERT INTO `order_types` (`id`, `name`) VALUES
(1, 'Sản phẩm'),
(2, 'Dịch vụ'),
(3, 'Combo'),
(4, 'Sản phẩm'),
(5, 'Dịch vụ'),
(6, 'Combo');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `created_at`) VALUES
(1, 'Giới thiệu', 'gioi-thieu', 'Thông tin về Nadala', '2025-08-11 22:57:06'),
(2, 'Chính sách bảo mật', 'chinh-sach-bao-mat', 'Nội dung chính sách bảo mật', '2025-08-11 22:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('Cash','Bank Transfer','Credit Card','VNPAY') DEFAULT 'Cash',
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_date` datetime DEFAULT current_timestamp(),
  `status` enum('pending','paid','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `amount`, `payment_date`, `status`) VALUES
(1, 1, 'Cash', 430000.00, '2025-08-11 22:55:02', 'paid'),
(2, 2, 'VNPAY', 500000.00, '2025-08-11 22:55:02', 'pending'),
(3, 1, 'Cash', 400000.00, '2025-08-11 22:57:06', 'paid'),
(4, 2, 'Credit Card', 500000.00, '2025-08-11 22:57:06', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `image`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Kem dưỡng ẩm', 'Kem dưỡng ẩm giúp da mềm mịn', 250000.00, 50, 'public/img/chụt.png', 1, '2025-08-11 22:55:02', '2025-08-14 16:32:03'),
(2, 'Sữa rửa mặt', 'Sữa rửa mặt cho mọi loại da', 150000.00, 100, 'public/img/chụt.png', 1, '2025-08-11 22:55:02', '2025-08-14 16:32:32'),
(3, 'Son môi đỏ', 'Son môi màu đỏ tươi', 180000.00, 80, 'public/img/chụt.png', 2, '2025-08-11 22:55:02', '2025-08-14 16:32:40'),
(4, 'Phấn phủ', 'Phấn phủ kiềm dầu', 200000.00, 60, 'public/img/chụt.png', 2, '2025-08-11 22:55:02', '2025-08-14 16:32:47'),
(5, 'Kem dưỡng da ban đêm', 'Giúp dưỡng ẩm và tái tạo da khi ngủ', 250000.00, 50, 'public/img/chụt.png', 1, '2025-08-11 22:57:06', '2025-08-14 16:32:55'),
(6, 'Son môi hồng', 'Son lì màu đỏ quyến rũ', 150000.00, 100, 'public/img/chụt.png', 2, '2025-08-11 22:57:06', '2025-08-14 16:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Chăm sóc da', 'Các sản phẩm chăm sóc da mặt, body', '2025-08-11 22:55:02'),
(2, 'Trang điểm', 'Mỹ phẩm trang điểm', '2025-08-11 22:55:02'),
(3, 'Mỹ phẩm dưỡng da', 'Sản phẩm chăm sóc và dưỡng da', '2025-08-11 22:57:06'),
(4, 'Trang điểm', 'Sản phẩm trang điểm chuyên nghiệp', '2025-08-11 22:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `product_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `name`, `email`, `content`, `rating`, `product_id`, `service_id`, `order_id`, `created_at`) VALUES
(3, 'Hoàng G', 'g@gmail.com', 'Sản phẩm dùng rất thích', 5, 1, NULL, NULL, '2025-08-11 22:57:06'),
(4, 'Mai H', 'h@gmail.com', 'Dịch vụ tuyệt vời', 5, NULL, 2, NULL, '2025-08-11 22:57:06'),
(5, 'Lý I', 'i@gmail.com', 'Đơn hàng giao nhanh và đúng yêu cầu', 4, NULL, NULL, 1, '2025-08-11 22:57:06'),
(6, 'd', 'binh@gmail.com', 'g', 4, NULL, NULL, 1, '2025-09-01 03:18:28'),
(10, 'ddddd', 'tho@gmail.com', 'ffffffffffffffff', 4, NULL, 4, NULL, '2025-09-01 03:52:53');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Super Admin', 'Toàn quyền quản trị hệ thống', '2025-08-11 22:55:02'),
(2, 'Staff', 'Nhân viên xử lý đơn hàng và dịch vụ', '2025-08-11 22:55:02'),
(3, 'super_admin', 'Toàn quyền quản trị hệ thống', '2025-08-11 22:57:06'),
(4, 'staff', 'Nhân viên xử lý đơn hàng và dịch vụ', '2025-08-11 22:57:06'),
(5, 'accountant', 'Kế toán quản lý thanh toán', '2025-08-11 22:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `category` varchar(50) NOT NULL DEFAULT 'dermatology'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `price`, `image`, `created_at`, `updated_at`, `is_active`, `category`) VALUES
(1, 'Massage Thư Giãn', 'Massage body giúp giảm căng thẳng và mệt mỏi', 500000.00, 'massage.jpg', '2025-08-11 22:55:02', '2025-08-20 13:09:21', 1, 'spa'),
(2, 'Chăm Sóc Da Mặt', 'Liệu trình chăm sóc da chuyên sâu', 300000.00, 'facial.jpg', '2025-08-11 22:55:02', '2025-08-11 22:55:02', 1, 'dermatology'),
(3, 'Gội Đầu Dưỡng Sinh', 'Gội đầu kết hợp massage đầu', 200000.00, 'hair_wash.jpg', '2025-08-11 22:55:02', '2025-08-20 13:09:21', 1, 'spa'),
(4, 'Massage toàn thân', 'Dịch vụ massage thư giãn 60 phút', 500000.00, 'massage.jpg', '2025-08-11 22:57:06', '2025-08-20 13:09:21', 1, 'spa'),
(5, 'Chăm Sóc Da Mặt Chuyên Sâu', 'Liệu trình chăm sóc da mặt chuyên sâu', 300000.00, 'facial.jpg', '2025-08-11 22:57:06', '2025-08-20 13:09:21', 1, 'dermatology'),
(6, 'HydraFacial', 'Làm sạch da cao cấp với công nghệ HydraFacial', 1500000.00, 'hydrafacial.jpg', '2025-08-20 13:09:21', '2025-08-20 13:09:21', 1, 'spa'),
(7, 'Oxygen Therapy', 'Liệu pháp oxy giúp trẻ hóa làn da', 1200000.00, 'oxygen_therapy.jpg', '2025-08-20 13:09:21', '2025-08-20 13:09:21', 1, 'spa'),
(8, 'Tiêm Filler', 'Tiêm filler thẩm mỹ cho khuôn mặt', 5000000.00, 'filler.jpg', '2025-08-20 13:09:21', '2025-08-20 13:09:21', 1, 'spa');

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int(11) NOT NULL COMMENT 'Định danh khung giờ',
  `time` varchar(10) NOT NULL COMMENT 'Khung giờ (VD: "08:00")',
  `is_available` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái sẵn có',
  `created_at` datetime DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`id`, `time`, `is_available`, `created_at`, `updated_at`) VALUES
(1, '08:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(2, '09:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(3, '10:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(4, '11:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(5, '13:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(6, '14:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(7, '15:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(8, '16:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00'),
(9, '17:00', 1, '2025-08-15 16:52:00', '2025-08-15 16:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `phone`, `created_at`) VALUES
(1, 'pbkdf2_sha256$600000$WDK23W71bHsDtmEIb36HPw$rj8APyx1wL4Z0Er+fFevTXyO8w2g1pvCc5XTXiAM3hw=', NULL, 1, 'admin', '', '', '', 1, 1, '2025-08-12 16:41:03.315751', NULL, '2025-08-12 16:41:03.699544'),
(2, 'pbkdf2_sha256$600000$WDzwDju9Tu2djxMehXCPw0$Fpjlw7AI8lV3r3ZlyKhgk0dDq9yHgQ2KdJ/CbxlPi/s=', '2025-08-14 09:23:44.942110', 1, 'admin1', '', '', '', 1, 1, '2025-08-13 03:00:46.874000', NULL, '2025-08-13 03:00:47.220194');

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE `users_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_users_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_type_id` (`order_type_id`),
  ADD KEY `confirmed_by` (`confirmed_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `idx_orders_status` (`status`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `order_shipping`
--
ALTER TABLE `order_shipping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `order_types`
--
ALTER TABLE `order_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_products_name` (`name`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_services_name` (`name`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Định danh lịch hẹn', AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Định danh khách hàng', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Định danh bác sĩ', AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_shipping`
--
ALTER TABLE `order_shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_types`
--
ALTER TABLE `order_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Định danh khung giờ', AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users_groups`
--
ALTER TABLE `users_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`order_type_id`) REFERENCES `order_types` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`confirmed_by`) REFERENCES `admin` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `admin` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_details_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_shipping`
--
ALTER TABLE `order_shipping`
  ADD CONSTRAINT `order_shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `admin` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
