import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Separator } from "./ui/separator";
import {
  Sparkles,
  Heart,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Calendar,
  Star,
  Camera,
  Scissors,
  Paintbrush2,
  Syringe,
  Droplets,
  Sun,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

interface ServicesProps {
  onNavigate: (section: string) => void;
}

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  price: string;
  price_display: string;
  duration: string;
  image: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  description?: string;
  benefits?: string[];
  process?: string[];
  aftercare?: string[];
  category: string;
}

export function Services({ onNavigate }: ServicesProps) {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from API
  const fetchData = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/services/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response services:", response.status, errorText);
        if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Services: ${errorText || response.statusText}`);
      }
      const servicesData = await response.json();
      console.log("Raw services data:", servicesData);

      // Map API data to service format
      const mappedServices = servicesData.map((service: any) => ({
        id: service.id.toString(),
        title: service.name,
        shortDescription: service.description || "",
        price: service.price.toString(),
        price_display: `${service.price}đ`,
        duration: "", // Thêm logic từ backend nếu có
        image: service.image || "https://via.placeholder.com/150",
        icon: getServiceIcon(service.name),
        badge: getServiceBadge(service.name),
        badgeColor: getServiceBadgeColor(service.name),
        description: service.description || "",
        benefits: [], // Thêm logic từ backend nếu có
        process: [], // Thêm logic từ backend nếu có
        aftercare: [], // Thêm logic từ backend nếu có
        category: service.category || "dermatology",
      }));
      setServices(mappedServices);
    } catch (err: any) {
      console.error("Error fetching services:", err.message);
      alert("Lỗi khi lấy dữ liệu dịch vụ: " + err.message);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Làm mới token thất bại: ${errorText}`);
      }
      const data = await res.json();
      setToken(data.access);
      localStorage.setItem("access_token", data.access);
      alert(
        "Token đã được làm mới! - " +
          new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      await fetchData(data.access);
    } catch (err: any) {
      alert("Lỗi khi làm mới token: " + err.message);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  // UseEffect to fetch data when token changes
  useEffect(() => {
    if (token) {
      fetchData(token);
    } else if (!localStorage.getItem("access_token")) {
      console.log("No token found, please log in");
    }
  }, [token]);

  // Helper functions to map icons, badges, and colors based on service name
  const getServiceIcon = (name: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Điều trị mụn": <Sparkles className="w-6 h-6" />,
      "Điều trị nám": <Sun className="w-6 h-6" />,
      "Điều trị lão hóa da": <Zap className="w-6 h-6" />,
      "Điều trị sẹo rỗ": <Shield className="w-6 h-6" />,
      HydraFacial: <Droplets className="w-6 h-6" />,
      "Oxygen Therapy": <Heart className="w-6 h-6" />,
      "Tiêm Filler": <Syringe className="w-6 h-6" />,
      "Massage Thư Giãn": <Heart className="w-6 h-6" />,
      "Gội Đầu Dưỡng Sinh": <Droplets className="w-6 h-6" />,
      "Massage toàn thân": <Heart className="w-6 h-6" />,
      "Chăm Sóc Da Mặt": <Sparkles className="w-6 h-6" />,
      "Chăm Sóc Da Mặt Chuyên Sâu": <Sparkles className="w-6 h-6" />,
    };
    return iconMap[name] || <Sparkles className="w-6 h-6" />;
  };

  const getServiceBadge = (name: string) => {
    const badgeMap: { [key: string]: string } = {
      "Điều trị mụn": "Phổ biến",
      "Điều trị nám": "Hiệu quả cao",
      "Điều trị lão hóa da": "Công nghệ mới",
      "Điều trị sẹo rỗ": "Chuyên sâu",
      HydraFacial: "Bestseller",
      "Oxygen Therapy": "Thư giãn",
      "Tiêm Filler": "Cao cấp",
      "Massage Thư Giãn": "Thư giãn",
      "Gội Đầu Dưỡng Sinh": "Phổ biến",
      "Massage toàn thân": "Thư giãn",
      "Chăm Sóc Da Mặt": "Chuyên sâu",
      "Chăm Sóc Da Mặt Chuyên Sâu": "Chuyên sâu",
    };
    return badgeMap[name] || "";
  };

  const getServiceBadgeColor = (name: string) => {
    const colorMap: { [key: string]: string } = {
      "Điều trị mụn": "bg-orange-500",
      "Điều trị nám": "bg-primary",
      "Điều trị lão hóa da": "bg-purple-500",
      "Điều trị sẹo rỗ": "bg-blue-500",
      HydraFacial: "bg-green-500",
      "Oxygen Therapy": "bg-pink-500",
      "Tiêm Filler": "bg-yellow-600",
      "Massage Thư Giãn": "bg-pink-500",
      "Gội Đầu Dưỡng Sinh": "bg-orange-500",
      "Massage toàn thân": "bg-pink-500",
      "Chăm Sóc Da Mặt": "bg-blue-500",
      "Chăm Sóc Da Mặt Chuyên Sâu": "bg-blue-500",
    };
    return colorMap[name] || "bg-gray-500";
  };

  // Service Card Component
  const ServiceCard = ({
    service,
    onClick,
  }: {
    service: Service;
    onClick: () => void;
  }) => (
    <Card className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300 h-full">
      <div className="relative">
        <ImageWithFallback
          src={service.image}
          alt={service.title}
          className="w-full h-48 sm:h-56 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
          <div className="text-primary">{service.icon}</div>
        </div>
        {service.badge && (
          <Badge
            className={`absolute top-3 right-3 ${service.badgeColor} text-white text-xs`}
          >
            {service.badge}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg lg:text-xl group-hover:text-primary transition-colors">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {service.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between p-4 lg:p-6 pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-gray-600">{service.duration || "N/A"}</span>
            </div>
            <span className="font-semibold text-primary">
              {service.price_display}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 text-sm" onClick={onClick}>
            {t("common.view_details")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("booking")}
          >
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Service Detail Modal
  const ServiceDetailModal = ({
    service,
    onClose,
  }: {
    service: Service;
    onClose: () => void;
  }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="text-primary">{service.icon}</div>
          </div>
          <div>
            <DialogTitle className="text-xl lg:text-2xl">
              {service.title}
            </DialogTitle>
            <DialogDescription className="text-base lg:text-lg">
              {service.shortDescription}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <ImageWithFallback
              src={service.image}
              alt={service.title}
              className="w-full h-48 lg:h-64 object-cover rounded-xl"
            />
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Mô tả dịch vụ
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
              {service.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">Lợi ích</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.benefits?.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm lg:text-base">
                    {benefit}
                  </span>
                </div>
              )) || []}
            </div>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Quy trình thực hiện
            </h3>
            <div className="space-y-3">
              {service.process?.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-gray-600 pt-1 text-sm lg:text-base">
                    {step}
                  </span>
                </div>
              )) || []}
            </div>
          </div>

          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Chăm sóc sau điều trị
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="space-y-2">
                {service.aftercare?.map((care: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-amber-800 text-sm">{care}</span>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base lg:text-lg">
                Thông tin dịch vụ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Thời gian:</span>
                <span className="font-semibold text-sm">
                  {service.duration || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Giá:</span>
                <span className="font-semibold text-primary">
                  {service.price_display}
                </span>
              </div>
              <Separator />
              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    onClose();
                    onNavigate("booking");
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {t("common.book_now")}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Phone className="w-4 h-4 mr-1" />
                    Gọi ngay
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2 text-sm lg:text-base">
                  Cam kết chất lượng
                </h4>
                <p className="text-xs lg:text-sm text-gray-600">
                  Được thực hiện bởi đội ngũ bác sĩ chuyên khoa Da liễu giàu
                  kinh nghiệm
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-white to-accent py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-6 text-lg lg:text-2xl font-bold text-primary">
              {t("services.title")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              Dịch vụ Da liễu & Thẩm mỹ
              <span className="text-primary block mt-2">
                Hàng đầu tại TP.HCM
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              {t("services.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-6 lg:px-8"
                onClick={() => onNavigate("booking")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {t("common.book_now")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-6 lg:px-8"
                onClick={() =>
                  document
                    .getElementById("services-list")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("common.view_details")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section id="services-list" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Danh sách dịch vụ
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lựa chọn dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          <Tabs defaultValue="dermatology" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger
                value="dermatology"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Da liễu
              </TabsTrigger>
              <TabsTrigger value="spa" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Spa & Thẩm mỹ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dermatology">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services
                  .filter((service) => service.category === "dermatology")
                  .map((service) => (
                    <Dialog key={service.id}>
                      <DialogTrigger asChild>
                        <div>
                          <ServiceCard
                            service={service}
                            onClick={() => setSelectedService(service)}
                          />
                        </div>
                      </DialogTrigger>
                      <ServiceDetailModal
                        service={service}
                        onClose={() => setSelectedService(null)}
                      />
                    </Dialog>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="spa">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services
                  .filter((service) => service.category === "spa")
                  .map((service) => (
                    <Dialog key={service.id}>
                      <DialogTrigger asChild>
                        <div>
                          <ServiceCard
                            service={service}
                            onClick={() => setSelectedService(service)}
                          />
                        </div>
                      </DialogTrigger>
                      <ServiceDetailModal
                        service={service}
                        onClose={() => setSelectedService(null)}
                      />
                    </Dialog>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
