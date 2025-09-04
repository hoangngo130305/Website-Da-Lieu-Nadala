import { Button } from "./ui/button";
import { Calendar, Star, Shield, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

interface HeroProps {
  onNavigate: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-secondary to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                {t('home.hero.title').split(' – ').map((part, index, array) => (
                  <span key={index}>
                    {index === 0 ? part : (
                      <span className="text-primary block mt-2">
                        {part}
                      </span>
                    )}
                    {index === 0 && array.length > 1 && ' – '}
                  </span>
                ))}
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                {t('home.hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-6 lg:px-8"
                onClick={() => onNavigate("booking")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t('home.hero.cta')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-6 lg:px-8"
                onClick={() => onNavigate("services")}
              >
                {t('common.learn_more')}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.team.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  Đội ngũ bác sĩ da liễu giàu kinh nghiệm
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.facilities.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  Trang thiết bị y tế tiên tiến nhất
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('common.working_hours')}
                </h3>
                <p className="text-sm text-gray-600">
                  Hỗ trợ khách hàng mọi lúc mọi nơi
                </p>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative order-first lg:order-last">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Phòng khám da liễu Nadala"
                className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-2xl shadow-xl"
              />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-lg p-4 sm:p-6 z-20 w-auto max-w-[280px] sm:max-w-none">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    10k+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {t('home.stats.customers').replace('Khách hàng hài lòng', 'Khách hàng')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Hài lòng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    15+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {t('home.stats.experience')}
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-4 right-4 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 bg-primary/5 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-accent/50 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}