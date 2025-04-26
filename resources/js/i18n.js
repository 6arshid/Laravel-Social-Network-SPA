import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ترجمه‌ها رو اینجا میاریم
const resources = {
    en: {
        translation: {
            welcome: "Welcome to our site!",
            login: "Login",
            register: "Register",
        }
    },
    fa: {
        translation: {
            welcome: "به سایت ما خوش آمدید!",
            login: "ورود",
            register: "ثبت نام",
        }
    },
    da: {
        translation: {
            welcome: "Velkommen til vores side!",
            login: "Log ind",
            register: "Tilmeld",
        }
    },
    tr: {
        translation: {
            welcome: "Sitemize hoş geldiniz!",
            login: "Giriş yap",
            register: "Kayıt ol",
        }
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: document.documentElement.lang || 'en', // از تگ <html lang="..."> بگیره
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
