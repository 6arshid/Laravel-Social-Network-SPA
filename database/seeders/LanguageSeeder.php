<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;
use App\Models\Translation;

class LanguageSeeder extends Seeder
{
    public function run()
    {
        // ایجاد زبان انگلیسی
        $en = Language::create([
            'name' => 'English',
            'code' => 'en',
            'direction' => 'LTR',
        ]);

        // ایجاد زبان فارسی
        $fa = Language::create([
            'name' => 'فارسی',
            'code' => 'fa',
            'direction' => 'RTL',
        ]);

        // تعریف ترجمه‌های اولیه
        $translations = [
            // Authentication
            'welcome' => ['en' => 'Welcome', 'fa' => 'خوش آمدید'],
            'login' => ['en' => 'Login', 'fa' => 'ورود'],
            'register' => ['en' => 'Register', 'fa' => 'ثبت نام'],
            'dashboard' => ['en' => 'Dashboard', 'fa' => 'داشبورد'],
            'laravel_social_network' => [
                'en' => 'Laravel Social Network', 
                'fa' => 'شبکه اجتماعی لاراول'
            ],
            'social_network_description' => [
                'en' => 'is a modern, fast, and secure social platform built with the powerful Laravel framework. It offers a dynamic space for connecting, sharing content, creating groups, private messaging, and meaningful user interactions. With a responsive design, advanced features, and top-notch security, we bring you a new and refreshing social networking experience.',
                'fa' => 'یک پلتفرم اجتماعی مدرن، سریع و ایمن که با فریم‌ورک قدرتمند لاراول ساخته شده است. این پلتفرم فضایی پویا برای ارتباط، اشتراک‌گذاری محتوا، ایجاد گروه، پیام خصوصی و تعاملات معنادار کاربران فراهم می‌کند. با طراحی واکنش‌گرا، امکانات پیشرفته و امنیت برتر، تجربه‌ای تازه و جذاب از شبکه اجتماعی به شما ارائه می‌دهیم.'
            ],
            'follow_system' => ['en' => 'Follow System', 'fa' => 'سیستم دنبال کردن'],
            'follow_system_description' => [
                'en' => 'The Follow System allows users to easily follow or unfollow each other, helping them stay connected with the people and content they care about. It\'s designed to be fast, intuitive, and seamless, enhancing the overall social experience.',
                'fa' => 'سیستم دنبال کردن به کاربران اجازه می‌دهد به راحتی یکدیگر را دنبال یا لغو دنبال کنند و با افراد و محتوای موردعلاقه‌شان در ارتباط بمانند. این سیستم سریع، شهودی و بی‌وقفه طراحی شده است تا تجربه اجتماعی را بهبود ببخشد.'
            ],
            'messaging' => ['en' => 'Messaging', 'fa' => 'پیام‌رسانی'],
            'messaging_description' => [
                'en' => 'The Messaging feature enables users to communicate directly with each other. It supports message deletion and editing, voice chats, file attachments, and emoji reactions — providing a rich, smooth, and private conversation experience.',
                'fa' => 'ویژگی پیام‌رسانی به کاربران امکان برقراری ارتباط مستقیم را می‌دهد. این سیستم از حذف و ویرایش پیام‌ها، چت صوتی، پیوست فایل و واکنش با ایموجی پشتیبانی می‌کند و تجربه‌ای روان، خصوصی و غنی برای مکالمه فراهم می‌کند.'
            ],
            'place_chat' => ['en' => 'Place Chat', 'fa' => 'چت در مکان'],
            'place_chat_description' => [
                'en' => 'The Place Chat feature allows users to join chats based on their current location or specific places, making it easy to connect with nearby communities, events, or shared interests.',
                'fa' => 'ویژگی چت در مکان به کاربران اجازه می‌دهد بر اساس مکان فعلی یا مکان‌های خاص وارد گفتگو شوند و با جوامع، رویدادها یا علایق مشترک ارتباط برقرار کنند.'
            ],

            // Welcome Page
            'social_network' => ['en' => 'Social Network', 'fa' => 'شبکه اجتماعی'],
            'hero_description' => [
                'en' => 'Connect, Share, and Discover with the most advanced social platform built with Laravel and React',
                'fa' => 'با پیشرفته‌ترین پلتفرم اجتماعی ساخته‌شده با لاراول و ری‌اکت ارتباط برقرار کنید، به اشتراک بگذارید و کشف کنید'
            ],
            'get_started' => ['en' => 'Get Started', 'fa' => 'شروع کنید'],
            'learn_more' => ['en' => 'Learn More', 'fa' => 'بیشتر بدانید'],
            'powerful_features' => ['en' => 'Powerful Features', 'fa' => 'ویژگی‌های قدرتمند'],
            'features_description' => [
                'en' => 'Everything you need to build meaningful connections and share your story',
                'fa' => 'هر آنچه برای ساخت ارتباطات معنادار و اشتراک داستان خود نیاز دارید'
            ],
            'active_users' => ['en' => 'Active Users', 'fa' => 'کاربران فعال'],
            'messages_sent' => ['en' => 'Messages Sent', 'fa' => 'پیام‌های ارسال‌شده'],
            'uptime' => ['en' => 'Uptime', 'fa' => 'زمان فعالیت'],
            'ready_to_get_started' => ['en' => 'Ready to Get Started?', 'fa' => 'آماده‌اید شروع کنید؟'],
            'join_millions' => [
                'en' => 'Join millions of users who are already connecting and sharing on our platform',
                'fa' => 'به میلیون‌ها کاربری بپیوندید که همین حالا در پلتفرم ما در حال ارتباط و اشتراک‌گذاری هستند'
            ],
            'create_account' => ['en' => 'Create Account', 'fa' => 'ایجاد حساب'],
            'sign_in' => ['en' => 'Sign In', 'fa' => 'ورود'],
            'built_with_versions' => [
                'en' => 'Built with ❤️ using Laravel v{{laravelVersion}} and PHP v{{phpVersion}}',
                'fa' => 'ساخته‌شده با ❤️ با استفاده از لاراول نسخه {{laravelVersion}} و پی‌اچ‌پی نسخه {{phpVersion}}'
            ],
            'privacy_policy' => ['en' => 'Privacy Policy', 'fa' => 'حریم خصوصی'],
            'terms_of_service' => ['en' => 'Terms of Service', 'fa' => 'شرایط استفاده'],
            'contact_us' => ['en' => 'Contact Us', 'fa' => 'تماس با ما'],
            
            // Registration/Login
            'name' => ['en' => 'Name', 'fa' => 'نام'],
            'email' => ['en' => 'Email', 'fa' => 'ایمیل'],
            'password' => ['en' => 'Password', 'fa' => 'رمز عبور'],
            'confirm_password' => ['en' => 'Confirm Password', 'fa' => 'تأیید رمز عبور'],
            'already_registered' => ['en' => 'Already registered?', 'fa' => 'قبلاً ثبت نام کرده‌اید؟'],
            'connect_with_google' => ['en' => 'Connect with Google', 'fa' => 'اتصال با گوگل'],
            'remember_me' => ['en' => 'Remember me', 'fa' => 'مرا به خاطر بسپار'],
            'dont_have_account' => ['en' => 'Don\'t have an account?', 'fa' => 'حساب کاربری ندارید؟'],
            'register_now' => ['en' => 'Register', 'fa' => 'همین حالا ثبت‌نام کنید'],
            'forgot_password' => ['en' => 'Forgot your password?', 'fa' => 'رمز عبور خود را فراموش کرده‌اید؟'],
            'forgot_password_description' => [
                'en' => 'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
                'fa' => 'رمز عبور خود را فراموش کرده‌اید؟ مشکلی نیست. فقط ایمیل خود را وارد کنید تا لینکی برای بازنشانی رمز عبور دریافت کنید.'
            ],
            'email_password_reset_link' => ['en' => 'Email Password Reset Link', 'fa' => 'ارسال لینک بازنشانی رمز عبور'],
            'confirm_password_description' => [
                'en' => 'This is a secure area of the application. Please confirm your password before continuing.',
                'fa' => 'این بخش از برنامه ایمن است. لطفاً پیش از ادامه رمز عبور خود را تأیید کنید.'
            ],
            'confirm' => ['en' => 'Confirm', 'fa' => 'تأیید'],
            'reset_password' => ['en' => 'Reset Password', 'fa' => 'بازنشانی رمز عبور'],
            'reset_password_action' => ['en' => 'Reset Password', 'fa' => 'بازنشانی رمز عبور'],
            'email_verification' => ['en' => 'Email Verification', 'fa' => 'تأیید ایمیل'],
            'verify_email_description' => [
                'en' => 'Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.',
                'fa' => 'با تشکر از ثبت‌نام شما! لطفاً پیش از شروع، ایمیل خود را با کلیک روی لینکی که برایتان ارسال شده است، تأیید کنید. اگر ایمیل را دریافت نکرده‌اید، خوشحال می‌شویم یک ایمیل دیگر برایتان ارسال کنیم.'
            ],
            'verification_link_sent' => [
                'en' => 'A new verification link has been sent to the email address you provided during registration.',
                'fa' => 'لینک تأیید جدید به ایمیل شما ارسال شد.'
            ],
            'resend_verification_email' => ['en' => 'Resend Verification Email', 'fa' => 'ارسال مجدد ایمیل تأیید'],
            'log_out' => ['en' => 'Log Out', 'fa' => 'خروج'],
            
            // Chat
            'chat_with_user' => ['en' => 'Chat with {{name}}', 'fa' => 'چت با {{name}}'],
            'chat' => ['en' => 'Chat', 'fa' => 'چت'],
            'typing' => ['en' => 'Typing...', 'fa' => 'در حال تایپ...'],
            'pick_emoji' => ['en' => 'Pick emoji', 'fa' => 'انتخاب ایموجی'],
            'type_message_placeholder' => ['en' => 'Type a message...', 'fa' => 'پیامی بنویسید...'],
            'start_recording' => ['en' => 'Start recording', 'fa' => 'شروع ضبط'],
            'stop_recording' => ['en' => 'Stop recording', 'fa' => 'توقف ضبط'],
            'attach_file' => ['en' => 'Attach file', 'fa' => 'پیوست فایل'],
            'send' => ['en' => 'Send', 'fa' => 'ارسال'],
            'seen' => ['en' => 'Seen', 'fa' => 'دیده شده'],
            'edit_message' => ['en' => 'Edit', 'fa' => 'ویرایش پیام'],
            'delete_message' => ['en' => 'Delete', 'fa' => 'حذف پیام'],
            'message_deleted' => ['en' => '(deleted)', 'fa' => '(حذف شده)'],
            'message_edited' => ['en' => '(edited)', 'fa' => '(ویرایش شده)'],
            'delete_message_confirm' => ['en' => 'Delete this message?', 'fa' => 'آیا می‌خواهید این پیام را حذف کنید؟'],
            'edit_message_prompt' => ['en' => 'Edit your message:', 'fa' => 'پیام خود را ویرایش کنید:'],
            'group_chat' => ['en' => 'Group Chat: {{room_name}}', 'fa' => 'گفتگوی گروهی: {{room_name}}'],
            'your_chats' => ['en' => '💬 Your Chats', 'fa' => '💬 گفتگوهای شما'],
            'search_by_name_or_email' => ['en' => 'Search by name or email...', 'fa' => 'جستجو بر اساس نام یا ایمیل...'],
            'search_place_placeholder' => ['en' => 'Search place...', 'fa' => 'جستجوی مکان...'],
            'go' => ['en' => 'Go', 'fa' => 'برو'],
            'no_results_found' => ['en' => 'No results found.', 'fa' => 'نتیجه‌ای یافت نشد.'],
            'sent_a_file_or_no_message' => ['en' => '📎 Sent a file or no messages yet', 'fa' => '📎 فایلی ارسال شده یا پیامی موجود نیست'],
            'place_not_found' => ['en' => '❌ Place not found or no chat exists for it.', 'fa' => '❌ مکان پیدا نشد یا گفتگویی برای آن وجود ندارد.'],
            'error_occurred' => ['en' => '⚠️ An error occurred. Try again.', 'fa' => '⚠️ خطایی رخ داده است. لطفاً دوباره تلاش کنید.'],
            
            // Posts
            'create_new_post' => ['en' => 'Create New Post', 'fa' => 'ایجاد پست جدید'],
            'create_a_new_post' => ['en' => 'Create a New Post', 'fa' => 'ایجاد یک پست جدید'],
            'edit_post' => ['en' => 'Edit Post', 'fa' => 'ویرایش پست'],
            'edit_your_post_placeholder' => ['en' => 'Edit your post...', 'fa' => 'پست خود را ویرایش کنید...'],
            'save_changes' => ['en' => 'Save Changes', 'fa' => 'ذخیره تغییرات'],
            'no_posts_found_with_hashtag' => ['en' => 'No posts found with this hashtag.', 'fa' => 'هیچ پستی با این هشتگ یافت نشد.'],
            'load_more' => ['en' => 'Load more', 'fa' => 'بارگذاری بیشتر'],
            'my_posts' => ['en' => 'My Posts', 'fa' => 'پست‌های من'],
            'new_post' => ['en' => '➕ New Post', 'fa' => '➕ پست جدید'],
            'no_posts_created' => ['en' => 'You haven\'t created any posts yet.', 'fa' => 'هنوز پستی ایجاد نکرده‌اید.'],
            'show_post' => ['en' => 'Show', 'fa' => 'نمایش پست'],
            'related_posts' => ['en' => 'Related Posts', 'fa' => 'پست‌های مرتبط'],
            
            // Profile
            'profile_info' => ['en' => 'Profile Info', 'fa' => 'اطلاعات پروفایل'],
            'profile_image' => ['en' => 'Profile Image', 'fa' => 'تصویر پروفایل'],
            'links' => ['en' => 'Links', 'fa' => 'لینک‌ها'],
            'notifications' => ['en' => 'Notifications', 'fa' => 'اعلان‌ها'],
            'delete_account' => ['en' => 'Delete Account', 'fa' => 'حذف حساب'],
            'edit_profile' => ['en' => 'Edit Profile', 'fa' => 'ویرایش پروفایل'],
            'profile' => ['en' => 'Profile', 'fa' => 'پروفایل'],
            'change_cover' => ['en' => 'Change Cover', 'fa' => 'تغییر کاور'],
            'add_cover' => ['en' => 'Add Cover', 'fa' => 'افزودن کاور'],
            'delete' => ['en' => 'Delete', 'fa' => 'حذف'],
            'change_avatar' => ['en' => 'Change Avatar', 'fa' => 'تغییر آواتار'],
            'add_avatar' => ['en' => 'Add Avatar', 'fa' => 'افزودن آواتار'],
            'delete_image_confirm' => ['en' => 'Delete image?', 'fa' => 'آیا مطمئن هستید که می‌خواهید تصویر را حذف کنید؟'],
            'uploading_image' => ['en' => 'Uploading...', 'fa' => 'در حال بارگذاری تصویر...'],
            'save_image' => ['en' => 'Save Image', 'fa' => 'ذخیره تصویر'],
            'cancel' => ['en' => 'Cancel', 'fa' => 'لغو'],
            'uploading_please_wait' => ['en' => 'Uploading image, please wait...', 'fa' => 'در حال بارگذاری تصویر، لطفاً صبر کنید...'],
            'message' => ['en' => 'Message', 'fa' => 'پیام'],
            'Made_with' => ['en' => 'Made with', 'fa' => 'ساخته شده با'],
            'by' => ['en' => 'by', 'fa' => 'توسط'],
            'statistics' => ['en' => 'Statistics', 'fa' => 'آمار'],
            'delete_account_info' => [
                'en' => 'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
                'fa' => 'پس از حذف حساب کاربری، تمام منابع و داده‌های شما به طور دائمی حذف خواهند شد. لطفاً قبل از حذف، اطلاعات مورد نیاز خود را دانلود کنید.'
            ],
            'confirm_delete_account' => [
                'en' => 'Are you sure you want to delete your account?', 
                'fa' => 'آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟'
            ],
            'confirm_delete_account_info' => [
                'en' => 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
                'fa' => 'لطفاً برای تأیید حذف دائمی حساب خود، رمز عبورتان را وارد کنید.'
            ],
            'disable_email_notifications' => [
                'en' => 'Disable email notifications', 
                'fa' => 'غیرفعال کردن اعلان‌های ایمیل'
            ],
            'current_avatar' => ['en' => 'Current Avatar', 'fa' => 'آواتار فعلی'],
            'delete_avatar' => ['en' => 'Delete Avatar', 'fa' => 'حذف آواتار'],
            'upload_avatar' => ['en' => 'Upload Avatar', 'fa' => 'آپلود آواتار'],
            'drag_drop_avatar' => [
                'en' => 'Drag & Drop avatar here or click to upload', 
                'fa' => 'آواتار را بکشید و رها کنید یا کلیک کنید تا آپلود شود'
            ],
            'current_cover' => ['en' => 'Current Cover', 'fa' => 'کاور فعلی'],
            'delete_cover' => ['en' => 'Delete Cover', 'fa' => 'حذف کاور'],
            'upload_cover' => ['en' => 'Upload Cover', 'fa' => 'آپلود کاور'],
            'drag_drop_cover' => [
                'en' => 'Drag & Drop cover here or click to upload', 
                'fa' => 'کاور را بکشید و رها کنید یا کلیک کنید تا آپلود شود'
            ],
            'confirm_delete_image' => [
                'en' => 'Are you sure you want to delete the {{type}}?', 
                'fa' => 'آیا مطمئن هستید که می‌خواهید {{type}} را حذف کنید؟'
            ],
            'update_password' => ['en' => 'Update Password', 'fa' => 'بروزرسانی رمز عبور'],
            'ensure_account_secure' => [
                'en' => 'Ensure your account is using a long, random password to stay secure.',
                'fa' => 'برای امنیت بیشتر از یک رمز عبور طولانی و تصادفی استفاده کنید.'
            ],
            'current_password' => ['en' => 'Current Password', 'fa' => 'رمز عبور فعلی'],
            'new_password' => ['en' => 'New Password', 'fa' => 'رمز عبور جدید'],
            'profile_information' => ['en' => 'Profile Information', 'fa' => 'اطلاعات پروفایل'],
            'update_profile_info' => [
                'en' => 'Update your account\'s profile information and email address.',
                'fa' => 'به‌روزرسانی اطلاعات پروفایل و ایمیل شما'
            ],
            'username' => ['en' => 'Username', 'fa' => 'نام کاربری'],
            'checking_username' => [
                'en' => 'Checking username availability...', 
                'fa' => 'در حال بررسی دسترسی نام کاربری...'
            ],
            'username_available' => ['en' => 'Username is available.', 'fa' => 'نام کاربری در دسترس است.'],
            'username_not_available' => [
                'en' => 'This username is not available.', 
                'fa' => 'این نام کاربری موجود نیست.'
            ],
            'email_unverified' => [
                'en' => 'Your email address is unverified.', 
                'fa' => 'آدرس ایمیل شما تأیید نشده است.'
            ],
            'resend_verification' => [
                'en' => 'Click here to re-send the verification email.', 
                'fa' => 'برای ارسال مجدد ایمیل تأیید کلیک کنید.'
            ],
            'verification_sent' => [
                'en' => 'A new verification link has been sent to your email address.',
                'fa' => 'ایمیل تأیید جدید ارسال شد.'
            ],
            'profile_links_information' => [
                'en' => 'Profile Links Information', 
                'fa' => 'اطلاعات لینک‌های پروفایل'
            ],
            'update_social_network_info' => [
                'en' => 'Update your social network information.',
                'fa' => 'به‌روزرسانی اطلاعات شبکه‌های اجتماعی'
            ],
            'bio' => ['en' => 'Bio', 'fa' => 'بیوگرافی'],
            'location' => ['en' => 'Location', 'fa' => 'مکان'],
            'website' => ['en' => 'Website', 'fa' => 'وب‌سایت'],
            'phone' => ['en' => 'Phone', 'fa' => 'شماره تلفن'],
            'instagram' => ['en' => 'Instagram', 'fa' => 'اینستاگرام'],
            'twitter' => ['en' => 'Twitter', 'fa' => 'توییتر'],
            'facebook' => ['en' => 'Facebook', 'fa' => 'فیسبوک'],
            'linkedin' => ['en' => 'LinkedIn', 'fa' => 'لینکدین'],
            'github' => ['en' => 'GitHub', 'fa' => 'گیت‌هاب'],
            'tiktok' => ['en' => 'TikTok', 'fa' => 'تیک‌تاک'],
            'snapchat' => ['en' => 'Snapchat', 'fa' => 'اسنپ‌چت'],
            'youtube' => ['en' => 'YouTube', 'fa' => 'یوتیوب'],
            'pinterest' => ['en' => 'Pinterest', 'fa' => 'پینترست'],
            'whatsapp' => ['en' => 'WhatsApp', 'fa' => 'واتساپ'],
            'telegram' => ['en' => 'Telegram', 'fa' => 'تلگرام'],
            
            // Users
            'users' => ['en' => 'Users', 'fa' => 'کاربران'],
            'search_by_name_or_username' => [
                'en' => 'Search by name or username...', 
                'fa' => 'جستجو بر اساس نام یا نام کاربری...'
            ],
            'no_users_found' => ['en' => 'No users found', 'fa' => 'کاربری یافت نشد'],
            'follow' => ['en' => 'Follow', 'fa' => 'دنبال کردن'],
            'unfollow' => ['en' => 'Unfollow', 'fa' => 'لغو دنبال'],
            'message' => ['en' => 'Message', 'fa' => 'پیام'],
            
            // Dashboard
            'dashboard' => ['en' => 'Dashboard', 'fa' => 'داشبورد'],
            'suggested_users_to_follow' => [
                'en' => 'Suggested Users to Follow', 
                'fa' => 'کاربران پیشنهادی برای دنبال کردن'
            ],
            'posts_from_followed_users' => [
                'en' => 'Posts from Followed Users', 
                'fa' => 'پست‌های کاربران دنبال شده'
            ],
            'no_posts_to_display' => [
                'en' => 'There are no posts to display.', 
                'fa' => 'هیچ پستی برای نمایش وجود ندارد.'
            ],
            'AdminPanel' => ['en' => 'Admin Panel', 'fa' => 'پنل مدیریت'],
            'YourProfile' => ['en' => 'Your Profile', 'fa' => 'پروفایل شما'],
            'posts' => ['en' => 'Posts', 'fa' => 'پست‌ها'],
            'chat' => ['en' => 'Chats', 'fa' => 'چت‌ها'],
            'pages' => ['en' => 'Pages', 'fa' => 'صفحات'],
            'create_page' => ['en' => 'Create Page', 'fa' => 'ایجاد صفحه'],
            'page_name' => ['en' => 'Page Name', 'fa' => 'نام صفحه'],
            'page_category' => ['en' => 'Page Category', 'fa' => 'دسته‌بندی صفحه'],
            'bio' => ['en' => 'Bio', 'fa' => 'بیوگرافی'],
            'no_pages_found' => ['en' => 'No pages found', 'fa' => 'هیچ صفحه‌ای پیدا نشد'],
            'search' => ['en' => 'Search', 'fa' => 'جستجو'],
            'website' => ['en' => 'Website', 'fa' => 'وب‌سایت'],
            'phone_number' => ['en' => 'Phone Number', 'fa' => 'شماره تماس'],
            'public_email' => ['en' => 'Public Email', 'fa' => 'ایمیل عمومی'],
            'location' => ['en' => 'Location', 'fa' => 'مکان'],
            'categories' => ['en' => 'Categories', 'fa' => 'دسته‌بندی‌ها'],
            'select_category' => ['en' => 'Select Category', 'fa' => 'انتخاب دسته‌بندی'],
            'like' => ['en' => 'Like', 'fa' => 'پسندیدن'],
            'unlike' => ['en' => 'Unlike', 'fa' => 'لغو پسند'],
            'edit_page' => ['en' => 'Edit Page', 'fa' => 'ویرایش صفحه'],
            'update' => ['en' => 'Update', 'fa' => 'به‌روزرسانی'],
            'No notifications available' => [
                'en' => 'No notifications available',
                'fa' => 'هیچ اعلانی موجود نیست'
            ],
            
            // Comments
            'Edit' => ['en' => 'Edit', 'fa' => 'ویرایش'],
            'Delete' => ['en' => 'Delete', 'fa' => 'حذف'],
            'Write your comment...' => ['en' => 'Write your comment...', 'fa' => 'دیدگاه خود را بنویسید...'],
            'Submitting...' => ['en' => 'Submitting...', 'fa' => 'در حال ارسال...'],
            'Submit Comment' => ['en' => 'Submit Comment', 'fa' => 'ارسال دیدگاه'],
            'Loading...' => ['en' => 'Loading...', 'fa' => 'در حال بارگذاری...'],
            'Load more comments' => ['en' => 'Load more comments', 'fa' => 'بارگذاری دیدگاه‌های بیشتر'],
            'You must be logged in to submit a comment.' => [
                'en' => 'You must be logged in to submit a comment.', 
                'fa' => 'برای ارسال دیدگاه باید وارد شوید.'
            ],
            'Error while submitting comment.' => [
                'en' => 'Error while submitting comment.', 
                'fa' => 'خطا هنگام ارسال دیدگاه.'
            ],
            'Are you sure you want to delete this comment?' => [
                'en' => 'Are you sure you want to delete this comment?', 
                'fa' => 'آیا مطمئن هستید که می‌خواهید این دیدگاه را حذف کنید؟'
            ],
            'Failed to like or dislike. Please try again.' => [
                'en' => 'Failed to like or dislike. Please try again.', 
                'fa' => 'خطا در پسندیدن یا نپسندیدن. لطفاً دوباره تلاش کنید.'
            ],
            'This post has been removed due to reporting abuse.' => [
                'en' => 'This post has been removed due to reporting abuse.', 
                'fa' => 'این پست به دلیل گزارش سوءاستفاده حذف شده است.'
            ],
            'This post has been removed due to a violation report.' => [
                'en' => 'This post has been removed due to a violation report.', 
                'fa' => 'این پست به دلیل گزارش تخلف حذف شده است.'
            ],
            'Are you sure you want to delete this post?' => [
                'en' => 'Are you sure you want to delete this post?', 
                'fa' => 'آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟'
            ],
            'Incorrect captcha!' => ['en' => 'Incorrect captcha!', 'fa' => 'کپچا اشتباه است!'],
            'views' => ['en' => 'views', 'fa' => 'بازدیدها'],
            'Reposted from' => ['en' => 'Reposted from', 'fa' => 'بازنشر از'],
            'Deleted User' => ['en' => 'Deleted User', 'fa' => 'کاربر حذف شده'],
            'Report' => ['en' => 'Report', 'fa' => 'گزارش'],
            'Report Post' => ['en' => 'Report Post', 'fa' => 'گزارش پست'],
            'Describe the issue clearly...' => [
                'en' => 'Describe the issue clearly...', 
                'fa' => 'مشکل را به طور واضح شرح دهید...'
            ],
            'Please solve: 3 + 4 =' => ['en' => 'Please solve: 3 + 4 =', 'fa' => 'لطفاً حل کنید: ۳ + ۴ ='],
            'Submit' => ['en' => 'Submit', 'fa' => 'ارسال'],
            
            // Statistics
            'daily_views' => ['en' => 'Daily Views', 'fa' => 'بازدیدهای روزانه'],
            'monthly_views' => ['en' => 'Monthly Views', 'fa' => 'بازدیدهای ماهانه'],
            'yearly_views' => ['en' => 'Yearly Views', 'fa' => 'بازدیدهای سالانه'],
            'total_views' => ['en' => 'Total Views', 'fa' => 'مجموع بازدیدها'],
            

            'dashboard' => ['en' => 'Dashboard', 'fa' => 'داشبورد'],
            'followed_users' => ['en' => 'Followed Users', 'fa' => 'کاربران دنبال‌شده'],
            'explorer' => ['en' => 'Explorer', 'fa' => 'اکسپلور'],
            'load_more' => ['en' => 'Load More', 'fa' => 'بارگذاری بیشتر'],
            'no_posts_to_display' => ['en' => 'No posts to display', 'fa' => 'پستی برای نمایش وجود ندارد'],
            'no_followed_posts' => ['en' => 'No posts from followed users yet.', 'fa' => 'هنوز پستی از کاربران دنبال‌شده وجود ندارد.'],
            'no_explorer_posts' => ['en' => 'No posts available to explore.', 'fa' => 'پستی برای اکسپلور وجود ندارد.'],
            'suggested_users_to_follow' => ['en' => 'Suggested Users to Follow', 'fa' => 'کاربران پیشنهادی برای دنبال‌کردن'],
            'follow' => ['en' => 'Follow', 'fa' => 'دنبال‌کردن'],
            'loading' => ['en' => 'Loading', 'fa' => 'در حال بارگذاری'],
            'back_to_top' => ['en' => 'Back to Top', 'fa' => 'بازگشت به بالا'],
            'retry' => ['en' => 'Retry', 'fa' => 'تلاش مجدد'],
            'blocked_users' => ['en' => 'Blocked Users', 'fa' => 'کاربران مسدود شده'],
            'block' => ['en' => 'Block', 'fa' => 'مسدود کردن'],
            'unblock' => ['en' => 'Unblock', 'fa' => 'رفع مسدودی'],
            'no_blocked_users' => ['en' => 'No blocked users', 'fa' => 'کاربر مسدودی وجود ندارد'],
            'you_blocked_this_user' => ['en' => 'You have blocked this user.', 'fa' => 'شما این کاربر را مسدود کرده‌اید.'],
            'user_has_blocked_you' => ['en' => 'This user has blocked you.', 'fa' => 'این کاربر شما را مسدود کرده است.'],

        ];

        foreach ($translations as $key => $values) {
            foreach ($values as $locale => $value) {
                // Get language_id based on locale (assuming 1=en, 2=fa)
                $language_id = $locale === 'en' ? 1 : 2;
                
                Translation::updateOrCreate(
                    [
                        'language_id' => $language_id,
                        'key' => $key,
                    ],
                    [
                        'value' => $value,
                    ]
                );
            }
        }
    }
}
