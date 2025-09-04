"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  MessageCircle,
  Facebook,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Định nghĩa interface cho dữ liệu
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
interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}
interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
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

interface Appointment {
  id: number;
  service_id: number;
  doctor_id: number;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  customer_notes: string | null;
  date: string;
  time: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BookingData {
  service: Service;
  date: Date;
  time: string;
  doctor: Doctor;
  customer: { name: string; phone: string; email?: string; notes?: string };
}

interface BookingProps {
  token: string | null;
  setIsLoginOpen: (open: boolean) => void;
}

// Component chính
export function Booking({ token, setIsLoginOpen }: BookingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );

  // Hàm lấy dữ liệu từ API
  const fetchData = async (accessToken: string) => {
    setIsLoading(true);
    console.log("Đang lấy dữ liệu với token:", accessToken);
    try {
      // Lấy danh sách dịch vụ
      const servicesRes = await fetch("http://127.0.0.1:8000/api/services/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!servicesRes.ok) {
        const errorText = await servicesRes.text();
        console.log("Lỗi khi lấy dịch vụ:", servicesRes.status, errorText);
        if (servicesRes.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Dịch vụ: ${errorText || servicesRes.statusText}`);
      }
      const servicesData = await servicesRes.json();
      setServices(
        servicesData.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          price: s.price + "đ",
          image: s.image || "https://via.placeholder.com/150",
          created_at: s.created_at,
          updated_at: s.updated_at,
          is_active: s.is_active,
        }))
      );

      // Lấy danh sách bác sĩ
      const doctorsRes = await fetch("http://127.0.0.1:8000/api/doctors/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!doctorsRes.ok) {
        const errorText = await doctorsRes.text();
        console.log("Lỗi khi lấy bác sĩ:", doctorsRes.status, errorText);
        if (doctorsRes.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Bác sĩ: ${errorText || doctorsRes.statusText}`);
      }
      const doctorsData = await doctorsRes.json();
      setDoctors(
        doctorsData.map((d: any) => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty,
          phone: d.phone,
          email: d.email,
          image: d.image || "https://via.placeholder.com/150",
          created_at: d.created_at,
          updated_at: d.updated_at,
        }))
      );

