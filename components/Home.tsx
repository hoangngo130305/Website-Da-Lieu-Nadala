import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import {
  Calendar,
  Star,
  Shield,
  Clock,
  Sparkles,
  Heart,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomeProps {
  onNavigate: (section: string) => void;
}

interface QuickBookingForm {
  service_id: string;
  doctor_id: string;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_notes: string;
}

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating?: number;
  image?: string | null;
  badge?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

interface TimeSlot {
  id: number;
  time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

interface Review {
  content: string;
  name: string;
  avatar: string | null;
  service: string | null;
  rating: number;
}

export function Home({ onNavigate }: HomeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [customerReviews, setCustomerReviews] = useState<Review[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm kiểm tra token có hợp lệ không
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (typeof payload.exp !== "number") {
        console.error("Invalid exp format:", payload.exp);
        return false;
      }
      const expiry = payload.exp * 1000; // Chuyển giây thành mili-giây
      const now = Date.now();
      const isValid = now < expiry;
      console.log("Token validity check:", { token, expiry, now, isValid });
      return isValid;
    } catch (err) {
      console.error("Token không hợp lệ:", err);
      return false;
    }
  };

  // Hàm làm mới token
  const refreshAccessToken = async (): Promise<string> => {
    if (!refreshToken) {
      throw new Error("Không có refresh token. Vui lòng đăng nhập lại!");
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Refresh token response:", res.status, errorText);
        throw new Error(`Làm mới token thất bại: ${errorText}`);
      }
      const data = await res.json();
      const newAccessToken = data.access;
      setToken(newAccessToken);
      localStorage.setItem("access_token", newAccessToken);
      if (data.refresh) {
        setRefreshToken(data.refresh);
        localStorage.setItem("refresh_token", data.refresh);
      }
      console.log("Token refreshed successfully:", newAccessToken);
      return newAccessToken;
    } catch (err: any) {
      console.error("Error refreshing token:", err.message);
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw err;
    }
  };

  // Hàm fetch dữ liệu với retry khi token hết hạn
  const fetchData = async (
    accessToken: string,
    endpoint: string,
    setter: Function,
    slice?: number
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const responseText = await response.text();
      console.log(`Response for ${endpoint}:`, {
        status: response.status,
        body: responseText,
      });
      if (!response.ok) {
        if (response.status === 401 && refreshToken) {
          const newToken = await refreshAccessToken();
          return fetchData(newToken, endpoint, setter, slice);
        }
        throw new Error(
          `${endpoint.split("/")[2]}: ${responseText || response.statusText}`
        );
      }
      const data = JSON.parse(responseText);
      console.log(`Data received from ${endpoint}:`, data);
      setter(slice ? data.slice(0, slice) : data);
    } catch (err: any) {
      console.error(`Error fetching ${endpoint.split("/")[2]}:`, err.message);
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setIsLoading(false);
      console.log(`Fetch completed for ${endpoint}`);
    }
  };

  const fetchFeaturedServices = () =>
    fetchData(token!, "/api/services/?is_active=true", setFeaturedServices, 3);
  const fetchFeaturedProducts = () =>
    fetchData(
      token!,
      "/api/products/?is_featured=true",
      setFeaturedProducts,
      3
    );
  const fetchCustomerReviews = () =>
    fetchData(token!, "/api/reviews/", setCustomerReviews);
  const fetchDoctors = () => fetchData(token!, "/api/doctors/", setDoctors);
  const fetchTimeSlots = () =>
    fetchData(token!, "/api/time-slots/", setTimeSlots);

  // Hàm fetch tất cả dữ liệu
  const fetchAllData = async () => {
    if (!token) {
      setError("Vui lòng đăng nhập để tải dữ liệu!");
      onNavigate("login");
      return;
    }
    if (isTokenValid(token)) {
      console.log("Fetching data with valid token:", token);
      await Promise.all([
        fetchFeaturedServices(),
        fetchFeaturedProducts(),
        fetchCustomerReviews(),
        fetchDoctors(),
        fetchTimeSlots(),
      ]).catch((err) => setError(`Lỗi khi tải dữ liệu: ${err.message}`));
    } else {
      setError("Token đã hết hạn. Vui lòng đăng nhập lại!");
      onNavigate("login");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        console.log("Current token:", storedToken);
        console.log("Current refresh token:", storedRefreshToken);
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        fetchAllData();
      } catch (err) {
        console.error("Error accessing localStorage:", err);
        setError("Không thể truy cập localStorage. Vui lòng thử lại!");
      }
    } else {
      setError("localStorage không khả dụng trong môi trường này!");
    }
  }, []);

  const HeroBanner = () => (
    <section className="relative bg-gradient-to-br from-secondary via-white to-accent py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/40 rounded-full blur-2xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <h1 className="display-1 leading-tight relative">
                  <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Gửi trọn tin yêu
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-teal-500 to-primary bg-clip-text text-transparent font-extrabold relative">
                    Tự tin tỏa sáng
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-teal-500 to-primary bg-clip-text text-transparent blur-sm opacity-50">
                      Tự tin tỏa sáng
                    </span>
                  </span>
                </h1>
                <div className="absolute -top-2 -right-2 w-6 h-6 text-primary/60">
                  <Sparkles className="w-full h-full animate-pulse" />
                </div>
                <div className="absolute top-1/3 -left-3 w-4 h-4 text-teal-400/40">
                  <Sparkles className="w-full h-full animate-pulse delay-300" />
                </div>
                <div className="absolute bottom-4 right-1/4 w-5 h-5 text-primary/30">
                  <Sparkles className="w-full h-full animate-pulse delay-700" />
                </div>
              </div>
              <p className="lead text-gray-600 max-w-lg relative z-10">
                Nadala - Nơi khởi nguồn vẻ đẹp tự nhiên, mang đến giải pháp chăm
                sóc da toàn diện với tình yêu và sự tận tâm.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => onNavigate("booking")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Đặt lịch ngay
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                onClick={() => onNavigate("services")}
              >
                Khám phá dịch vụ
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 relative z-10">
              <div className="text-center group">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  15+
                </div>
                <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  10k+
                </div>
                <div className="text-sm text-gray-600">Khách hàng</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  98%
                </div>
                <div className="text-sm text-gray-600">Hài lòng</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Nadala Dermatology Clinic"
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 z-10 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Uy tín #1</div>
                  <div className="text-sm text-gray-600">
                    Chăm sóc da TP.HCM
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-float">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const AboutOverview = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Phòng khám Nadala"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">Về Nadala</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                15 năm đồng hành cùng làn da Việt
              </h2>
              <p className="text-gray-600 mb-4">
                Được thành lập vào năm 2009, Nadala đã trở thành địa chỉ tin cậy
                của hàng nghìn khách hàng với phương châm "Gửi trọn tin yêu – Tự
                tin tỏa sáng".
              </p>
              <p className="text-gray-600 mb-6">
                Chúng tôi không ngừng đầu tư công nghệ hiện đại, đào tạo đội ngũ
                chuyên nghiệp để mang đến những giải pháp chăm sóc da tốt nhất.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-semibold">An toàn</div>
                  <div className="text-sm text-gray-600">
                    Tiêu chuẩn quốc tế
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-semibold">Chuyên nghiệp</div>
                  <div className="text-sm text-gray-600">
                    Đội ngũ bác sĩ giỏi
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => onNavigate("about")}>
              Tìm hiểu thêm
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const FeaturedServices = () => (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Dịch vụ nổi bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những dịch vụ được khách hàng tin tưởng và lựa chọn nhiều nhất tại
            Nadala
          </p>
        </div>
        {isLoading && <p className="text-center">Đang tải dịch vụ...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && (
          <div>
            {featuredServices.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {featuredServices.map((service, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={service.image || "https://via.placeholder.com/400"}
                        alt={service.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold text-lg">
                          {service.price}
                        </span>
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center">Không có dịch vụ nào để hiển thị.</p>
            )}
          </div>
        )}
        <div className="text-center">
          <Button size="lg" onClick={() => onNavigate("services")}>
            Xem tất cả dịch vụ
          </Button>
        </div>
      </div>
    </section>
  );

  const FeaturedProducts = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Các sản phẩm chăm sóc da được bác sĩ Nadala khuyên dùng
          </p>
        </div>
        {isLoading && <p className="text-center">Đang tải sản phẩm...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && (
          <div>
            {featuredProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product, index) => (
                  <Card
                    key={index}
                    className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <Badge
                          className={`absolute top-3 left-3 ${
                            product.badge === "Bán chạy"
                              ? "bg-orange-500"
                              : product.badge === "Mới"
                              ? "bg-green-500"
                              : product.badge === "Cao cấp"
                              ? "bg-purple-500"
                              : "bg-primary"
                          } text-white`}
                        >
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.rating || 0})
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-primary">
                            {product.price || "Giá liên hệ"}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          Mua ngay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center">Không có sản phẩm nào để hiển thị.</p>
            )}
          </div>
        )}
        <div className="text-center">
          <Button size="lg" onClick={() => onNavigate("products")}>
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );

  const ClinicGallery = () => {
    const clinicImages = [
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ];

    const galleryRef = useRef<HTMLDivElement>(null);

    const handleImageChange = useCallback((newIndex: number) => {
      setCurrentImageIndex(newIndex);
      if (galleryRef.current) {
        const scrollY = window.scrollY;
        galleryRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        window.scrollTo(0, scrollY);
      }
    }, []);

    return (
      <section
        className="py-20 bg-gray-50"
        ref={galleryRef}
        style={{ minHeight: "100vh" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hình ảnh phòng khám
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá không gian hiện đại, sạch sẽ tại Nadala
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <ImageWithFallback
                src={clinicImages[currentImageIndex]}
                alt="Phòng khám Nadala"
                className="w-full h-96 object-cover transition-all duration-500"
                onError={(e) => console.log("Image load error:", e)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                handleImageChange(
                  currentImageIndex === 0
                    ? clinicImages.length - 1
                    : currentImageIndex - 1
                );
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                handleImageChange(
                  currentImageIndex === clinicImages.length - 1
                    ? 0
                    : currentImageIndex + 1
                );
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="flex justify-center mt-6 gap-2">
              {clinicImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageChange(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const QuickBooking = () => {
    const [quickBookingForm, setQuickBookingForm] = useState<QuickBookingForm>({
      service_id: "",
      doctor_id: "",
      date: "",
      time: "",
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      customer_notes: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

    const handleFormChange = useCallback(
      (field: keyof QuickBookingForm, value: string) => {
        setQuickBookingForm((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
      []
    );

    const handleQuickBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) {
        setError("Vui lòng đăng nhập để đặt lịch!");
        onNavigate("login");
        return;
      }
      setIsLoading(true);
      setError(null);

      // Validate form
      if (!quickBookingForm.service_id) {
        setError("Vui lòng chọn dịch vụ!");
        setIsLoading(false);
        return;
      }
      if (!quickBookingForm.doctor_id) {
        setError("Vui lòng chọn bác sĩ!");
        setIsLoading(false);
        return;
      }
      if (!quickBookingForm.date) {
        setError("Vui lòng chọn ngày!");
        setIsLoading(false);
        return;
      }
      if (!quickBookingForm.time) {
        setError("Vui lòng chọn giờ!");
        setIsLoading(false);
        return;
      }
      if (quickBookingForm.customer_name.length < 2) {
        setError("Họ và tên phải có ít nhất 2 ký tự!");
        setIsLoading(false);
        return;
      }
      if (
        quickBookingForm.customer_phone &&
        !/^[0-9]{10,11}$/.test(quickBookingForm.customer_phone)
      ) {
        setError("Số điện thoại phải có 10-11 số!");
        setIsLoading(false);
        return;
      }

      let currentToken = token;
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/appointments/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: parseInt(quickBookingForm.service_id),
              doctor_id: parseInt(quickBookingForm.doctor_id),
              customer_name: quickBookingForm.customer_name,
              customer_phone: quickBookingForm.customer_phone || null,
              customer_email: quickBookingForm.customer_email || null,
              customer_notes: quickBookingForm.customer_notes || null,
              date: quickBookingForm.date,
              time: quickBookingForm.time,
              status: "pending",
            }),
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401 && refreshToken) {
            const newToken = await refreshAccessToken();
            currentToken = newToken;
            return handleQuickBooking(e); // Retry with new token
          }
          throw new Error(
            `Đặt lịch thất bại: ${errorText || response.statusText}`
          );
        }
        alert(
          "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn trong 15 phút."
        );
        setQuickBookingForm({
          service_id: "",
          doctor_id: "",
          date: "",
          time: "",
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          customer_notes: "",
        });
      } catch (err: any) {
        console.error("Error submitting booking:", err.message);
        setError(`Đặt lịch thất bại: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <section className="py-20 bg-primary" style={{ minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Đặt lịch nhanh
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Điền form bên dưới để đặt lịch nhanh chóng
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <form
                ref={formRef}
                onSubmit={handleQuickBooking}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={quickBookingForm.service_id}
                      onValueChange={(value) =>
                        handleFormChange("service_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {featuredServices.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id.toString()}
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={quickBookingForm.doctor_id}
                      onValueChange={(value) =>
                        handleFormChange("doctor_id", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id.toString()}
                          >
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="date"
                      value={quickBookingForm.date}
                      onChange={(e) => handleFormChange("date", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Select
                      value={quickBookingForm.time}
                      onValueChange={(value) => handleFormChange("time", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots
                          .filter((slot) => slot.is_available)
                          .map((slot) => (
                            <SelectItem key={slot.id} value={slot.time}>
                              {slot.time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Họ và tên"
                      value={quickBookingForm.customer_name}
                      onChange={(e) =>
                        handleFormChange("customer_name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Số điện thoại"
                      value={quickBookingForm.customer_phone}
                      onChange={(e) =>
                        handleFormChange("customer_phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    value={quickBookingForm.customer_email}
                    onChange={(e) =>
                      handleFormChange("customer_email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Ghi chú"
                    value={quickBookingForm.customer_notes}
                    onChange={(e) =>
                      handleFormChange("customer_notes", e.target.value)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Gửi yêu cầu đặt lịch"}
                </Button>

                {error && <p className="text-red-600 text-center">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  const CustomerReviews = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã tin tưởng Nadala
          </p>
        </div>
        {isLoading && <p className="text-center">Đang tải đánh giá...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && (
          <div>
            {customerReviews.length > 0 ? (
              <div className="relative max-w-4xl mx-auto">
                <Card className="border-primary/10">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        "
                        {customerReviews[currentReviewIndex]?.content ||
                          "No review content"}
                        "
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={
                              customerReviews[currentReviewIndex]?.avatar ||
                              "https://placehold.co/150"
                            }
                            alt={
                              customerReviews[currentReviewIndex]?.name ||
                              "Anonymous user"
                            }
                            fallbackSrc="https://placehold.co/150"
                          />
                          <AvatarFallback>
                            {customerReviews[currentReviewIndex]?.name?.charAt(
                              0
                            ) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {customerReviews[currentReviewIndex]?.name ||
                              "Anonymous"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {customerReviews[currentReviewIndex]?.service ||
                              "No service specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center mb-6">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i <
                              (customerReviews[currentReviewIndex]?.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-center mt-8 gap-2">
                  {customerReviews.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentReviewIndex
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentReviewIndex(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center">Không có đánh giá nào để hiển thị.</p>
            )}
          </div>
        )}
        <div className="text-center mt-12">
          <Button size="lg" onClick={() => onNavigate("reviews")}>
            Xem tất cả đánh giá
          </Button>
        </div>
      </div>
    </section>
  );

  return (
    <div>
      <HeroBanner />
      <AboutOverview />
      <FeaturedServices />
      <FeaturedProducts />
      <ClinicGallery />
      <QuickBooking />
      <CustomerReviews />
    </div>
  );
}
