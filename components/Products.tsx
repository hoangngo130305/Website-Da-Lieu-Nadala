"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Star, Plus, Minus, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  benefits?: string[];
  badge?: string;
  inStock?: boolean;
  volume?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductsProps {
  onNavigate: (section: string) => void;
  token: string | null;
  setIsLoginOpen: (open: boolean) => void;
}

export function Products({ onNavigate, token, setIsLoginOpen }: ProductsProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
  );
  const [localToken, setLocalToken] = useState<string | null>(token);

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

  // Hàm tự động đăng nhập
  const autoLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin1",
          password: "123321Hoang",
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Đăng nhập tự động thất bại: ${errorText}`);
      }
      const data = await res.json();
      const newAccessToken = data.access;
      const newRefreshToken = data.refresh;
      setLocalToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      console.log("Auto login successful:", newAccessToken);
      return newAccessToken;
    } catch (err: any) {
      console.error("Error during auto login:", err.message);
      setIsLoginOpen(true);
      throw err;
    }
  };

  // Hàm làm mới token
  const refreshAccessToken = async () => {
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
        throw new Error(`Làm mới token thất bại: ${errorText}`);
      }
      const data = await res.json();
      const newAccessToken = data.access;
      setLocalToken(newAccessToken);
      localStorage.setItem("access_token", newAccessToken);
      if (data.refresh) {
        setRefreshToken(data.refresh);
        localStorage.setItem("refresh_token", data.refresh);
      }
      console.log("Token refreshed successfully:", newAccessToken);
      return newAccessToken;
    } catch (err: any) {
      console.error("Error refreshing token:", err.message);
      setLocalToken(null);
      setRefreshToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsLoginOpen(true);
      throw err;
    }
  };

  // Hàm lấy danh sách sản phẩm
  const fetchProducts = async (accessToken: string) => {
    setIsLoading(true);
    console.log("Fetching products with token:", accessToken);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error response:", errorData);
        if (res.status === 401 && refreshToken) {
          const newToken = await refreshAccessToken();
          return fetchProducts(newToken);
        }
        throw new Error(errorData.detail || "Không thể lấy danh sách sản phẩm");
      }
      const data = await res.json();
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        description: p.description,
        inStock: p.stock > 0,
        category: p.category?.name || "other",
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100),
        badge: p.stock > 50 ? "Bán chạy" : undefined,
        volume: "50ml",
        benefits: [],
        ingredients: [],
        instructions: [],
      }));
      setProducts(mapped);
    } catch (err: any) {
      console.error("Error fetching products:", err.message);
      alert("Lỗi khi lấy sản phẩm: " + err.message);
      setProducts([]);
      setIsLoginOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm kiểm tra và lấy dữ liệu
  const fetchData = async () => {
    if (!localToken) {
      try {
        const newToken = await autoLogin();
        await fetchProducts(newToken);
      } catch (err) {
        console.error("Auto login failed:", err);
        return;
      }
    } else if (isTokenValid(localToken)) {
      await fetchProducts(localToken);
    } else {
      try {
        const newToken = await refreshAccessToken();
        await fetchProducts(newToken);
      } catch (err) {
        console.error("Refresh token failed:", err);
        try {
          const newToken = await autoLogin();
          await fetchProducts(newToken);
        } catch (autoLoginErr) {
          console.error("Auto login after refresh failed:", autoLoginErr);
        }
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        console.log("Current token:", storedToken);
        console.log("Current refresh token:", storedRefreshToken);
        setLocalToken(storedToken || token);
        setRefreshToken(storedRefreshToken);
        fetchData();
      } catch (err) {
        console.error("Error accessing localStorage:", err);
        alert("Không thể truy cập localStorage. Vui lòng thử lại!");
      }
    }
  }, [token]);

  const categories = [
    { id: "all", name: t("products.title") },
    { id: "acne", name: "Da mụn" },
    { id: "melasma", name: "Nám da" },
    { id: "moisturizer", name: t("products.moisturizer") },
    { id: "anti-aging", name: "Chống lão hóa" },
    { id: "sun-protection", name: t("products.sunscreen") },
    { id: "serum", name: t("products.serum") },
    { id: "cleanser", name: t("products.cleanser") },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || p.category === selectedCategory)
    );
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory, sortBy, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists)
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const ProductDetailModal = ({ product }: { product: Product }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl lg:text-2xl">
          {product.name}
        </DialogTitle>
      </DialogHeader>
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <ImageWithFallback
          src={product.image || ""}
          alt={product.name}
          className="w-full h-48 lg:h-64 object-cover rounded-xl mb-4"
        />
        <div className="space-y-4">
          <p className="text-gray-600">{product.description}</p>
          <div className="font-bold text-lg text-primary">
            {product.price?.toLocaleString()}đ
          </div>
          <Button onClick={() => addToCart(product)}>Thêm vào giỏ hàng</Button>
        </div>
      </div>
    </DialogContent>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300 h-full">
      <div className="relative">
        <ImageWithFallback
          src={product.image || ""}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-primary text-white">
            {product.badge}
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">{product.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={
                  i < (product.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs">({product.reviews})</span>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 text-xs lg:text-sm">
              Xem chi tiết
            </Button>
          </DialogTrigger>
          <ProductDetailModal product={product} />
        </Dialog>
        <Button
          onClick={() => addToCart(product)}
          className="flex-1 text-xs lg:text-sm"
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );

  const CartModal = () => (
    <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
      <DialogContent aria-describedby="cart-description">
        <DialogHeader>
          <DialogTitle>Giỏ hàng ({getTotalItems()} sản phẩm)</DialogTitle>
        </DialogHeader>
        {cart.length === 0 ? (
          <div className="text-center py-8">Giỏ hàng trống</div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <ImageWithFallback
                  src={item.image || ""}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">{item.name}</div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) - 1)
                    }
                  >
                    <Minus />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    onClick={() =>
                      updateQuantity(item.id, (item.quantity || 1) + 1)
                    }
                  >
                    <Plus />
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)}>
                    <X />
                  </Button>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              Tổng: {getTotalPrice().toLocaleString()}đ
            </div>
            <Button onClick={() => onNavigate("contact")} className="w-full">
              Liên hệ đặt mua
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên A-Z</SelectItem>
                <SelectItem value="price-low">Giá thấp {"<"} cao</SelectItem>
                <SelectItem value="price-high">Giá cao {"<"} thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCartOpen(true)}>
              Giỏ hàng ({getTotalItems()})
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Đang tải sản phẩm...</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <CartModal />
    </div>
  );
}
