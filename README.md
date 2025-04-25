# Laravel Social Network SPA - Installation Guide

## Features

- **Notifications**: Real-time notifications built into the system.
- **User Profiles**: Each user has a customizable profile.
- **Follow System**: Users can follow/unfollow each other easily.
- **Messaging**: Direct messaging between users without needing third-party packages or APIs. Includes message deletion and editing.
- **Post Reactions**: Users can like or react to posts with full emoji support.
- **Repost**: Share posts with followers.
- **Comments**: Users can comment on posts.

## Youtube Learning

[Watch Tutorial](https://www.youtube.com/watch?v=FoWrrlCx7QI)

## Additional Notes

- Make sure you have correct database configurations.
- If you encounter any permission issues, ensure appropriate permissions on `storage/` and `bootstrap/cache/` folders.
- For Inertia.js and React integration, no extra setup needed after npm install; it is already configured.

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

Or if you haven't installed Laravel installer globally:

```bash
composer global require "laravel/installer=~1.2"
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

The application will be available at `http://localhost:8000`.

### 10. Build Frontend Assets

To compile assets for development:

```bash
npm run dev
```

For production build:

```bash
npm run build
```

---

Happy coding! :rocket: