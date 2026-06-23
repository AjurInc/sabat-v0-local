'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 bg-background/50 rounded-full p-1 border border-foreground/10">
      <Button
        variant={i18n.language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        className="h-8 px-3 text-xs font-medium rounded-full"
      >
        EN
      </Button>
      <Button
        variant={i18n.language === 'fa' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleLanguageChange('fa')}
        className="h-8 px-3 text-xs font-medium rounded-full"
      >
        فا
      </Button>
    </div>
  );
}
