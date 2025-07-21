-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2025 at 09:49 PM
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
-- Database: `test4`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `blocked_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `comment_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_like` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `follower_id` bigint(20) UNSIGNED NOT NULL,
  `following_id` bigint(20) UNSIGNED NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `direction` enum('LTR','RTL') NOT NULL DEFAULT 'LTR',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `code`, `direction`, `created_at`, `updated_at`) VALUES
(1, 'English', 'en', 'LTR', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(2, 'فارسی', 'fa', 'RTL', '2025-07-21 17:43:28', '2025-07-21 17:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `emoji` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `is_seen` tinyint(1) NOT NULL DEFAULT 0,
  `is_edited` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_reactions`
--

CREATE TABLE `message_reactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_04_17_114851_messages', 1),
(5, '2025_04_17_173201_posts', 1),
(6, '2025_04_17_173217_media', 1),
(7, '2025_04_17_190534_create_comment_likes_table', 1),
(8, '2025_04_18_090615_create_reports_table', 1),
(9, '2025_04_20_092645_create_notifications_table', 1),
(10, '2025_04_20_154502_create_follows_table', 1),
(11, '2025_04_21_220841_create_message_reactions_table', 1),
(12, '2025_04_25_093010_create_statistics_table', 1),
(13, '2025_04_25_114023_username_unregister', 1),
(14, '2025_04_29_163147_language', 1),
(15, '2025_04_29_163202_translate', 1),
(16, '2025_04_29_194545_page', 1),
(17, '2025_06_07_000000_create_blocks_table', 1),
(18, '2025_06_08_000000_create_user_pages_table', 1),
(19, '2025_06_08_000001_create_page_likes_table', 1),
(20, '2025_06_09_000000_add_details_to_user_pages_table', 1),
(21, '2025_06_10_000000_add_user_page_id_to_posts_table', 1),
(22, '2025_06_11_000000_add_images_to_user_pages_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `type` varchar(255) NOT NULL DEFAULT 'general',
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `lang` varchar(5) NOT NULL DEFAULT 'en',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `lang`, `created_at`, `updated_at`) VALUES
(1, 'About Us', 'about', 'This is the content of the About Us page.', 'en', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(2, 'Contact Us', 'contact', 'This is the content of the Contact Us page.', 'en', '2025-07-21 17:43:29', '2025-07-21 17:43:29');

-- --------------------------------------------------------

--
-- Table structure for table `page_likes`
--

CREATE TABLE `page_likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_page_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `user_page_id` bigint(20) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `repost_id` bigint(20) UNSIGNED DEFAULT NULL,
  `views` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `post_url` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3stSAigETxlvGrC0xDwdxdl4VNnLiIgczyq9Hvek', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUdqSzVFRUlzUHBSWXlUTExEVHRVQktRdkRaenNjVUxQNnpjTmdpcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwNC9tYW5pZmVzdC5qc29uIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1753127315),
