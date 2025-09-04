import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Award, 
  Users, 
  Heart, 
  Star, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Stethoscope,
  GraduationCap,
  Clock,
  CheckCircle,
  Building2,
  Camera,
  Monitor
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

export function About() {
  const { t } = useLanguage();
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors data
  const fetchDoctors = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response doctors:", response.status, errorText);
        if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Doctors: ${errorText || response.statusText}`);
      }
      const doctorsData = await response.json();
      setDoctors(doctorsData);
    } catch (err: any) {
      console.error("Error fetching doctors:", err.message);
      setError(err.message);
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
      if (data.refresh) {
        setRefreshToken(data.refresh);
        localStorage.setItem("refresh_token", data.refresh);
      }
      console.log("Token refreshed successfully");
      await fetchDoctors(data.access); // Fetch again with new token
    } catch (err: any) {
      console.error("Error refreshing token:", err.message);
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  // UseEffect to fetch data when token changes
  useEffect(() => {
    if (token) {
      fetchDoctors(token);
    } else if (!localStorage.getItem("access_token")) {
      console.log("No token found, please log in");
      setError("No token found, please log in");
    }
  }, [token]);

  // About Nadala Introduction Section
  const IntroductionSection = () => (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary via-white to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="mb-4 lg:mb-6 text-lg lg:text-2xl font-bold text-primary">
            {t('about.title')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gray-900 mb-6 lg:mb-8 max-w-4xl mx-auto leading-tight">
            {t('about.hero.title')}
          </h1>
        </div>

        <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Nadala Beauty Clinic"
                className="w-full h-64 sm:h-80 lg:h-96 xl:h-[450px] object-cover rounded-2xl shadow-xl"
              />
              
              {/* Floating stats */}
              <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-base lg:text-lg font-bold text-gray-900">15+ {t('home.stats.experience').split(' ')[1]}</div>
                    <div className="text-sm text-gray-600">{t('home.stats.experience').split(' ')[0]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
            <div className="max-w-none">
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-4 lg:mb-6">
                <strong className="text-primary">{t('about.intro.title')}</strong> {t('about.intro.content1')}
              </p>
              
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                {t('about.intro.content2')}
              </p>
            </div>

            {/* Key highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="text-sm lg:text-base font-semibold text-gray-900">Tận tâm</div>
                  <div className="text-xs lg:text-sm text-gray-600">Chăm sóc từng chi tiết</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="text-sm lg:text-base font-semibold text-gray-900">An toàn</div>
                  <div className="text-xs lg:text-sm text-gray-600">Tiêu chuẩn quốc tế</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Star className="w-6 h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="text-sm lg:text-base font-semibold text-gray-900">Chuyên nghiệp</div>
                  <div className="text-xs lg:text-sm text-gray-600">Đội ngũ bác sĩ giỏi</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
                <div>
                  <div className="text-sm lg:text-base font-semibold text-gray-900">10k+ Khách hàng</div>
                  <div className="text-xs lg:text-sm text-gray-600">Tin tưởng lựa chọn</div>
                </div>
              </div>
            </div>

            {/* Mission statement */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
                {t('about.mission.title')}
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                "{t('about.mission.content')}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Team Section with dynamic doctors
  const TeamSection = () => (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('about.team.title')}
          </h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
            {t('about.team.subtitle')}
          </p>
        </div>

        {isLoading && <p className="text-center">Đang tải danh sách bác sĩ...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!isLoading && !error && (
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12 lg:mb-16">
            {doctors.map((doctor, index) => (
              <Card key={index} className="overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300">
                <div className="grid gap-6 md:grid-cols-3 p-6">
                  <div className="flex justify-center md:justify-start">
                    <Avatar className="w-28 h-28 lg:w-32 lg:h-32 border-4 border-primary/20">
                      <AvatarImage src={`https://via.placeholder.com/150?text=${encodeURIComponent(doctor.name)}`} alt={doctor.name} className="object-cover" />
                      <AvatarFallback className="text-xl font-semibold">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-primary font-medium mb-2">{doctor.specialization || "Chưa có chuyên môn"}</p>
                      <p className="text-gray-600 text-sm mb-2">{doctor.contact_number || "Chưa có số điện thoại"}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-gray-600">Chưa có thông tin kinh nghiệm</span>
                      </div>
                      <div className="flex items-start gap-2 justify-center md:justify-start">
                        <GraduationCap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 text-center md:text-left">{doctor.email || "Chưa có email"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Team stats */}
        <div className="bg-gradient-to-r from-primary to-teal-500 rounded-2xl p-6 lg:p-8 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div>
              <Stethoscope className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 opacity-90" />
              <div className="text-xl lg:text-2xl font-bold mb-1">15+</div>
              <div className="text-sm opacity-90">Bác sĩ & Chuyên viên</div>
            </div>
            <div>
              <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 opacity-90" />
              <div className="text-xl lg:text-2xl font-bold mb-1">50+</div>
              <div className="text-sm opacity-90">Chứng chỉ chuyên môn</div>
            </div>
            <div>
              <Award className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 opacity-90" />
              <div className="text-xl lg:text-2xl font-bold mb-1">100+</div>
              <div className="text-sm opacity-90">Giờ đào tạo/tháng</div>
            </div>
            <div>
              <Users className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 opacity-90" />
              <div className="text-xl lg:text-2xl font-bold mb-1">10k+</div>
              <div className="text-sm opacity-90">Khách hàng đã điều trị</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Facilities Section
  const facilityImages = [
    {
      title: "Phòng khám chính",
      description: "Không gian tiếp đón khách hàng rộng rãi, hiện đại",
      image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Phòng điều trị laser",
      description: "Trang bị máy laser hiện đại, tiêu chuẩn quốc tế",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Phòng chăm sóc da mặt",
      description: "Môi trường thư giãn, thiết bị chăm sóc da cao cấp",
      image: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Khu vực tư vấn",
      description: "Không gian riêng tư để tư vấn và thăm khám",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Phòng chờ VIP",
      description: "Khu vực nghỉ ngơi sang trọng cho khách hàng",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Khu vực sterilization",
      description: "Hệ thống tiệt trùng hiện đại, đảm bảo an toàn",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const FacilitiesSection = () => (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('about.facilities.title')}
          </h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">
            {t('about.facilities.subtitle')}
          </p>
        </div>

        {/* Main facility showcase */}
        <div className="mb-12 lg:mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src={facilityImages[currentFacilityIndex].image}
              alt={facilityImages[currentFacilityIndex].title}
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 text-white">
              <h3 className="text-lg lg:text-2xl font-bold mb-2">{facilityImages[currentFacilityIndex].title}</h3>
              <p className="text-sm lg:text-lg opacity-90">{facilityImages[currentFacilityIndex].description}</p>
            </div>

            {/* Navigation arrows */}
            <Button
              variant="outline"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-white w-10 h-10 p-0"
              onClick={() => setCurrentFacilityIndex((prev) => 
                prev === 0 ? facilityImages.length - 1 : prev - 1
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-white w-10 h-10 p-0"
              onClick={() => setCurrentFacilityIndex((prev) => 
                prev === facilityImages.length - 1 ? 0 : prev + 1
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Video play button overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button 
                size="lg" 
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50"
                onClick={() => alert("Video tour sẽ được phát triển trong phiên bản tiếp theo!")}
              >
                <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" />
              </Button>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center mt-6 gap-2 overflow-x-auto pb-2">
            {facilityImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors flex-shrink-0 ${
                  index === currentFacilityIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentFacilityIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Facility grid */}
        <div className="grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {facilityImages.slice(0, 6).map((facility, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentFacilityIndex(index)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-base lg:text-lg">{facility.title}</CardTitle>
                <CardDescription className="text-sm">{facility.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Facility features */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-8 text-center">
            Tiêu chuẩn cơ sở vật chất
          </h3>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">An toàn tuyệt đối</h4>
              <p className="text-sm text-gray-600">Hệ thống khử trùng hiện đại, tuân thủ nghiêm ngặt quy trình y tế</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Công nghệ hiện đại</h4>
              <p className="text-sm text-gray-600">Trang bị máy móc, thiết bị y tế tiên tiến nhất từ các thương hiệu uy tín</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Không gian sang trọng</h4>
              <p className="text-sm text-gray-600">Thiết kế hiện đại, tạo cảm giác thoải mái và thư giãn cho khách hàng</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tiêu chuẩn quốc tế</h4>
              <p className="text-sm text-gray-600">Đạt chứng nhận ISO, tuân thủ các tiêu chuẩn y tế quốc tế</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div>
      <IntroductionSection />
      <TeamSection />
      <FacilitiesSection />
    </div>
  );
}