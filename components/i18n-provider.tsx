'use client';

import { useEffect, ReactNode } from 'react';
import i18n from '@/lib/i18n';

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize i18n on client side only
    if (!i18n.isInitialized) {
      i18n.init({
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
      });
    }

    // Get saved language or browser preference
    const savedLang = localStorage.getItem('language') || i18n.language || 'en';
    i18n.changeLanguage(savedLang);

    // Update HTML lang attribute only (keep header LTR always)
    const htmlElement = document.documentElement;
    htmlElement.lang = savedLang;
    htmlElement.dir = 'ltr'; // Keep header LTR always
    
    // Apply RTL to body for content direction
    const bodyElement = document.body;
    bodyElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
    bodyElement.className = savedLang === 'fa' ? bodyElement.className + ' font-persian' : bodyElement.className.replace(' font-persian', '');

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      localStorage.setItem('language', lng);
      htmlElement.lang = lng;
      htmlElement.dir = 'ltr'; // Keep header LTR always
      
      // Apply RTL to body for content
      const bodyElement = document.body;
      bodyElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
      bodyElement.className = lng === 'fa' ? bodyElement.className + ' font-persian' : bodyElement.className.replace(' font-persian', '');
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <>{children}</>;
}
