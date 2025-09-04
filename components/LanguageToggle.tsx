import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language } from "../contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const languages: Array<{
    code: Language;
    flag: string;
    name: string;
  }> = [
    { code: 'vi', flag: '🇻🇳', name: t('lang.vi') },
    { code: 'en', flag: '🇺🇸', name: t('lang.en') },
    { code: 'zh', flag: '🇨🇳', name: t('lang.zh') },
    { code: 'ja', flag: '🇯🇵', name: t('lang.ja') },
    { code: 'ko', flag: '🇰🇷', name: t('lang.ko') },
    { code: 'th', flag: '🇹🇭', name: t('lang.th') },
    { code: 'fr', flag: '🇫🇷', name: t('lang.fr') },
    { code: 'es', flag: '🇪🇸', name: t('lang.es') },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 min-w-[80px] justify-start">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:flex items-center gap-1">
            <span>{currentLanguage?.flag}</span>
            <span className="uppercase text-xs">{language}</span>
          </span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}