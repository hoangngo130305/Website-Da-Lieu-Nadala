"use client";

import { useState } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Header } from "../components/Header";
import { Home } from "../components/Home";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Products } from "../components/Products";
import { Booking } from "../components/Booking";
import { Reviews } from "../components/Reviews";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { SEOHead } from "../components/SEOHead";
import { LoginModal } from "../components/LoginModal";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const handleNavigate = (section: string) => {
    const normalizedSection = section.toLowerCase();
    console.log("handleNavigate called:", {
      section: normalizedSection,
      tokenExists: !!token,
      isLoginOpen,
      localStorageToken: localStorage.getItem("access_token"),
    });
    if (["products", "booking"].includes(normalizedSection) && !token) {
      console.log(
        "No token, opening login modal, setting pendingSection:",
        normalizedSection
      );
      setPendingSection(normalizedSection);
      setIsLoginOpen(true);
    } else {
      console.log(
        "Token exists or section not restricted, navigating to:",
        normalizedSection
      );
      setActiveSection(normalizedSection);
      setPendingSection(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLoginSuccess = (access: string, refresh: string) => {
    console.log("Login success, setting tokens:", {
      access,
      refresh,
      pendingSection,
    });
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setIsLoginOpen(false);
    if (pendingSection) {
      console.log("Navigating to pendingSection:", pendingSection);
      setActiveSection(pendingSection);
      setPendingSection(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.log("No pendingSection, navigating to home");
      setActiveSection("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getSEOContent = () => {
    switch (activeSection) {
      case "home":
        return {
          title:
            "Nadala Dermatology Clinic - Phòng khám da liễu chuyên nghiệp TP.HCM",
          description:
            "Phòng khám da liễu Nadala với 15 năm kinh nghiệm, chuyên điều trị mụn, nám, chăm sóc da chuyên nghiệp tại TP.HCM. Đặt lịch online 24/7.",
          keywords:
            "phòng khám da liễu, điều trị mụn, chăm sóc da, nám da, TPHCM, dermatology, skincare",
        };
      case "about":
        return {
          title: "Giới thiệu - Nadala Dermatology Clinic",
          description:
            "Tìm hiểu về phòng khám da liễu Nadala - 15 năm kinh nghiệm, đội ngũ bác sĩ chuyên khoa, công nghệ hiện đại.",
          keywords:
            "giới thiệu phòng khám da liễu, bác sĩ da liễu, công nghệ chăm sóc da",
        };
      case "services":
        return {
          title: "Dịch vụ - Nadala Dermatology Clinic",
          description:
            "Các dịch vụ chăm sóc da chuyên nghiệp: điều trị mụn, nám, laser trẻ hóa, chăm sóc da mặt và toàn thân.",
          keywords:
            "điều trị mụn, điều trị nám, laser trẻ hóa da, chăm sóc da mặt, peeling da",
        };
      case "products":
        return {
          title: "Sản phẩm - Nadala Dermatology Clinic",
          description:
            "Các sản phẩm chăm sóc da chính hãng, kem chống nắng, serum, kem dưỡng được khuyên dùng bởi bác sĩ.",
          keywords:
            "sản phẩm chăm sóc da, kem chống nắng, serum vitamin c, kem dưỡng da",
        };
      case "booking":
        return {
          title: "Đặt lịch hẹn - Nadala Dermatology Clinic",
          description:
            "Đặt lịch hẹn khám da liễu online dễ dàng, nhanh chóng. Liên hệ 0909 544 229 để được tư vấn.",
          keywords: "đặt lịch khám da liễu, booking online, tư vấn da liễu",
        };
      case "contact":
        return {
          title: "Liên hệ - Nadala Dermatology Clinic",
          description:
            "Liên hệ phòng khám Nadala: 31 Hà Thị Đát, Tân Sơn Nhì, TP.HCM. Hotline: 0909 544 229 - 0916 954 699.",
          keywords:
            "liên hệ phòng khám da liễu, địa chỉ phòng khám, hotline tư vấn da",
        };
      default:
        return {
          title: "Nadala Dermatology Clinic - Phòng khám da liễu chuyên nghiệp",
          description:
            "Phòng khám da liễu Nadala với 15 năm kinh nghiệm, chuyên điều trị mụn, nám, chăm sóc da chuyên nghiệp tại TP.HCM.",
          keywords:
            "phòng khám da liễu, điều trị mụn, chăm sóc da, nám da, TPHCM",
        };
    }
  };

  const renderSection = () => {
    console.log("Rendering section:", activeSection);
    switch (activeSection) {
      case "home":
        return (
          <Home
            onNavigate={handleNavigate}
            setIsLoginOpen={setIsLoginOpen} // Thêm prop này
            onLoginSuccess={handleLoginSuccess} // Thêm prop này
          />
        );
      case "about":
        return <About />;
      case "services":
        return <Services onNavigate={handleNavigate} />;
      case "products":
        return (
          <Products
            onNavigate={handleNavigate}
            token={token}
            setIsLoginOpen={setIsLoginOpen}
          />
        );
      case "booking":
        return <Booking token={token} setIsLoginOpen={setIsLoginOpen} />;
      case "reviews":
        return <Reviews />;
      case "contact":
        return <Contact />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            setIsLoginOpen={setIsLoginOpen}
            onLoginSuccess={handleLoginSuccess}
          />
        );
    }
  };

  const seoContent = getSEOContent();

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <SEOHead {...seoContent} />
        <Header activeSection={activeSection} onNavigate={handleNavigate} />
        <LoginModal
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onLoginSuccess={handleLoginSuccess}
        />
        <main>{renderSection()}</main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </LanguageProvider>
  );
}
