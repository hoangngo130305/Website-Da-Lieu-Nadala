"use client";

import { useState, useEffect } from "react";
import { login } from "../src/lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (access: string, refresh: string) => void;
}

export function LoginModal({
  isOpen,
  onOpenChange,
  onLoginSuccess,
}: LoginModalProps) {
  const [username, setUsername] = useState("admin1");
  const [password, setPassword] = useState("123321Hoang");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Đang thử đăng nhập với:", { username });
      const response = await login(username, password);
      if (!response || !response.access) {
        throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
      console.log("Kết quả đăng nhập:", response);
      onLoginSuccess(response.access, response.refresh);
      setUsername("admin1"); // Đặt lại giá trị mặc định
      setPassword("123321Hoang"); // Đặt lại giá trị mặc định
      setLoginError(null);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err.message);
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động đăng nhập khi modal mở và có username, password
  useEffect(() => {
    if (isOpen && username && password && !isLoading) {
      handleLogin();
    }
  }, [isOpen, username, password, isLoading]);

  // Không render giao diện
  return null;
}