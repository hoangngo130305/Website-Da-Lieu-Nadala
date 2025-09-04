import { useState, useEffect, memo } from "react";
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
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  CheckCircle,
  AlertCircle,
  Navigation,
  Users,
  Calendar,
  Globe,
  Headphones,
  MessageSquare,
  PhoneCall,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Contact() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts (optional, if needed for contact page stats)
  const fetchContacts = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response contacts:", response.status, errorText);
        if (response.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Contacts: ${errorText || response.statusText}`);
      }
      const contactsData = await response.json();
      console.log("Raw contacts data:", contactsData);
    } catch (err: any) {
      console.error("Error fetching contacts:", err.message);
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
      alert(
        "Token đã được làm mới! - " +
          new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      await fetchContacts(data.access);
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
      fetchContacts(token);
    } else if (!localStorage.getItem("access_token")) {
      console.log("No token found, please log in");
      setError("No token found, please log in");
    }
  }, [token]);

  // Contact information data
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ phòng khám",
      content: "31 Hà Thị Đát – Phường Tân Sơn Nhì – TP.HCM",
      action: "Xem bản đồ",
      color: "text-blue-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Số điện thoại",
      content: "0909 544 229 – 0916 954 699",
      action: "Gọi ngay",
      color: "text-green-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "nadala2025.vn@gmail.com",
      action: "Gửi email",
      color: "text-red-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Giờ làm việc",
      content: "8:00 - 20:00 (Thứ 2 - Chủ nhật)",
      action: "Xem lịch",
      color: "text-purple-600",
    },
  ];

  // Quick contact methods
  const quickContactMethods = [
    {
      name: "Zalo",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Chat trực tuyến qua Zalo",
      link: "#",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Messenger",
      icon: <Facebook className="w-5 h-5" />,
      description: "Chat qua Facebook Messenger",
      link: "#",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Hotline",
      icon: <PhoneCall className="w-5 h-5" />,
      description: "Gọi điện thoại trực tiếp",
      link: "tel:0909544229",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  // FAQ data
  const faqData = [
    {
      question: "Thời gian phản hồi tin nhắn?",
      answer: "Chúng tôi phản hồi trong vòng 2 giờ làm việc (8:00-20:00).",
    },
    {
      question: "Có thể đặt lịch qua form liên hệ không?",
      answer:
        "Bạn có thể gửi yêu cầu đặt lịch, nhưng nên sử dụng trang Đặt lịch để được xử lý nhanh hơn.",
    },
    {
      question: "Phòng khám có parking không?",
      answer: "Có, chúng tôi có khu vực đỗ xe miễn phí cho khách hàng.",
    },
  ];

  // Hero Section
  const HeroSection = () => (
    <section className="relative bg-gradient-to-br from-secondary via-white to-accent py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 text-2xl font-bold text-primary">
              Liên hệ với chúng tôi
            </div>
            <h1 className="display-2 text-gray-900 mb-6">
              Hỗ trợ 24/7
              <span className="text-primary block">
                Luôn sẵn sàng lắng nghe bạn
              </span>
            </h1>
            <p className="lead text-gray-600 mb-8">
              Đội ngũ chăm sóc khách hàng của Nadala luôn sẵn sàng hỗ trợ bạn.
              Liên hệ với chúng tôi qua bất kỳ kênh nào thuận tiện nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Send className="w-5 h-5 mr-2" />
                Gửi tin nhắn
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open("tel:0909544229")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Gọi ngay
              </Button>
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Liên hệ với Nadala Beauty Clinic"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
            />

            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Hỗ trợ 24/7</div>
                  <div className="text-sm text-gray-600">
                    Phản hồi nhanh chóng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Contact Information Section
  const ContactInfoSection = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thông tin liên hệ
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mọi thông tin chi tiết để bạn có thể liên hệ và đến phòng khám một
            cách dễ dàng
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 border-primary/10"
            >
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center ${info.color}`}
                >
                  {info.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {info.content}
                </p>
                <Button variant="outline" size="sm" className="text-xs">
                  {info.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Liên hệ nhanh
            </h3>
            <p className="text-gray-600">
              Chọn cách thức liên hệ phù hợp nhất với bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickContactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <Button
                    className={`w-16 h-16 rounded-full mb-4 ${method.color} text-white`}
                    onClick={() => {
                      if (method.link.startsWith("tel:")) {
                        window.open(method.link);
                      } else {
                        alert(
                          `Chức năng ${method.name} sẽ được tích hợp trong phiên bản tiếp theo!`
                        );
                      }
                    }}
                  >
                    {method.icon}
                  </Button>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {method.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // Google Maps Section
  const MapsSection = () => (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vị trí phòng khám
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm đường đến phòng khám Nadala một cách dễ dàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7985326240097!2d106.6274!3d10.8164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzU5LjAiTiAxMDbCsDM3JzM4LjciRQ!5e0!3m2!1sen!2s!4v1640000000000!5m2!1sen!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nadala Beauty Clinic Location"
                  />

                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Nadala Beauty Clinic
                        </h4>
                        <p className="text-xs text-gray-600">
                          31 Hà Thị Đát, Tân Sơn Nhì
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Hướng dẫn đi lại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Từ Sân bay Tân Sơn Nhất:
                  </h4>
                  <p className="text-sm text-gray-600">
                    Khoảng cách 3km, đi xe 10 phút. Đi thẳng Hoàng Văn Thụ, rẽ
                    trái vào Hà Thị Đát.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Từ trung tâm Quận 1:</h4>
                  <p className="text-sm text-gray-600">
                    Khoảng cách 8km, đi xe 20-25 phút. Đi Võ Văn Kiệt, qua cầu
                    Tân Thuận.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Phương tiện công cộng:</h4>
                  <p className="text-sm text-gray-600">
                    Bus 109, 152. Dừng tại Hà Thị Đát, đi bộ 2 phút đến phòng
                    khám.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tiện ích xung quanh
                    </h4>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Bãi đỗ xe miễn phí</li>
                  <li>• Siêu thị, quán ăn gần bên</li>
                  <li>• Dễ dàng di chuyển bằng Grab</li>
                  <li>• Giao thông thuận tiện</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  // Contact Form Section
  const ContactFormSection = memo(() => {
    const [contactForm, setContactForm] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submit triggered, preventing default behavior");

      if (!contactForm.name || !contactForm.email || !contactForm.message) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contacts/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: contactForm.name,
            email: contactForm.email || null,
            phone: contactForm.phone || null,
            message: contactForm.message,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401 && refreshToken) {
            await refreshAccessToken();
            return;
          }
          throw new Error(`Gửi tin nhắn thất bại: ${errorText || response.statusText}`);
        }

        const scrollPosition = window.scrollY;
        setIsSubmitted(true);
        setError(null);

        setTimeout(() => {
          setContactForm({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
          setIsSubmitted(false);
          window.scrollTo(0, scrollPosition);
        }, 3000);
      } catch (err: any) {
        console.error("Error submitting contact:", err.message);
        setError("Lỗi khi gửi tin nhắn: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="text-gray-600 mb-6">
                  Điền form bên dưới và chúng tôi sẽ phản hồi trong vòng 2 giờ
                  làm việc. Đối với các trường hợp khẩn cấp, vui lòng gọi trực
                  tiếp.
                </p>
              </div>

              {isSubmitted ? (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      Gửi thành công!
                    </h3>
                    <p className="text-green-700">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có
                      thể.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Họ và tên *</Label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Nhập họ và tên"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="Nhập địa chỉ email"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            value={contactForm.phone}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">Chủ đề</Label>
                          <select
                            id="subject"
                            value={contactForm.subject}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                subject: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Chọn chủ đề</option>
                            <option value="consultation">Tư vấn dịch vụ</option>
                            <option value="booking">Đặt lịch hẹn</option>
                            <option value="complaint">Góp ý/Khiếu nại</option>
                            <option value="partnership">
                              Hợp tác kinh doanh
                            </option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Nội dung tin nhắn *</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Nhập nội dung tin nhắn của bạn..."
                          rows={6}
                          required
                        />
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Các trường có dấu (*) là bắt buộc. Chúng tôi cam kết
                          bảo mật thông tin cá nhân của bạn.
                        </AlertDescription>
                      </Alert>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Đang gửi..."
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" /> Gửi tin nhắn
                          </>
                        )}
                      </Button>

                      {error && (
                        <p className="text-red-600 text-center">{error}</p>
                      )}
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Câu hỏi thường gặp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-primary" />
                    Thời gian hỗ trợ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thứ 2 - Chủ nhật:</span>
                      <span className="font-semibold">8:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotline 24/7:</span>
                      <span className="font-semibold text-primary">
                        0909 544 229
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email support:</span>
                      <span className="font-semibold">2 giờ phản hồi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Trường hợp khẩn cấp:</strong>
                  <br />
                  Gọi ngay: <span className="font-bold">0916 954 699</span>
                  <br />
                  Hoặc đến trực tiếp phòng khám trong giờ làm việc.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>
    );
  });

  return (
    <div>
      <HeroSection />
      <ContactInfoSection />
      <MapsSection />
      <ContactFormSection />
    </div>
  );
}