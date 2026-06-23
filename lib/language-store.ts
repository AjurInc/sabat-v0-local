'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fa';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.services': 'Services',
    'nav.how_it_works': 'How It Works',
    'nav.industries': 'Industries',
    'nav.about': 'About SABAT',
    'nav.faq': 'FAQ',
    'nav.sign_in': 'Sign In',
    'nav.sign_up': 'Sign Up',
    'nav.book_consultation': 'Book Consultation',
    'hero.tagline': 'Professional Corporate Travel Management',
    'hero.title': 'Your Global Partner in Corporate Travel',
    'hero.description': 'SABAT helps organizations coordinate accommodation, executive hospitality, transfers, and business travel operations through one trusted partner.',
    'metrics.title': 'Enterprise Trust Metrics',
    'metrics.partners': 'Organization Partners',
    'metrics.satisfaction': 'Service Satisfaction',
    'metrics.hotels': 'Hotel Partners',
    'metrics.cities': 'Cities Covered',
    'services.title': 'Our Services',
    'services.accommodation': 'Accommodation Coordination',
    'services.accommodation_desc': 'Manage corporate housing and temporary accommodations globally',
    'services.hospitality': 'Executive Hospitality',
    'services.hospitality_desc': 'Premium guest services and executive reception management',
    'services.transfers': 'Ground Transportation',
    'services.transfers_desc': 'Seamless airport pickups and business travel logistics',
    'services.operations': 'Travel Operations',
    'services.operations_desc': 'End-to-end business travel management and support',
    'contact.schedule': 'Schedule a Meeting',
    'contact.title': 'Get Started',
    'footer.copyright': '2026 SABAT - Professional Corporate Travel Management. All rights reserved.',
  },
  fa: {
    'nav.services': 'خدمات',
    'nav.how_it_works': 'نحوه کار',
    'nav.industries': 'صنایع',
    'nav.about': 'درباره SABAT',
    'nav.faq': 'سوالات متداول',
    'nav.sign_in': 'ورود',
    'nav.sign_up': 'ثبت نام',
    'nav.book_consultation': 'رزرو مشاوره',
    'hero.tagline': 'مدیریت حرفه‌ای سفرهای کسب‌وکار',
    'hero.title': 'شریک جهانی شما در سفرهای کسب‌وکار',
    'hero.description': 'SABAT به سازمان‌ها کمک می‌کند تا مسکن، میزبانی مدیران، انتقال و عملیات سفرهای تجاری را از طریق یک شریک قابل اعتماد هماهنگ کنند.',
    'metrics.title': 'معیارهای اعتماد سازمانی',
    'metrics.partners': 'شرکای سازمانی',
    'metrics.satisfaction': 'رضایت خدمات',
    'metrics.hotels': 'شرکای هتلی',
    'metrics.cities': 'شهرهای پوشش‌داده‌شده',
    'services.title': 'خدمات ما',
    'services.accommodation': 'هماهنگی مسکن',
    'services.accommodation_desc': 'مدیریت مسکن کسب‌وکار و اقامت موقت در سراسر جهان',
    'services.hospitality': 'میزبانی مدیران',
    'services.hospitality_desc': 'خدمات مهمان فاخر و مدیریت استقبال امرا',
    'services.transfers': 'حمل‌ونقل زمینی',
    'services.transfers_desc': 'خدمات پیک‌آپ فرودگاه و لجستیک سفرهای تجاری',
    'services.operations': 'عملیات سفر',
    'services.operations_desc': 'مدیریت جامع سفرهای تجاری و پشتیبانی ۲۴/۷',
    'contact.schedule': 'رزرو ملاقات',
    'contact.title': 'شروع کنید',
    'footer.copyright': '2026 SABAT - مدیریت حرفه‌ای سفرهای کسب‌وکار. تمامی حقوق محفوظ است.',
  },
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => {
        const lang = get().language;
        return translations[lang][key as keyof typeof translations['en']] || key;
      },
    }),
    {
      name: 'language-store',
    }
  )
);
