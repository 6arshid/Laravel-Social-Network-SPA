import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

// لود پویا از سرور
i18n
  .use(HttpApi) // اضافه کردن backend
  .use(initReactI18next) // اتصال به ری‌اکت
  .init({
    lng: document.documentElement.lang || 'en', // زبان پیشفرض از html یا 'en'
    fallbackLng: 'en', // اگر ترجمه نبود بره سراغ انگلیسی
    debug: false, // اگر بخوای لاگ‌ها رو ببینی true کن

    interpolation: {
      escapeValue: false, // چون ری‌اکت خودش escape میکنه نیازی نیست
    },

    backend: {
      // آدرس برای دریافت ترجمه هر زبان
      loadPath: '/get-translations/{{lng}}',
    },

    react: {
      useSuspense: false, // جلوگیری از لودینگ اضافه (اگر خواستی میتونی true بزاری)
    },
  });

export default i18n;
