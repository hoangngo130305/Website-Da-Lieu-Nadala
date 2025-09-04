"use client";
import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";
// import nadalaLogo from "../assets/nadala-logo.png"; // Adjust the path as necessary
{
  /* ❌ Xoá dòng import "next/image" */
}

{
  /* ✅ Dùng img thường */
}
{/* <img
  src="/img/Nadala.png"
  alt="Nadala Beauty Clinic Log"
  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-primary/20 shadow-lg"
  width={64}
  height={64}
/>; */}

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navigationItems = [
    { id: "home", label: t("nav.home") },
    { id: "about", label: t("nav.about") },
    { id: "services", label: t("nav.services") },
    { id: "products", label: t("nav.products") },
    { id: "booking", label: t("nav.booking") },
    { id: "reviews", label: t("nav.reviews") },
    { id: "contact", label: t("nav.contact") },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-primary/10 sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-primary text-primary-foreground py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                0909 544 229 – 0916 954 699
              </span>
              <span className="sm:hidden">0909 544 229</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">
                31 Hà Thị Đát, Tân Sơn Nhì, TP.HCM
              </span>
            </div>
          </div>
          <div className="hidden lg:block">
            <span>{t("contact.hours")}</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 py-2">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1"
          >
            <img
              src="/img/Nadala.png"
              alt="Nadala Beauty Clinic Logo"
              width={64}
              height={64}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-primary/20 shadow-lg"
            />

            <div className="flex flex-col text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                NADALA
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                Dermatology Clinic
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <div className="flex space-x-4 xl:space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-sm xl:text-base transition-colors hover:text-primary whitespace-nowrap ${
                    activeSection === item.id
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <LanguageToggle />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-primary/10 shadow-lg">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 text-sm sm:text-base transition-colors hover:text-primary hover:bg-primary/5 w-full text-left rounded-lg ${
                  activeSection === item.id
                    ? "text-primary font-medium bg-primary/10"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
