# Laravel Social Network SPA - Installation Guide

## Features

- **User Profiles**: Each user has a customizable profile, with support for social network URLs.
- **Private & Public Profiles**: Users can choose to make their profile visible only to followers (private) or publicly accessible to all users.
- **Explore Section**: Discover trending users, posts, hashtags, and content from across the network.
- **Notifications**: Real-time notifications built into the system.
- **Follow System**: Users can follow/unfollow each other easily.
- **Messaging**: Direct messaging between users without needing third-party packages or APIs. Includes message deletion and editing, voice chat, file attachment, and emoji reactions.
- **Place Chat**: Chat based on location or specific places.
- **Post Reactions**: Users can like, dislike, or react to posts with full emoji support.
- **Comments**: Users can comment on posts and interact through likes and dislikes.
- **Repost System**: Users can easily repost others' posts to share with their own followers.
- **Related Posts**: Related posts are suggested to users based on the content they interact with.
- **Statistics System**: Visual charts for daily, monthly, annual, and overall statistics.
- **PWA Support**: The application is installable as a Progressive Web App (PWA) on mobile and desktop, offering offline capabilities and push notifications.
- **Multi-language Support**: Supports multiple languages using Laravel localization and React i18n.
- **Custom Pages**: Easily create and render custom static or dynamic pages.
- **Admin Panel**: Manage users, posts, and overall system settings.
- **Post Report System**: Users can report inappropriate posts.
- **Reserved Usernames**: Prevent registration of specific usernames.

## Youtube Learning

[Watch Tutorial](https://www.youtube.com/watch?v=Ll8t6B62w8s)

## Additional Notes

- Make sure you have correct database configurations.
- If you encounter any permission issues, ensure appropriate permissions on `storage/` and `bootstrap/cache/` folders.
- For Inertia.js and React integration, no extra setup needed after npm install; it is already configured.
- PWA functionalities are ready, including service workers, manifest file setup, and offline support.

---

This guide will help you set up the project locally.

## Requirements

- PHP 8.1+
- Composer
- Node.js & NPM
- Git
- MySQL or any compatible database

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/6arshid/Laravel-Social-Network-SPA.git
cd Laravel-Social-Network-SPA
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Set Up Environment File

```bash
cp .env.example .env
```

Then update your `.env` file with your database credentials and other necessary configurations.

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. Seed the Database

```bash
php artisan db:seed
```

### 8. Set Admin Privileges

After seeding, go to the `users` table and set `is_admin = 1` for your user manually.

### 9. Serve the Application

```bash
php artisan serve
```

The application will be available at:

```
http://localhost:8000
```

### 10. Build Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

---

## Optional Configuration

- To enable real-time notifications, configure a broadcast driver like Pusher or Laravel Echo.
- For PWA support, test installability on mobile devices and ensure HTTPS is used in production.
- Customize the Explore algorithm to your needs using trending data, hashtags, or post metrics.

---

Happy coding! 🚀