('zWSGCbspNSMHOa967zWlZE6X2dOAedCF620ycN2R', 23, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoib2FndEl1NFg4cWd4aXRaRTA3NXZSem0yWXdPVWQ0TFJOdG1oOXpkOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwNC9nZXQtdHJhbnNsYXRpb25zL2VuIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjM7fQ==', 1753127374);

-- --------------------------------------------------------

--
-- Table structure for table `statistics`
--

CREATE TABLE `statistics` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `event` varchar(255) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--

CREATE TABLE `translations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `language_id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `translations`
--

INSERT INTO `translations` (`id`, `language_id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 'welcome', 'Welcome', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(2, 2, 'welcome', 'خوش آمدید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(3, 1, 'login', 'Login', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(4, 2, 'login', 'ورود', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(5, 1, 'register', 'Register', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(6, 2, 'register', 'ثبت نام', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(7, 1, 'dashboard', 'Dashboard', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(8, 2, 'dashboard', 'داشبورد', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(9, 1, 'laravel_social_network', 'Laravel Social Network', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(10, 2, 'laravel_social_network', 'شبکه اجتماعی لاراول', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(11, 1, 'social_network_description', 'is a modern, fast, and secure social platform built with the powerful Laravel framework. It offers a dynamic space for connecting, sharing content, creating groups, private messaging, and meaningful user interactions. With a responsive design, advanced features, and top-notch security, we bring you a new and refreshing social networking experience.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(12, 2, 'social_network_description', 'یک پلتفرم اجتماعی مدرن، سریع و ایمن که با فریم‌ورک قدرتمند لاراول ساخته شده است. این پلتفرم فضایی پویا برای ارتباط، اشتراک‌گذاری محتوا، ایجاد گروه، پیام خصوصی و تعاملات معنادار کاربران فراهم می‌کند. با طراحی واکنش‌گرا، امکانات پیشرفته و امنیت برتر، تجربه‌ای تازه و جذاب از شبکه اجتماعی به شما ارائه می‌دهیم.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(13, 1, 'follow_system', 'Follow System', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(14, 2, 'follow_system', 'سیستم دنبال کردن', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(15, 1, 'follow_system_description', 'The Follow System allows users to easily follow or unfollow each other, helping them stay connected with the people and content they care about. It\'s designed to be fast, intuitive, and seamless, enhancing the overall social experience.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(16, 2, 'follow_system_description', 'سیستم دنبال کردن به کاربران اجازه می‌دهد به راحتی یکدیگر را دنبال یا لغو دنبال کنند و با افراد و محتوای موردعلاقه‌شان در ارتباط بمانند. این سیستم سریع، شهودی و بی‌وقفه طراحی شده است تا تجربه اجتماعی را بهبود ببخشد.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(17, 1, 'messaging', 'Messaging', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(18, 2, 'messaging', 'پیام‌رسانی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(19, 1, 'messaging_description', 'The Messaging feature enables users to communicate directly with each other. It supports message deletion and editing, voice chats, file attachments, and emoji reactions — providing a rich, smooth, and private conversation experience.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(20, 2, 'messaging_description', 'ویژگی پیام‌رسانی به کاربران امکان برقراری ارتباط مستقیم را می‌دهد. این سیستم از حذف و ویرایش پیام‌ها، چت صوتی، پیوست فایل و واکنش با ایموجی پشتیبانی می‌کند و تجربه‌ای روان، خصوصی و غنی برای مکالمه فراهم می‌کند.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(21, 1, 'place_chat', 'Place Chat', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(22, 2, 'place_chat', 'چت در مکان', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(23, 1, 'place_chat_description', 'The Place Chat feature allows users to join chats based on their current location or specific places, making it easy to connect with nearby communities, events, or shared interests.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(24, 2, 'place_chat_description', 'ویژگی چت در مکان به کاربران اجازه می‌دهد بر اساس مکان فعلی یا مکان‌های خاص وارد گفتگو شوند و با جوامع، رویدادها یا علایق مشترک ارتباط برقرار کنند.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(25, 1, 'social_network', 'Social Network', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(26, 2, 'social_network', 'شبکه اجتماعی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(27, 1, 'hero_description', 'Connect, Share, and Discover with the most advanced social platform built with Laravel and React', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(28, 2, 'hero_description', 'با پیشرفته‌ترین پلتفرم اجتماعی ساخته‌شده با لاراول و ری‌اکت ارتباط برقرار کنید، به اشتراک بگذارید و کشف کنید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(29, 1, 'get_started', 'Get Started', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(30, 2, 'get_started', 'شروع کنید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(31, 1, 'learn_more', 'Learn More', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(32, 2, 'learn_more', 'بیشتر بدانید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(33, 1, 'powerful_features', 'Powerful Features', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(34, 2, 'powerful_features', 'ویژگی‌های قدرتمند', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(35, 1, 'features_description', 'Everything you need to build meaningful connections and share your story', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(36, 2, 'features_description', 'هر آنچه برای ساخت ارتباطات معنادار و اشتراک داستان خود نیاز دارید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(37, 1, 'active_users', 'Active Users', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(38, 2, 'active_users', 'کاربران فعال', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(39, 1, 'messages_sent', 'Messages Sent', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(40, 2, 'messages_sent', 'پیام‌های ارسال‌شده', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(41, 1, 'uptime', 'Uptime', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(42, 2, 'uptime', 'زمان فعالیت', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(43, 1, 'ready_to_get_started', 'Ready to Get Started?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(44, 2, 'ready_to_get_started', 'آماده‌اید شروع کنید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(45, 1, 'join_millions', 'Join millions of users who are already connecting and sharing on our platform', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(46, 2, 'join_millions', 'به میلیون‌ها کاربری بپیوندید که همین حالا در پلتفرم ما در حال ارتباط و اشتراک‌گذاری هستند', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(47, 1, 'create_account', 'Create Account', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(48, 2, 'create_account', 'ایجاد حساب', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(49, 1, 'sign_in', 'Sign In', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(50, 2, 'sign_in', 'ورود', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(51, 1, 'built_with_versions', 'Copyright © {{year}} {{appName}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(52, 2, 'built_with_versions', 'حق نشر © {{year}} {{appName}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(53, 1, 'privacy_policy', 'Privacy Policy', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(54, 2, 'privacy_policy', 'حریم خصوصی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(55, 1, 'terms_of_service', 'Terms of Service', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(56, 2, 'terms_of_service', 'شرایط استفاده', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(57, 1, 'contact_us', 'Contact Us', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(58, 2, 'contact_us', 'تماس با ما', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(59, 1, 'name', 'Name', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(60, 2, 'name', 'نام', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(61, 1, 'email', 'Email', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(62, 2, 'email', 'ایمیل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(63, 1, 'password', 'Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(64, 2, 'password', 'رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(65, 1, 'confirm_password', 'Confirm Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(66, 2, 'confirm_password', 'تأیید رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(67, 1, 'already_registered', 'Already registered?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(68, 2, 'already_registered', 'قبلاً ثبت نام کرده‌اید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(69, 1, 'connect_with_google', 'Connect with Google', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(70, 2, 'connect_with_google', 'اتصال با گوگل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(71, 1, 'remember_me', 'Remember me', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(72, 2, 'remember_me', 'مرا به خاطر بسپار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(73, 1, 'dont_have_account', 'Don\'t have an account?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(74, 2, 'dont_have_account', 'حساب کاربری ندارید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(75, 1, 'register_now', 'Register', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(76, 2, 'register_now', 'همین حالا ثبت‌نام کنید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(77, 1, 'forgot_password', 'Forgot your password?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(78, 2, 'forgot_password', 'رمز عبور خود را فراموش کرده‌اید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(79, 1, 'forgot_password_description', 'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(80, 2, 'forgot_password_description', 'رمز عبور خود را فراموش کرده‌اید؟ مشکلی نیست. فقط ایمیل خود را وارد کنید تا لینکی برای بازنشانی رمز عبور دریافت کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(81, 1, 'email_password_reset_link', 'Email Password Reset Link', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(82, 2, 'email_password_reset_link', 'ارسال لینک بازنشانی رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(83, 1, 'confirm_password_description', 'This is a secure area of the application. Please confirm your password before continuing.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(84, 2, 'confirm_password_description', 'این بخش از برنامه ایمن است. لطفاً پیش از ادامه رمز عبور خود را تأیید کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(85, 1, 'confirm', 'Confirm', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(86, 2, 'confirm', 'تأیید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(87, 1, 'reset_password', 'Reset Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(88, 2, 'reset_password', 'بازنشانی رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(89, 1, 'reset_password_action', 'Reset Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(90, 2, 'reset_password_action', 'بازنشانی رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(91, 1, 'email_verification', 'Email Verification', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(92, 2, 'email_verification', 'تأیید ایمیل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(93, 1, 'verify_email_description', 'Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(94, 2, 'verify_email_description', 'با تشکر از ثبت‌نام شما! لطفاً پیش از شروع، ایمیل خود را با کلیک روی لینکی که برایتان ارسال شده است، تأیید کنید. اگر ایمیل را دریافت نکرده‌اید، خوشحال می‌شویم یک ایمیل دیگر برایتان ارسال کنیم.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(95, 1, 'verification_link_sent', 'A new verification link has been sent to the email address you provided during registration.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(96, 2, 'verification_link_sent', 'لینک تأیید جدید به ایمیل شما ارسال شد.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(97, 1, 'resend_verification_email', 'Resend Verification Email', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(98, 2, 'resend_verification_email', 'ارسال مجدد ایمیل تأیید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(99, 1, 'log_out', 'Log Out', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(100, 2, 'log_out', 'خروج', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(101, 1, 'chat_with_user', 'Chat with {{name}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(102, 2, 'chat_with_user', 'چت با {{name}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(103, 1, 'chat', 'Chats', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(104, 2, 'chat', 'چت‌ها', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(105, 1, 'typing', 'Typing...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(106, 2, 'typing', 'در حال تایپ...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(107, 1, 'pick_emoji', 'Pick emoji', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(108, 2, 'pick_emoji', 'انتخاب ایموجی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(109, 1, 'type_message_placeholder', 'Type a message...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(110, 2, 'type_message_placeholder', 'پیامی بنویسید...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(111, 1, 'start_recording', 'Start recording', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(112, 2, 'start_recording', 'شروع ضبط', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(113, 1, 'stop_recording', 'Stop recording', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(114, 2, 'stop_recording', 'توقف ضبط', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(115, 1, 'attach_file', 'Attach file', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(116, 2, 'attach_file', 'پیوست فایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(117, 1, 'send', 'Send', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(118, 2, 'send', 'ارسال', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(119, 1, 'seen', 'Seen', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(120, 2, 'seen', 'دیده شده', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(121, 1, 'edit_message', 'Edit', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(122, 2, 'edit_message', 'ویرایش پیام', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(123, 1, 'delete_message', 'Delete', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(124, 2, 'delete_message', 'حذف پیام', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(125, 1, 'message_deleted', '(deleted)', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(126, 2, 'message_deleted', '(حذف شده)', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(127, 1, 'message_edited', '(edited)', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(128, 2, 'message_edited', '(ویرایش شده)', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(129, 1, 'delete_message_confirm', 'Delete this message?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(130, 2, 'delete_message_confirm', 'آیا می‌خواهید این پیام را حذف کنید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(131, 1, 'edit_message_prompt', 'Edit your message:', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(132, 2, 'edit_message_prompt', 'پیام خود را ویرایش کنید:', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(133, 1, 'group_chat', 'Group Chat: {{room_name}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(134, 2, 'group_chat', 'گفتگوی گروهی: {{room_name}}', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(135, 1, 'your_chats', '💬 Your Chats', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(136, 2, 'your_chats', '💬 گفتگوهای شما', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(137, 1, 'search_by_name_or_email', 'Search by name or email...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(138, 2, 'search_by_name_or_email', 'جستجو بر اساس نام یا ایمیل...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(139, 1, 'search_place_placeholder', 'Search place...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(140, 2, 'search_place_placeholder', 'جستجوی مکان...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(141, 1, 'go', 'Go', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(142, 2, 'go', 'برو', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(143, 1, 'no_results_found', 'No results found.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(144, 2, 'no_results_found', 'نتیجه‌ای یافت نشد.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(145, 1, 'sent_a_file_or_no_message', '📎 Sent a file or no messages yet', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(146, 2, 'sent_a_file_or_no_message', '📎 فایلی ارسال شده یا پیامی موجود نیست', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(147, 1, 'place_not_found', '❌ Place not found or no chat exists for it.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(148, 2, 'place_not_found', '❌ مکان پیدا نشد یا گفتگویی برای آن وجود ندارد.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(149, 1, 'error_occurred', '⚠️ An error occurred. Try again.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(150, 2, 'error_occurred', '⚠️ خطایی رخ داده است. لطفاً دوباره تلاش کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(151, 1, 'create_new_post', 'Create New Post', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(152, 2, 'create_new_post', 'ایجاد پست جدید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(153, 1, 'create_a_new_post', 'Create a New Post', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(154, 2, 'create_a_new_post', 'ایجاد یک پست جدید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(155, 1, 'edit_post', 'Edit Post', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(156, 2, 'edit_post', 'ویرایش پست', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(157, 1, 'edit_your_post_placeholder', 'Edit your post...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(158, 2, 'edit_your_post_placeholder', 'پست خود را ویرایش کنید...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(159, 1, 'save_changes', 'Save Changes', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(160, 2, 'save_changes', 'ذخیره تغییرات', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(161, 1, 'no_posts_found_with_hashtag', 'No posts found with this hashtag.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(162, 2, 'no_posts_found_with_hashtag', 'هیچ پستی با این هشتگ یافت نشد.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(163, 1, 'load_more', 'Load More', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(164, 2, 'load_more', 'بارگذاری بیشتر', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(165, 1, 'my_posts', 'My Posts', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(166, 2, 'my_posts', 'پست‌های من', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(167, 1, 'new_post', '➕ New Post', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(168, 2, 'new_post', '➕ پست جدید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(169, 1, 'no_posts_created', 'You haven\'t created any posts yet.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(170, 2, 'no_posts_created', 'هنوز پستی ایجاد نکرده‌اید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(171, 1, 'show_post', 'Show', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(172, 2, 'show_post', 'نمایش پست', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(173, 1, 'related_posts', 'Related Posts', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(174, 2, 'related_posts', 'پست‌های مرتبط', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(175, 1, 'profile_info', 'Profile Info', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(176, 2, 'profile_info', 'اطلاعات پروفایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(177, 1, 'profile_image', 'Profile Image', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(178, 2, 'profile_image', 'تصویر پروفایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(179, 1, 'links', 'Links', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(180, 2, 'links', 'لینک‌ها', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(181, 1, 'notifications', 'Notifications', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(182, 2, 'notifications', 'اعلان‌ها', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(183, 1, 'delete_account', 'Delete Account', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(184, 2, 'delete_account', 'حذف حساب', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(185, 1, 'edit_profile', 'Edit Profile', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(186, 2, 'edit_profile', 'ویرایش پروفایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(187, 1, 'profile', 'Profile', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(188, 2, 'profile', 'پروفایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(189, 1, 'change_cover', 'Change Cover', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(190, 2, 'change_cover', 'تغییر کاور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(191, 1, 'add_cover', 'Add Cover', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(192, 2, 'add_cover', 'افزودن کاور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(193, 1, 'delete', 'Delete', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(194, 2, 'delete', 'حذف', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(195, 1, 'change_avatar', 'Change Avatar', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(196, 2, 'change_avatar', 'تغییر آواتار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(197, 1, 'add_avatar', 'Add Avatar', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(198, 2, 'add_avatar', 'افزودن آواتار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(199, 1, 'delete_image_confirm', 'Delete image?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(200, 2, 'delete_image_confirm', 'آیا مطمئن هستید که می‌خواهید تصویر را حذف کنید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(201, 1, 'uploading_image', 'Uploading...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(202, 2, 'uploading_image', 'در حال بارگذاری تصویر...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(203, 1, 'save_image', 'Save Image', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(204, 2, 'save_image', 'ذخیره تصویر', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(205, 1, 'cancel', 'Cancel', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(206, 2, 'cancel', 'لغو', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(207, 1, 'uploading_please_wait', 'Uploading image, please wait...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(208, 2, 'uploading_please_wait', 'در حال بارگذاری تصویر، لطفاً صبر کنید...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(209, 1, 'message', 'Message', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(210, 2, 'message', 'پیام', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(211, 1, 'Made_with', 'Made with', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(212, 2, 'Made_with', 'ساخته شده با', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(213, 1, 'by', 'by', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(214, 2, 'by', 'توسط', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(215, 1, 'statistics', 'Statistics', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(216, 2, 'statistics', 'آمار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(217, 1, 'delete_account_info', 'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(218, 2, 'delete_account_info', 'پس از حذف حساب کاربری، تمام منابع و داده‌های شما به طور دائمی حذف خواهند شد. لطفاً قبل از حذف، اطلاعات مورد نیاز خود را دانلود کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(219, 1, 'confirm_delete_account', 'Are you sure you want to delete your account?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(220, 2, 'confirm_delete_account', 'آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(221, 1, 'confirm_delete_account_info', 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(222, 2, 'confirm_delete_account_info', 'لطفاً برای تأیید حذف دائمی حساب خود، رمز عبورتان را وارد کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(223, 1, 'disable_email_notifications', 'Disable email notifications', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(224, 2, 'disable_email_notifications', 'غیرفعال کردن اعلان‌های ایمیل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(225, 1, 'current_avatar', 'Current Avatar', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(226, 2, 'current_avatar', 'آواتار فعلی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(227, 1, 'delete_avatar', 'Delete Avatar', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(228, 2, 'delete_avatar', 'حذف آواتار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(229, 1, 'upload_avatar', 'Upload Avatar', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(230, 2, 'upload_avatar', 'آپلود آواتار', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(231, 1, 'drag_drop_avatar', 'Drag & Drop avatar here or click to upload', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(232, 2, 'drag_drop_avatar', 'آواتار را بکشید و رها کنید یا کلیک کنید تا آپلود شود', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(233, 1, 'current_cover', 'Current Cover', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(234, 2, 'current_cover', 'کاور فعلی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(235, 1, 'delete_cover', 'Delete Cover', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(236, 2, 'delete_cover', 'حذف کاور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(237, 1, 'upload_cover', 'Upload Cover', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(238, 2, 'upload_cover', 'آپلود کاور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(239, 1, 'drag_drop_cover', 'Drag & Drop cover here or click to upload', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(240, 2, 'drag_drop_cover', 'کاور را بکشید و رها کنید یا کلیک کنید تا آپلود شود', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(241, 1, 'confirm_delete_image', 'Are you sure you want to delete the {{type}}?', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(242, 2, 'confirm_delete_image', 'آیا مطمئن هستید که می‌خواهید {{type}} را حذف کنید؟', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(243, 1, 'update_password', 'Update Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(244, 2, 'update_password', 'بروزرسانی رمز عبور', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(245, 1, 'ensure_account_secure', 'Ensure your account is using a long, random password to stay secure.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(246, 2, 'ensure_account_secure', 'برای امنیت بیشتر از یک رمز عبور طولانی و تصادفی استفاده کنید.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(247, 1, 'current_password', 'Current Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(248, 2, 'current_password', 'رمز عبور فعلی', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(249, 1, 'new_password', 'New Password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(250, 2, 'new_password', 'رمز عبور جدید', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(251, 1, 'profile_information', 'Profile Information', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(252, 2, 'profile_information', 'اطلاعات پروفایل', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(253, 1, 'update_profile_info', 'Update your account\'s profile information and email address.', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(254, 2, 'update_profile_info', 'به‌روزرسانی اطلاعات پروفایل و ایمیل شما', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(255, 1, 'username', 'Username', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(256, 2, 'username', 'نام کاربری', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(257, 1, 'checking_username', 'Checking username availability...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(258, 2, 'checking_username', 'در حال بررسی دسترسی نام کاربری...', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(259, 1, 'username_available', 'Username is available.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(260, 2, 'username_available', 'نام کاربری در دسترس است.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(261, 1, 'username_not_available', 'This username is not available.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(262, 2, 'username_not_available', 'این نام کاربری موجود نیست.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(263, 1, 'email_unverified', 'Your email address is unverified.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(264, 2, 'email_unverified', 'آدرس ایمیل شما تأیید نشده است.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(265, 1, 'resend_verification', 'Click here to re-send the verification email.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(266, 2, 'resend_verification', 'برای ارسال مجدد ایمیل تأیید کلیک کنید.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(267, 1, 'verification_sent', 'A new verification link has been sent to your email address.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(268, 2, 'verification_sent', 'ایمیل تأیید جدید ارسال شد.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(269, 1, 'profile_links_information', 'Profile Links Information', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(270, 2, 'profile_links_information', 'اطلاعات لینک‌های پروفایل', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(271, 1, 'update_social_network_info', 'Update your social network information.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(272, 2, 'update_social_network_info', 'به‌روزرسانی اطلاعات شبکه‌های اجتماعی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(273, 1, 'bio', 'Bio', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(274, 2, 'bio', 'بیوگرافی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(275, 1, 'location', 'Location', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(276, 2, 'location', 'مکان', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(277, 1, 'website', 'Website', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(278, 2, 'website', 'وب‌سایت', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(279, 1, 'phone', 'Phone', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(280, 2, 'phone', 'شماره تلفن', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(281, 1, 'instagram', 'Instagram', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(282, 2, 'instagram', 'اینستاگرام', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(283, 1, 'twitter', 'Twitter', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(284, 2, 'twitter', 'توییتر', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(285, 1, 'facebook', 'Facebook', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(286, 2, 'facebook', 'فیسبوک', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(287, 1, 'linkedin', 'LinkedIn', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(288, 2, 'linkedin', 'لینکدین', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(289, 1, 'github', 'GitHub', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(290, 2, 'github', 'گیت‌هاب', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(291, 1, 'tiktok', 'TikTok', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(292, 2, 'tiktok', 'تیک‌تاک', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(293, 1, 'snapchat', 'Snapchat', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(294, 2, 'snapchat', 'اسنپ‌چت', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(295, 1, 'youtube', 'YouTube', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(296, 2, 'youtube', 'یوتیوب', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(297, 1, 'pinterest', 'Pinterest', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(298, 2, 'pinterest', 'پینترست', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(299, 1, 'whatsapp', 'WhatsApp', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(300, 2, 'whatsapp', 'واتساپ', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(301, 1, 'telegram', 'Telegram', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(302, 2, 'telegram', 'تلگرام', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(303, 1, 'users', 'Users', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(304, 2, 'users', 'کاربران', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(305, 1, 'search_by_name_or_username', 'Search by name or username...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(306, 2, 'search_by_name_or_username', 'جستجو بر اساس نام یا نام کاربری...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(307, 1, 'no_users_found', 'No users found', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(308, 2, 'no_users_found', 'کاربری یافت نشد', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(309, 1, 'follow', 'Follow', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(310, 2, 'follow', 'دنبال‌کردن', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(311, 1, 'unfollow', 'Unfollow', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(312, 2, 'unfollow', 'لغو دنبال', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(313, 1, 'suggested_users_to_follow', 'Suggested Users to Follow', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(314, 2, 'suggested_users_to_follow', 'کاربران پیشنهادی برای دنبال‌کردن', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(315, 1, 'posts_from_followed_users', 'Posts from Followed Users', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(316, 2, 'posts_from_followed_users', 'پست‌های کاربران دنبال شده', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(317, 1, 'no_posts_to_display', 'No posts to display', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(318, 2, 'no_posts_to_display', 'پستی برای نمایش وجود ندارد', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(319, 1, 'AdminPanel', 'Admin Panel', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(320, 2, 'AdminPanel', 'پنل مدیریت', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(321, 1, 'YourProfile', 'Your Profile', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(322, 2, 'YourProfile', 'پروفایل شما', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(323, 1, 'posts', 'Posts', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(324, 2, 'posts', 'پست‌ها', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(325, 1, 'pages', 'Pages', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(326, 2, 'pages', 'صفحات', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(327, 1, 'create_page', 'Create Page', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(328, 2, 'create_page', 'ایجاد صفحه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(329, 1, 'page_name', 'Page Name', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(330, 2, 'page_name', 'نام صفحه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(331, 1, 'page_category', 'Page Category', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(332, 2, 'page_category', 'دسته‌بندی صفحه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(333, 1, 'no_pages_found', 'No pages found', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(334, 2, 'no_pages_found', 'هیچ صفحه‌ای پیدا نشد', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(335, 1, 'search', 'Search', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(336, 2, 'search', 'جستجو', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(337, 1, 'phone_number', 'Phone Number', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(338, 2, 'phone_number', 'شماره تماس', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(339, 1, 'public_email', 'Public Email', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(340, 2, 'public_email', 'ایمیل عمومی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(341, 1, 'categories', 'Categories', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(342, 2, 'categories', 'دسته‌بندی‌ها', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(343, 1, 'select_category', 'Select Category', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(344, 2, 'select_category', 'انتخاب دسته‌بندی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(345, 1, 'like', 'Like', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(346, 2, 'like', 'پسندیدن', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(347, 1, 'unlike', 'Unlike', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(348, 2, 'unlike', 'لغو پسند', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(349, 1, 'edit_page', 'Edit Page', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(350, 2, 'edit_page', 'ویرایش صفحه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(351, 1, 'update', 'Update', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(352, 2, 'update', 'به‌روزرسانی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(353, 1, 'No notifications available', 'No notifications available', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(354, 2, 'No notifications available', 'هیچ اعلانی موجود نیست', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(355, 1, 'Edit', 'Edit', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(356, 2, 'Edit', 'ویرایش', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(357, 1, 'Write your comment...', 'Write your comment...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(358, 2, 'Write your comment...', 'دیدگاه خود را بنویسید...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(359, 1, 'Submitting...', 'Submitting...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(360, 2, 'Submitting...', 'در حال ارسال...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(361, 1, 'Submit Comment', 'Submit Comment', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(362, 2, 'Submit Comment', 'ارسال دیدگاه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(363, 1, 'Loading...', 'Loading...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(364, 2, 'Loading...', 'در حال بارگذاری...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(365, 1, 'Load more comments', 'Load more comments', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(366, 2, 'Load more comments', 'بارگذاری دیدگاه‌های بیشتر', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(367, 1, 'You must be logged in to submit a comment.', 'You must be logged in to submit a comment.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(368, 2, 'You must be logged in to submit a comment.', 'برای ارسال دیدگاه باید وارد شوید.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(369, 1, 'Error while submitting comment.', 'Error while submitting comment.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(370, 2, 'Error while submitting comment.', 'خطا هنگام ارسال دیدگاه.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(371, 1, 'Are you sure you want to delete this comment?', 'Are you sure you want to delete this comment?', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(372, 2, 'Are you sure you want to delete this comment?', 'آیا مطمئن هستید که می‌خواهید این دیدگاه را حذف کنید؟', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(373, 1, 'Failed to like or dislike. Please try again.', 'Failed to like or dislike. Please try again.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(374, 2, 'Failed to like or dislike. Please try again.', 'خطا در پسندیدن یا نپسندیدن. لطفاً دوباره تلاش کنید.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(375, 1, 'This post has been removed due to reporting abuse.', 'This post has been removed due to reporting abuse.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(376, 2, 'This post has been removed due to reporting abuse.', 'این پست به دلیل گزارش سوءاستفاده حذف شده است.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(377, 1, 'This post has been removed due to a violation report.', 'This post has been removed due to a violation report.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(378, 2, 'This post has been removed due to a violation report.', 'این پست به دلیل گزارش تخلف حذف شده است.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(379, 1, 'Are you sure you want to delete this post?', 'Are you sure you want to delete this post?', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(380, 2, 'Are you sure you want to delete this post?', 'آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(381, 1, 'Incorrect captcha!', 'Incorrect captcha!', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(382, 2, 'Incorrect captcha!', 'کپچا اشتباه است!', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(383, 1, 'views', 'views', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(384, 2, 'views', 'بازدیدها', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(385, 1, 'Reposted from', 'Reposted from', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(386, 2, 'Reposted from', 'بازنشر از', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(387, 1, 'Deleted User', 'Deleted User', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(388, 2, 'Deleted User', 'کاربر حذف شده', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(389, 1, 'Report', 'Report', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(390, 2, 'Report', 'گزارش', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(391, 1, 'Report Post', 'Report Post', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(392, 2, 'Report Post', 'گزارش پست', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(393, 1, 'Describe the issue clearly...', 'Describe the issue clearly...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(394, 2, 'Describe the issue clearly...', 'مشکل را به طور واضح شرح دهید...', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(395, 1, 'Please solve: 3 + 4 =', 'Please solve: 3 + 4 =', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(396, 2, 'Please solve: 3 + 4 =', 'لطفاً حل کنید: ۳ + ۴ =', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(397, 1, 'Submit', 'Submit', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(398, 2, 'Submit', 'ارسال', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(399, 1, 'daily_views', 'Daily Views', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(400, 2, 'daily_views', 'بازدیدهای روزانه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(401, 1, 'monthly_views', 'Monthly Views', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(402, 2, 'monthly_views', 'بازدیدهای ماهانه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(403, 1, 'yearly_views', 'Yearly Views', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(404, 2, 'yearly_views', 'بازدیدهای سالانه', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(405, 1, 'total_views', 'Total Views', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(406, 2, 'total_views', 'مجموع بازدیدها', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(407, 1, 'followed_users', 'Followed Users', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(408, 2, 'followed_users', 'کاربران دنبال‌شده', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(409, 1, 'explorer', 'Explorer', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(410, 2, 'explorer', 'اکسپلور', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(411, 1, 'no_followed_posts', 'No posts from followed users yet.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(412, 2, 'no_followed_posts', 'هنوز پستی از کاربران دنبال‌شده وجود ندارد.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(413, 1, 'no_explorer_posts', 'No posts available to explore.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(414, 2, 'no_explorer_posts', 'پستی برای اکسپلور وجود ندارد.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(415, 1, 'loading', 'Loading', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(416, 2, 'loading', 'در حال بارگذاری', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(417, 1, 'back_to_top', 'Back to Top', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(418, 2, 'back_to_top', 'بازگشت به بالا', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(419, 1, 'retry', 'Retry', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(420, 2, 'retry', 'تلاش مجدد', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(421, 1, 'blocked_users', 'Blocked Users', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(422, 2, 'blocked_users', 'کاربران مسدود شده', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(423, 1, 'block', 'Block', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(424, 2, 'block', 'مسدود کردن', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(425, 1, 'unblock', 'Unblock', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(426, 2, 'unblock', 'رفع مسدودی', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(427, 1, 'no_blocked_users', 'No blocked users', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(428, 2, 'no_blocked_users', 'کاربر مسدودی وجود ندارد', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(429, 1, 'you_blocked_this_user', 'You have blocked this user.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(430, 2, 'you_blocked_this_user', 'شما این کاربر را مسدود کرده‌اید.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(431, 1, 'user_has_blocked_you', 'This user has blocked you.', '2025-07-21 17:43:29', '2025-07-21 17:43:29'),
(432, 2, 'user_has_blocked_you', 'این کاربر شما را مسدود کرده است.', '2025-07-21 17:43:29', '2025-07-21 17:43:29');

-- --------------------------------------------------------

--
-- Table structure for table `username_unregister`
--

CREATE TABLE `username_unregister` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `username_unregister`
--

INSERT INTO `username_unregister` (`id`, `username`, `created_at`, `updated_at`) VALUES
(1, 'root', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(2, 'support', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(3, 'help', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(4, 'info', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(5, 'contact', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(6, 'username', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(7, 'user', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(8, 'users', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(9, 'profile', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(10, 'settings', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(11, 'account', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(12, 'dashboard', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(13, 'home', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(14, 'login', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(15, 'register', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(16, 'logout', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(17, 'forgot-password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(18, 'reset-password', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(19, 'verify-email', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(20, 'email', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(21, 'chat', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(22, 'system', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(23, 'api', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(24, 'webmaster', '2025-07-21 17:43:28', '2025-07-21 17:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `snapchat` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `pinterest` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `verify` tinyint(1) NOT NULL DEFAULT 0,
  `disable_notifications` tinyint(1) NOT NULL DEFAULT 0,
  `is_private` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `username`, `email_verified_at`, `password`, `is_admin`, `avatar`, `cover`, `google_id`, `bio`, `location`, `website`, `phone`, `instagram`, `twitter`, `facebook`, `linkedin`, `github`, `tiktok`, `snapchat`, `youtube`, `pinterest`, `whatsapp`, `telegram`, `verify`, `disable_notifications`, `is_private`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', 'susie82', '2025-07-21 17:43:24', '$2y$12$hDMkfrEybln43a6VYm8nkOFlnDE4pKFedXgbxH9ah4l19yerOZmFC', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'uC150BlYsy', '2025-07-21 17:43:24', '2025-07-21 17:43:24'),
(2, 'Admin', 'admin@example.com', 'admin123', '2025-07-21 17:43:25', '$2y$12$uduhtU4Q7kVet6T3Ed7wuuzK7vlOQ3Hs4Vx4g5c500yDhecWNAe1G', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '2nQ88sE1S7', '2025-07-21 17:43:25', '2025-07-21 17:43:25'),
(3, 'Mr. Wilhelm Wilderman Sr.', 'hillary.johnson@example.com', 'stark.noel', '2025-07-21 17:43:25', '$2y$12$zlyzCt/kXi/nROe1vbgEFOL6fTnLVVk09zfPRUKZ9L132kDP/HGkS', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'aEzwoESjmb', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(4, 'Marisa McKenzie', 'heller.berry@example.net', 'winona69', '2025-07-21 17:43:25', '$2y$12$5PZT8WcPYphP.7se.d1t6.Foub0vzKc7HYHQo8Psr9bqXHnhJ9d5u', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'RQWCYIjXq6', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(5, 'Miss Janet Kling DVM', 'kilback.pink@example.net', 'fbarrows', '2025-07-21 17:43:25', '$2y$12$DnpNRKY9yS.CvjX3pruYf.RW534ejRdUsvSHaBQvVXUf8OjvI.MXy', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'z3Bps20u7T', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(6, 'Evangeline Reichel', 'sean36@example.org', 'ursula81', '2025-07-21 17:43:25', '$2y$12$O.BxwnYDKpixtuwnFIZA.OaUfkwnuwueE6YF1Bac.tGSz5BueA6Se', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'zVsjSHFnJW', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(7, 'Kenyatta Pouros', 'runolfsson.bernadette@example.org', 'zetta.rath', '2025-07-21 17:43:25', '$2y$12$kINKO6mhI6lZBaPf3K/cluoywzJWPZfgUEExk3QtlstQSUmlai9a2', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'fw7BtBkf9w', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(8, 'Dr. Claud Ullrich DDS', 'litzy70@example.com', 'hardy.jaskolski', '2025-07-21 17:43:26', '$2y$12$DSTdkhuAK9OHMuWvI6mCduKRrtA.CW87gBGceKhfWzwMyADNyppnS', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'fdtjJJIo1J', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(9, 'Thelma Waelchi', 'keebler.kasandra@example.com', 'adrain.predovic', '2025-07-21 17:43:26', '$2y$12$UvlI/xL5zmkL3qLW8lKbE.Z1hjzrpaRyVqZ3xbkhVKyZ6S3QuvIR6', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'wRD1ntOSsP', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(10, 'Dr. Delbert Cole Sr.', 'darryl94@example.com', 'west.polly', '2025-07-21 17:43:26', '$2y$12$knVhM5Iu/D0vflFolPQAYux1j5Y6JdV8vSs.zYL2h9ItKXLDbPyEu', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'jeSSFXSwgr', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(11, 'Christiana Okuneva', 'quigley.braden@example.org', 'brice', '2025-07-21 17:43:26', '$2y$12$rCATQKhIrhlq2JySWS8s3ekVMBkmnyaLmHaNRlU.dU5dXfg6AVi5m', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'zxIWC7g7CW', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(12, 'Perry Balistreri', 'robb.welch@example.net', 'santos96', '2025-07-21 17:43:26', '$2y$12$tj0IFcH0lRGhWqaNRP/hA.Whg006n/BjZnviuK5rywXV6HivsyDsC', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'ZW9ycz2s6F', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(13, 'Prof. Paige Nader PhD', 'okuphal@example.com', 'dayton82', '2025-07-21 17:43:26', '$2y$12$PUzJGfm5fKAGrB13Xv/l4e.qGsyAZ9aMY0ZpFLp4dIauG78CoGUse', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'NFXNEyqyz6', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(14, 'Marcos Howell', 'jaida05@example.net', 'xherman', '2025-07-21 17:43:26', '$2y$12$E0JLWJRKNDtGl.sjYn.CXObdAa5Q8J1KZlTEm5LSHZYDhjXqbBWca', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'lY1hEuFoAh', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(15, 'Theresa Towne', 'clemmie76@example.org', 'colt.stehr', '2025-07-21 17:43:27', '$2y$12$VYzZfRcsNzditS821QyE8e5LWJsLmLASUX29Z3WWkj/kYs6aL6yAi', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'GSdnXq0R3A', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(16, 'Vida McGlynn', 'greenfelder.nola@example.com', 'delilah.orn', '2025-07-21 17:43:27', '$2y$12$wxclWDnkgk8Za55evnmUUe7pmaQxVqkhIdNjtL06nOlWiAx5HOLVK', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'wwTrXkQRZM', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(17, 'Rylee Jenkins', 'kali.ledner@example.com', 'nicklaus.pagac', '2025-07-21 17:43:27', '$2y$12$fyNgOQqEgoiGoFcHqdCN.uIW3eKRVdlJC8yy5XDNvhqFSTZTmpFLi', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, '7SAEJHASnX', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(18, 'Dr. Sallie Schuster MD', 'huels.filomena@example.net', 'marcus.cremin', '2025-07-21 17:43:27', '$2y$12$W30gAXQSJX/uA0tNCnA34erCWlo7Jurdh0wCu1ADsCdo2HdAp2mVq', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'GgHHVz7tpL', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(19, 'Wilfrid Jacobs', 'ritchie.elinor@example.com', 'andreanne.sawayn', '2025-07-21 17:43:27', '$2y$12$RuBYE0nlQX6wo8fyf4FATubvcSru5rct5yzr/1shn.4JF3GZqdSNW', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'YJUrpYaspF', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(20, 'Myah Koch', 'titus07@example.com', 'grunolfsson', '2025-07-21 17:43:27', '$2y$12$GYCQPpSEE26yH0XEsCAX.uVkqSIi2O6igBmHp/OFxsvQE9YcLso0a', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'jRQQHWYXAf', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(21, 'Yasmeen Ernser', 'johns.henry@example.net', 'samir.krajcik', '2025-07-21 17:43:28', '$2y$12$Ptb5zdnYRPtgEdjHC0RMB.POg5y4sA4Io4Wf5eMZDn4st4gE/nWei', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'WCYKzfvNlX', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(22, 'Adrain Heller Jr.', 'herman.eduardo@example.org', 'marquardt.susanna', '2025-07-21 17:43:28', '$2y$12$us1JdqXbJfOvw.VAUyDyxuF/en.Jt5E5fnWaKMwPcLpTOTpgdwEPy', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 'qVZJ1eVXVA', '2025-07-21 17:43:28', '2025-07-21 17:43:28'),
(23, 'admin', 'admin@admin.com', 'user_687e99a3b9efc', NULL, '$2y$12$dr4YRFQIsuiL2op6UIsgJev/Flpno2mPCJExEVVRiDAEPhi6q8yMG', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, '2025-07-21 17:48:52', '2025-07-21 17:48:52');

-- --------------------------------------------------------

--
-- Table structure for table `user_pages`
--

CREATE TABLE `user_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `public_email` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blocks_user_id_blocked_id_unique` (`user_id`,`blocked_id`),
  ADD KEY `blocks_blocked_id_foreign` (`blocked_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_post_id_foreign` (`post_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`),
  ADD KEY `comments_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_likes_comment_id_foreign` (`comment_id`),
  ADD KEY `comment_likes_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follows_follower_id_following_id_unique` (`follower_id`,`following_id`),
  ADD KEY `follows_following_id_foreign` (`following_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `languages_code_unique` (`code`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `likes_post_id_foreign` (`post_id`),
  ADD KEY `likes_user_id_foreign` (`user_id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_post_id_foreign` (`post_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`);

--
-- Indexes for table `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_reactions_message_id_foreign` (`message_id`),
  ADD KEY `message_reactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pages_slug_unique` (`slug`);

--
-- Indexes for table `page_likes`
--
ALTER TABLE `page_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_likes_user_page_id_user_id_unique` (`user_page_id`,`user_id`),
  ADD KEY `page_likes_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_user_id_foreign` (`user_id`),
  ADD KEY `posts_repost_id_foreign` (`repost_id`),
  ADD KEY `posts_user_page_id_foreign` (`user_page_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reports_post_id_foreign` (`post_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `statistics`
--
ALTER TABLE `statistics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `translations_language_id_key_unique` (`language_id`,`key`);

--
-- Indexes for table `username_unregister`
--
ALTER TABLE `username_unregister`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_unregister_username_unique` (`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- Indexes for table `user_pages`
--
ALTER TABLE `user_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_pages_slug_unique` (`slug`),
  ADD KEY `user_pages_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_reactions`
--
ALTER TABLE `message_reactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `page_likes`
--
ALTER TABLE `page_likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `statistics`
--
ALTER TABLE `statistics`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=433;

--
-- AUTO_INCREMENT for table `username_unregister`
--
ALTER TABLE `username_unregister`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `user_pages`
--
ALTER TABLE `user_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocks`
--
ALTER TABLE `blocks`
  ADD CONSTRAINT `blocks_blocked_id_foreign` FOREIGN KEY (`blocked_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_comment_id_foreign` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_following_id_foreign` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_reactions`
--
ALTER TABLE `message_reactions`
  ADD CONSTRAINT `message_reactions_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_reactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `page_likes`
--
ALTER TABLE `page_likes`
  ADD CONSTRAINT `page_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `page_likes_user_page_id_foreign` FOREIGN KEY (`user_page_id`) REFERENCES `user_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_repost_id_foreign` FOREIGN KEY (`repost_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_user_page_id_foreign` FOREIGN KEY (`user_page_id`) REFERENCES `user_pages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `translations`
--
ALTER TABLE `translations`
  ADD CONSTRAINT `translations_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);

--
-- Constraints for table `user_pages`
--
ALTER TABLE `user_pages`
  ADD CONSTRAINT `user_pages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
