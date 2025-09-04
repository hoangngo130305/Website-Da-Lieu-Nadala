"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { username });
      const response = await login(username, password);
      if (!response || !response.access) {
        throw new Error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
      console.log("Login response:", response);
      onLoginSuccess(response.access, response.refresh);
      setUsername("");
      setPassword("");
      setLoginError(null);
      onOpenChange(false);
      alert(
        "Đăng nhập thành công! - " +
          new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      );
    } catch (err: any) {
      console.error("Login error:", err.message);
      setLoginError(err.message);
      alert("Lỗi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log("Dialog open state changed:", open);
        onOpenChange(open);
      }}
    >
      <DialogContent aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Đăng nhập</DialogTitle>
        </DialogHeader>
        <div className="space-y-4" id="login-description">
          <Input
            autoFocus // Giữ focus trên input username
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault(); // Ngăn submit khi nhấn Enter
            }}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault(); // Ngăn submit khi nhấn Enter
            }}
          />
          {loginError && <p className="text-red-500">{loginError}</p>}
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
