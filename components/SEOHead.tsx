import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({
  title = 'Nadala Dermatology Clinic - Phòng khám da liễu chuyên nghiệp',
  description = 'Phòng khám da liễu Nadala với 15 năm kinh nghiệm, chuyên điều trị mụn, nám, chăm sóc da chuyên nghiệp tại TP.HCM. Đặt lịch online 24/7.',
  keywords = 'phòng khám da liễu, điều trị mụn, chăm sóc da, nám da, TPHCM, dermatology, skincare',
  image = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80&w=1200',
  url = window.location.href,
  type = 'website'
}: SEOHeadProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update meta tag
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Nadala Dermatology Clinic');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', language);

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', 'Nadala Dermatology Clinic');
    updateMetaTag('og:locale', language === 'vi' ? 'vi_VN' : 'en_US');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Schema.org structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "name": "Nadala Dermatology Clinic",
      "description": description,
      "url": url,
      "image": image,
      "telephone": "+84909544229",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "31 Hà Thị Đát",
        "addressLocality": "Tân Sơn Nhì",
        "addressRegion": "TP.HCM",
        "addressCountry": "VN"
      },
      "openingHours": "Mo-Su 08:00-20:00",
      "medicalSpecialty": "Dermatology",
      "priceRange": "$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    };

// Update or create structured data script
let structuredDataScript = document.querySelector<HTMLScriptElement>(
  'script[type="application/ld+json"]'
);

if (!structuredDataScript) {
  structuredDataScript = document.createElement("script");
  structuredDataScript.type = "application/ld+json";
  document.head.appendChild(structuredDataScript);
}

structuredDataScript.textContent = JSON.stringify(structuredData);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

  }, [title, description, keywords, image, url, type, language]);

  return null; // This component doesn't render anything
}