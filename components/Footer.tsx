import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SocialShare } from "./SocialShare";
import { useLanguage } from "../contexts/LanguageContext";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  MessageCircle,
  Heart
} from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  const services = [
    t('services.acne.title'),
    t('services.facial.title'),
    t('services.melasma.title'),
    "Tiêm filler, Botox",
    t('services.laser.title'),
    "Chăm sóc da body"
  ];

  const quickLinks = [
    { label: t('nav.home'), id: "home" },
    { label: t('nav.about'), id: "about" },
    { label: t('nav.services'), id: "services" },
    { label: t('nav.products'), id: "products" },
    { label: t('nav.booking'), id: "booking" },
    { label: t('nav.contact'), id: "contact" }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('common.success') + "! Cảm ơn bạn đã quan tâm đến Nadala.");
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2 xl:col-span-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">NADALA</h3>
              <p className="text-gray-400 text-sm">Dermatology Clinic</p>
              <p className="text-primary text-sm font-medium mt-1">
                "{t('home.hero.title')}"
              </p>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('home.hero.description')}
            </p>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs sm:text-sm">
                  31 Hà Thị Đát, Tân Sơn Nhì, TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">0909 544 229 – 0916 954 699</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-xs sm:text-sm break-all">nadalabeauty2025.vn@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">{t('contact.hours')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">{t('footer.about')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-300 hover:text-primary transition-colors text-xs sm:text-sm block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">{t('footer.services')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-300 hover:text-primary transition-colors text-xs sm:text-sm block text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">{t('footer.contact')}</h4>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
              {t('footer.newsletter')}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <Input
                type="email"
                placeholder={t('form.email')}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm"
                required
              />
              <Button type="submit" className="w-full text-sm">
                {t('form.submit')}
              </Button>
            </form>

            <div>
              <h5 className="font-medium mb-3 sm:mb-4 text-sm">{t('social.share')} & {t('footer.follow')}</h5>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">{t('footer.share_website')}</p>
                  <SocialShare />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">{t('footer.follow')}:</p>
                  <div className="flex gap-2 sm:gap-3">
                    <Button size="sm" variant="outline" className="p-1.5 sm:p-2 border-gray-700 hover:bg-primary hover:border-primary">
                      <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-1.5 sm:p-2 border-gray-700 hover:bg-primary hover:border-primary">
                      <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-1.5 sm:p-2 border-gray-700 hover:bg-primary hover:border-primary">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <span className="text-center sm:text-left">{t('footer.copyright')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <span>{t('footer.made_with')}</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
              <span>{t('footer.for_skin')}</span>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-gray-500">
              <button className="hover:text-primary transition-colors">
                {t('footer.privacy')}
              </button>
              <button className="hover:text-primary transition-colors">
                {t('footer.terms')}
              </button>
              <button className="hover:text-primary transition-colors">
                {t('footer.refund')}
              </button>
              <button className="hover:text-primary transition-colors">
                {t('footer.faq')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}