      // Lấy danh sách khung giờ
      const timeSlotsRes = await fetch(
        "http://127.0.0.1:8000/api/time-slots/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!timeSlotsRes.ok) {
        const errorText = await timeSlotsRes.text();
        console.log("Lỗi khi lấy khung giờ:", timeSlotsRes.status, errorText);
        if (timeSlotsRes.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Khung giờ: ${errorText || timeSlotsRes.statusText}`);
      }
      const timeSlotsData = await timeSlotsRes.json();
      if (!Array.isArray(timeSlotsData)) {
        console.error(
          "Định dạng dữ liệu khung giờ không hợp lệ:",
          timeSlotsData
        );
        throw new Error("Dữ liệu khung giờ không hợp lệ từ API");
      }
      setTimeSlots(
        timeSlotsData.map((t: any) => ({
          id: t.id,
          time: t.time,
          is_available: t.is_available,
          created_at: t.created_at,
          updated_at: t.updated_at,
        }))
      );

      // Lấy danh sách lịch hẹn
      const appointmentsRes = await fetch(
        "http://127.0.0.1:8000/api/appointments/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!appointmentsRes.ok) {
        const errorText = await appointmentsRes.text();
        console.log("Lỗi khi lấy lịch hẹn:", appointmentsRes.status, errorText);
        if (appointmentsRes.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(`Lịch hẹn: ${errorText || appointmentsRes.statusText}`);
      }
      const appointmentsData = await appointmentsRes.json();
      setAppointments(
        appointmentsData.map((a: any) => ({
          id: a.id,
          service_id: a.service_id,
          doctor_id: a.doctor_id,
          customer_name: a.customer_name,
          customer_phone: a.customer_phone,
          customer_email: a.customer_email,
          customer_notes: a.customer_notes,
          date: a.date,
          time: a.time,
          status: a.status,
          created_at: a.created_at,
          updated_at: a.updated_at,
        }))
      );
    } catch (err: any) {
      alert("Lỗi khi lấy dữ liệu: " + err.message);
      setServices([]);
      setDoctors([]);
      setTimeSlots([]);
      setAppointments([]);
      setIsLoginOpen(true); // Mở modal nếu lỗi do token
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm làm mới token
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
      localStorage.setItem("access_token", data.access);
      alert(
        "Token đã được làm mới! - " +
          new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      await fetchData(data.access);
    } catch (err: any) {
      alert("Lỗi khi làm mới token: " + err.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsLoginOpen(true);
    }
  };

  // useEffect để lấy dữ liệu khi token thay đổi
  useEffect(() => {
    console.log("Booking useEffect, token:", token);
    if (token) {
      fetchData(token);
    }
  }, [token]);

  // Chuyển bước tiếp theo
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  // Quay lại bước trước
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Kiểm tra điều kiện để chuyển bước
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== "";
      case 2:
        return selectedDate && selectedTime !== "";
      case 3:
        return selectedDoctor !== "";
      case 4:
        return customerInfo.name && customerInfo.phone;
      default:
        return true;
    }
  };

  // Định dạng ngày
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Xử lý gửi thông tin đặt lịch
  const handleBookingSubmit = async () => {
    if (!token) {
      setIsLoginOpen(true);
      return;
    }
    const service = services.find((s) => s.id === parseInt(selectedService));
    const doctor = doctors.find((d) => d.id === parseInt(selectedDoctor));
    if (!service || !doctor) {
      alert("Dịch vụ hoặc bác sĩ không hợp lệ!");
      return;
    }
    const bookingData: BookingData = {
      service: service!,
      date: selectedDate!,
      time: selectedTime,
      doctor: doctor!,
      customer: customerInfo,
    };
    console.log("Gửi dữ liệu đặt lịch:", {
      service_id: bookingData.service.id,
      doctor_id: bookingData.doctor.id,
      customer_name: bookingData.customer.name,
      customer_phone: bookingData.customer.phone,
      customer_email: bookingData.customer.email,
      customer_notes: bookingData.customer.notes,
      date: bookingData.date.toISOString().split("T")[0],
      time: bookingData.time,
      status: "pending",
    });
    try {
      const res = await fetch("http://127.0.0.1:8000/api/appointments/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: bookingData.service.id,
          doctor_id: bookingData.doctor.id,
          customer_name: bookingData.customer.name,
          customer_phone: bookingData.customer.phone,
          customer_email: bookingData.customer.email,
          customer_notes: bookingData.customer.notes,
          date: bookingData.date.toISOString().split("T")[0],
          time: bookingData.time,
          status: "pending",
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Chi tiết lỗi:", errorText);
        if (res.status === 401 && refreshToken) {
          await refreshAccessToken();
          return;
        }
        throw new Error(errorText || "Đặt lịch thất bại");
      }
      alert(
        `Đặt lịch thành công!\n\nThông tin đặt lịch:\n- Dịch vụ: ${
          bookingData.service.name
        }\n- Ngày giờ: ${formatDate(bookingData.date)} lúc ${
          bookingData.time
        }\n- Bác sĩ: ${
          bookingData.doctor.name
        }\n\nChúng tôi sẽ liên hệ xác nhận trong 15 phút!`
      );
      setCurrentStep(1);
      setSelectedService("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedDoctor("");
      setCustomerInfo({ name: "", phone: "", email: "", notes: "" });
    } catch (err: any) {
      alert("Lỗi khi đặt lịch: " + err.message);
    }
  };

  // Component chọn dịch vụ
  const ServiceSelection = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Chọn dịch vụ</CardTitle>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Không có dịch vụ để hiển thị. Vui lòng kiểm tra kết nối API.
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedService === service.id.toString()
                    ? "border-primary"
                    : ""
                }`}
                onClick={() => setSelectedService(service.id.toString())}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <ImageWithFallback
                    src={service.image || "https://via.placeholder.com/150"}
                    alt={service.name}
                    className="w-16 h-16 rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span className="font-bold">{service.price}</span>
                    </div>
                  </div>
                  {selectedService === service.id.toString() && (
                    <CheckCircle className="text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Component chọn ngày giờ
  const DateTimeSelection = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Chọn ngày và giờ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Label>Chọn ngày</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              className="border rounded"
            />
          </div>
          <div>
            <Label>Chọn giờ</Label>
            {timeSlots.length === 0 ? (
              <div className="text-center py-2 text-red-500">
                Không có khung giờ nào để hiển thị. Vui lòng kiểm tra API.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots
                  .filter((slot) => slot.is_available)
                  .map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTime === slot.time ? "default" : "outline"
                      }
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={
                        !selectedDate ||
                        appointments.some(
                          (a) =>
                            a.date ===
                              selectedDate?.toISOString().split("T")[0] &&
                            a.time === slot.time
                        )
                      }
                    >
                      {slot.time}
                    </Button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Component chọn bác sĩ
  const DoctorSelection = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Chọn bác sĩ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer hover:bg-gray-50 ${
                selectedDoctor === doctor.id.toString() ? "border-primary" : ""
              }`}
              onClick={() => setSelectedDoctor(doctor.id.toString())}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <ImageWithFallback
                  src={doctor.image || "https://via.placeholder.com/150"}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
                {selectedDoctor === doctor.id.toString() && (
                  <CheckCircle className="text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Component thông tin khách hàng (đã sửa để khắc phục lỗi mất focus)
  const CustomerInformation = memo(() => {
    console.log("CustomerInformation rendered"); // Debug để kiểm tra re-render

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      name: "",
      phone: "",
      email: "",
      notes: "",
    });

    const nameInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Thông tin khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Họ và tên</Label>
            <Input
              ref={nameInputRef}
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              ref={phoneInputRef}
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              ref={emailInputRef}
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Nhập email"
            />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <Textarea
              ref={notesTextareaRef}
              value={customerInfo.notes}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Ghi chú thêm"
            />
          </div>
        </CardContent>
      </Card>
    );
  });

  // Component xác nhận đặt lịch
  const BookingConfirmation = () => {
    const service = services.find((s) => s.id === parseInt(selectedService));
    const doctor = doctors.find((d) => d.id === parseInt(selectedDoctor));
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Xác nhận đặt lịch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Dịch vụ:</strong> {service?.name}
            </div>
            <div>
              <strong>Giá:</strong> {service?.price}
            </div>
            <Separator />
            <div>
              <strong>Ngày giờ:</strong>{" "}
              {selectedDate && formatDate(selectedDate)} lúc {selectedTime}
            </div>
            <div>
              <strong>Bác sĩ:</strong> {doctor?.name}
            </div>
            <Separator />
            <div>
              <strong>Khách hàng:</strong> {customerInfo.name}
            </div>
            <div>
              <strong>Điện thoại:</strong> {customerInfo.phone}
            </div>
            {customerInfo.email && (
              <div>
                <strong>Email:</strong> {customerInfo.email}
              </div>
            )}
            {customerInfo.notes && (
              <div>
                <strong>Ghi chú:</strong> {customerInfo.notes}
              </div>
            )}
            <Button onClick={handleBookingSubmit} className="w-full">
              <Send className="mr-2" /> Xác nhận
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Component nút điều hướng
  const NavigationButtons = () => (
    <div className="flex justify-between max-w-4xl mx-auto mt-6">
      <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
        <ArrowLeft className="mr-2" /> Quay lại
      </Button>
      {currentStep < 5 ? (
        <Button onClick={nextStep} disabled={!canProceedToNextStep()}>
          Tiếp tục <ArrowRight className="ml-2" />
        </Button>
      ) : null}
    </div>
  );

  // Component phần đầu trang
  const HeroSection = () => (
    <section className="relative bg-gradient-to-br from-secondary via-white to-accent py-12 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-4 sm:mb-6 text-lg sm:text-2xl font-bold text-primary">
              Đặt lịch online
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 leading-tight">
              Đặt lịch hẹn
              <span className="text-primary block">Nhanh chóng & Tiện lợi</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Đặt lịch hẹn chỉ trong vài phút. Chọn dịch vụ, ngày giờ phù hợp và
              để chúng tôi chăm sóc làn da của bạn.
            </p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Đặt lịch online
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  15p
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Xác nhận nhanh
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  5★
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Đánh giá cao
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1576673442511-7e39b6545c87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Đặt lịch hẹn tại Nadala Beauty Clinic"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900">
                    Đặt lịch dễ dàng
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Chỉ 5 bước đơn giản
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Component thông tin liên hệ
  const ContactInfoSection = () => (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Thông tin liên hệ
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">
                        Địa chỉ phòng khám
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        31 Hà Thị Đát – Phường Tân Sơn Nhì – TP.HCM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">
                        Số điện thoại
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        0909 544 229 – 0916 954 699
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">
                        Email
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base break-all">
                        nadala2025.vn@gmail.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">
                        Giờ làm việc
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        8:00 - 20:00 (Thứ 2 - Chủ nhật)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 sm:mt-8">
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Liên hệ trực tiếp
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <Button variant="outline" className="text-xs sm:text-sm">
                  <Phone className="mr-1 sm:mr-2" /> Gọi ngay
                </Button>
                <Button variant="outline" className="text-xs sm:text-sm">
                  <MessageCircle className="mr-1 sm:mr-2" /> Chat Zalo
                </Button>
                <Button variant="outline" className="text-xs sm:text-sm">
                  <Facebook className="mr-1 sm:mr-2" /> Facebook
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Lưu ý khi đặt lịch
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Đặt lịch trước:</strong> Vui lòng đặt lịch trước ít
                  nhất 1 ngày để đảm bảo có chỗ
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Giấy tờ cần thiết:</strong> Mang theo CMND/CCCD khi
                  đến khám
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Chuẩn bị da:</strong> Tránh sử dụng mỹ phẩm trước khi
                  đến khám
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Thay đổi lịch:</strong> Có thể hủy/đổi lịch trước 2
                  tiếng
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Component tiến trình bước
  const StepProgress = () => (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step <= currentStep
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              ) : (
                <span className="text-xs sm:text-sm font-semibold">{step}</span>
              )}
            </div>
            {step < 5 && (
              <div
                className={`w-6 sm:w-12 md:w-20 h-1 mx-1 sm:mx-2 transition-colors ${
                  step < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between max-w-2xl mx-auto mt-2 sm:mt-4 px-4">
        <span className="text-xs sm:text-sm text-gray-600 text-center">
          Dịch vụ
        </span>
        <span className="text-xs sm:text-sm text-gray-600 text-center">
          Ngày & giờ
        </span>
        <span className="text-xs sm:text-sm text-gray-600 text-center">
          Bác sĩ
        </span>
        <span className="text-xs sm:text-sm text-gray-600 text-center">
          Thông tin
        </span>
        <span className="text-xs sm:text-sm text-gray-600 text-center">
          Xác nhận
        </span>
      </div>
    </div>
  );

  // Render bước hiện tại
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelection />;
      case 2:
        return <DateTimeSelection />;
      case 3:
        return <DoctorSelection />;
      case 4:
        return <CustomerInformation />;
      case 5:
        return <BookingConfirmation />;
      default:
        return <ServiceSelection />;
    }
  };

  return (
    <div>
      <HeroSection />
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <>
              <StepProgress />
              {renderCurrentStep()}
              <NavigationButtons />
            </>
          )}
        </div>
      </section>
      <ContactInfoSection />
    </div>
  );
}
