import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Upload,
  Send,
  CheckCircle,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Camera,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Review {
  name: string;
  email: string;
  service: string;
  rating: number;
  content: string;
  images: string[];
}

export function Reviews() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    service: "" as string | null,
    rating: 0,
    content: "",
    images: [] as string[],
    product: null as string | null,
    order: null as string | null,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState([]);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from API
  const fetchReviews = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response reviews:", response.status, errorText);
        if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Reviews: ${errorText || response.statusText}`);
      }
      const reviewsData = await response.json();
      console.log("Raw reviews data:", reviewsData);
      setReviews(reviewsData);
    } catch (err: any) {
      console.error("Error fetching reviews:", err.message);
      setError(err.message);
      setReviews([]);
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
      await fetchReviews(data.access);
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
      fetchReviews(token);
    } else if (!localStorage.getItem("access_token")) {
      console.log("No token found, please log in");
      setError("No token found, please log in");
    }
  }, [token]);

  // Handle image upload simulation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) =>
          `https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80&sig=${
            Date.now() + index
          }`
      );
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Before/After Gallery Data (static for now)
  const beforeAfterGallery = [
    {
      id: 1,
      title: "Điều trị mụn trứng cá",
      description: "3 tháng điều trị với laser và peeling chuyên sâu",
      beforeImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      duration: "3 tháng",
    },
    {
      id: 2,
      title: "Điều trị nám da",
      description: "6 tháng điều trị với Picosure và Q-Switch",
      beforeImage:
        "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      duration: "6 tháng",
    },
    {
      id: 3,
      title: "Trẻ hóa da - Chống lão hóa",
      description: "4 tháng điều trị với RF Microneedling và Laser Fractional",
      beforeImage:
        "https://images.unsplash.com/photo-1594824475922-29770154e7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      duration: "4 tháng",
    },
    {
      id: 4,
      title: "Điều trị sẹo rỗ",
      description: "5 tháng điều trị với CO2 Fractional và TCA Cross",
      beforeImage:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      duration: "5 tháng",
    },
    {
      id: 5,
      title: "Dưỡng ẩm và phục hồi da",
      description: "2 tháng liệu trình HydraFacial và Oxygen Therapy",
      beforeImage:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      afterImage:
        "https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      duration: "2 tháng",
    },
  ];

  // Service options for the form (static for now, ideally fetch from API)
  const serviceOptions = [
    { id: 1, name: "Điều trị mụn trứng cá" },
    { id: 2, name: "Điều trị nám da" },
    { id: 3, name: "HydraFacial" },
    { id: 4, name: "Điều trị lão hóa da" },
    { id: 5, name: "Mesotherapy" },
    { id: 6, name: "PRP Therapy" },
    { id: 7, name: "Oxygen Therapy" },
    { id: 8, name: "Khám và tư vấn" },
    { id: 9, name: "Khác" },
  ];

  // Calculate review statistics
  const reviewStats = {
    totalReviews: reviews.length,
    averageRating:
      reviews.length > 0
        ? reviews.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          ) / reviews.length
        : 0,
    ratingDistribution: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((review: any) => review.rating === rating).length,
      percentage:
        reviews.length > 0
          ? (reviews.filter((review: any) => review.rating === rating).length /
              reviews.length) *
            100
          : 0,
    })),
  };

  // Hero Section
  const HeroSection = () => (
    <section className="relative bg-gradient-to-br from-secondary via-white to-accent py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 sm:mb-6 text-lg sm:text-2xl font-bold text-primary">
            Đánh giá khách hàng
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight">
            Phản hồi từ khách hàng
            <span className="text-primary block">
              Những câu chuyện thành công
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ chăm sóc
            da tại Nadala. Hãy xem những chia sẻ chân thành từ họ.
          </p>

          <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-6 sm:h-6 ${
                        i < Math.floor(reviewStats.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Điểm trung bình
              </p>
            </div>

            <Separator
              orientation="vertical"
              className="h-12 sm:h-16 hidden sm:block"
            />

            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-primary mb-2">
                {reviewStats.totalReviews}+
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Đánh giá</p>
            </div>

            <Separator
              orientation="vertical"
              className="h-12 sm:h-16 hidden sm:block"
            />

            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold text-primary mb-2">
                98%
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Hài lòng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Reviews List Section
  const ReviewsListSection = () => (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <div className="lg:w-1/3">
            <Card className="lg:sticky lg:top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Phân bố đánh giá
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {reviewStats.ratingDistribution.map((item) => (
                  <div
                    key={item.rating}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <span className="w-6 sm:w-8 text-xs sm:text-sm font-medium">
                      {item.rating}
                    </span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-6 sm:w-8 text-xs sm:text-sm text-gray-600">
                      {item.count}
                    </span>
                  </div>
                ))}

                <Separator className="my-4 sm:my-6" />

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Chất lượng dịch vụ xuất sắc
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Đội ngũ chuyên nghiệp
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      Kết quả vượt mong đợi
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-2/3">
            <div className="space-y-4 sm:space-y-6">
              {isLoading && (
                <p className="text-center text-gray-600">
                  Đang tải đánh giá...
                </p>
              )}
              {error && (
                <p className="text-center text-red-600">Lỗi: {error}</p>
              )}
              {!isLoading && !error && reviews.length === 0 && (
                <p className="text-center text-gray-600">
                  Không có đánh giá nào để hiển thị.
                </p>
              )}
              {!isLoading &&
                !error &&
                reviews.map((review: any) => (
                  <Card
                    key={review.id}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <AvatarImage
                            src={
                              review.avatar || "https://via.placeholder.com/150"
                            }
                            alt={review.name}
                          />
                          <AvatarFallback>
                            {review.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {review.name}
                            </h3>
                            {review.verified && (
                              <Badge
                                variant="secondary"
                                className="text-xs w-fit"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">
                                  Đã xác thực
                                </span>
                                <span className="sm:hidden">Verified</span>
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < (review.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs w-fit">
                              {review.service?.name ||
                                review.product?.name ||
                                "Không xác định"}
                            </Badge>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>

                          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                            {review.content}
                          </p>

                          <div className="flex items-center gap-2 sm:gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs sm:text-sm p-1 sm:p-2"
                            >
                              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Hữu ích</span>{" "}
                              (0)
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs sm:text-sm p-1 sm:p-2"
                            >
                              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Trả lời
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Button variant="outline" size="lg">
                Xem thêm đánh giá
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Before/After Gallery Section
  const BeforeAfterGallery = () => (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Kết quả điều trị thực tế
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Những hình ảnh trước và sau điều trị chân thực từ khách hàng của
            Nadala
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-8">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm">
                      {beforeAfterGallery[currentGalleryIndex].title}
                    </Badge>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
                      Trước điều trị
                    </h3>
                    <ImageWithFallback
                      src={beforeAfterGallery[currentGalleryIndex].beforeImage}
                      alt="Before treatment"
                      className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Badge className="bg-green-500 text-xs sm:text-sm">
                        Kết quả
                      </Badge>
                      <span className="text-xs sm:text-sm text-gray-600">
                        Sau {beforeAfterGallery[currentGalleryIndex].duration}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">
                      Sau điều trị
                    </h3>
                    <ImageWithFallback
                      src={beforeAfterGallery[currentGalleryIndex].afterImage}
                      alt="After treatment"
                      className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  {beforeAfterGallery[currentGalleryIndex].description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentGalleryIndex((prev) =>
                        prev === 0 ? beforeAfterGallery.length - 1 : prev - 1
                      )
                    }
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Trước đó
                  </Button>

                  <div className="flex gap-2 order-first sm:order-none">
                    {beforeAfterGallery.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                          index === currentGalleryIndex
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentGalleryIndex(index)}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentGalleryIndex((prev) =>
                        prev === beforeAfterGallery.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="w-full sm:w-auto"
                  >
                    Tiếp theo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Alert className="max-w-2xl mx-auto">
            <Camera className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Lưu ý:</strong> Kết quả có thể khác nhau tùy theo tình
              trạng da và cơ địa của từng người. Hình ảnh được sử dụng với sự
              đồng ý của khách hàng.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );

  // Review Form Section
  const ReviewFormSection = () => {
    const [review, setReview] = useState<Review>({
      name: "",
      email: "",
      service: "",
      rating: 0,
      content: "",
      images: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const serviceRef = useRef<HTMLSelectElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setReview((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    };

    const removeImage = (index: number) => {
      setReview((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    };

    const handleSubmitReview = async () => {
      if (!review.name || !review.content || review.rating === 0 || !review.service) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc (họ tên, nội dung, đánh giá sao, dịch vụ)!");
        return;
      }
      if (review.rating < 1 || review.rating > 5) {
        setError("Đánh giá phải từ 1 đến 5 sao!");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const selectedService = serviceOptions.find(
          (option) => option.name === review.service
        );
        const serviceId = selectedService ? selectedService.id : null;

        if (!serviceId) {
          throw new Error("Dịch vụ không hợp lệ!");
        }

        const payload = {
          name: review.name,
          email: review.email || null,
          content: review.content,
          rating: review.rating,
          service_id: serviceId,
          product_id: null,
        };

        const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401 && refreshToken) {
            await refreshAccessToken();
            return;
          }
          throw new Error(`Gửi đánh giá thất bại: ${errorText || response.statusText}`);
        }

        setReview({
          name: "",
          email: "",
          service: "",
          rating: 0,
          content: "",
          images: [],
        });
        setError(null);
        alert(
          `Cảm ơn ${review.name} đã gửi đánh giá!\n\nĐánh giá sẽ được kiểm duyệt trong 24h.`
        );
        await fetchReviews(token!);
      } catch (err: any) {
        console.error("Error submitting review:", err.message);
        setError("Lỗi khi gửi đánh giá: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Chia sẻ trải nghiệm của bạn
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Đánh giá của bạn sẽ giúp chúng tôi cải thiện dịch vụ và hỗ trợ
              những khách hàng khác đưa ra quyết định
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">
                Viết đánh giá
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Vui lòng chia sẻ cảm nhận thật của bạn về dịch vụ tại Nadala
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="reviewName" className="text-sm sm:text-base">
                    Họ và tên *
                  </Label>
                  <Input
                    ref={nameRef}
                    id="reviewName"
                    value={review.name}
                    onChange={(e) =>
                      setReview((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập họ và tên của bạn"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewEmail" className="text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    ref={emailRef}
                    id="reviewEmail"
                    type="email"
                    value={review.email}
                    onChange={(e) =>
                      setReview((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Nhập email (không bắt buộc)"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reviewService" className="text-sm sm:text-base">
                  Dịch vụ đã sử dụng *
                </Label>
                <select
                  ref={serviceRef}
                  id="reviewService"
                  value={review.service}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, service: e.target.value }))
                  }
                  className="w-full px-3 py-2 mt-1 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Chọn dịch vụ</option>
                  {serviceOptions.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm sm:text-base">Đánh giá sao *</Label>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setReview((prev) => ({ ...prev, rating: i + 1 }))
                      }
                      className="focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                    >
                      <Star
                        className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {review.rating > 0 && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Bạn đã chọn {review.rating} sao
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="reviewContent" className="text-sm sm:text-base">
                  Nội dung đánh giá *
                </Label>
                <Textarea
                  ref={contentRef}
                  id="reviewContent"
                  value={review.content}
                  onChange={(e) =>
                    setReview((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Chia sẻ trải nghiệm và cảm nhận của bạn về dịch vụ tại Nadala..."
                  rows={4}
                  className="mt-1 text-sm sm:text-base"
                />
              </div>

              <div>
                <Label className="text-sm sm:text-base">
                  Upload ảnh (không bắt buộc)
                </Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                        Kéo thả ảnh vào đây hoặc{" "}
                        <span className="text-primary">nhấp để chọn</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        PNG, JPG, GIF tối đa 10MB mỗi ảnh
                      </p>
                    </label>
                  </div>

                  {review.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <ImageWithFallback
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-16 sm:h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  Đánh giá của bạn sẽ được kiểm duyệt và xuất hiện trên website
                  trong vòng 24 giờ. Cảm ơn bạn đã dành thời gian chia sẻ!
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSubmitReview}
                className="w-full"
                size="lg"
                disabled={
                  isLoading ||
                  !review.name ||
                  !review.content ||
                  review.rating === 0 ||
                  !review.service
                }
              >
                {isLoading ? (
                  "Đang gửi..."
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Gửi đánh giá
                  </>
                )}
              </Button>

              {error && (
                <p className="text-red-600 text-center">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  };

  // Hàm submit từ parent (bỏ vì không cần thiết)
  const handleSubmitReviewFromParent = async () => {
    // Không cần thiết vì logic đã được xử lý trong ReviewFormSection
  };

  return (
    <div>
      <HeroSection />
      <ReviewsListSection />
      <BeforeAfterGallery />
      <ReviewFormSection />
    </div>
  );
}