import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Blog() {
  const categories = ["Tất cả", "Chăm sóc da", "Điều trị mụn", "Chống lão hóa", "Kiến thức cơ bản"];

  const articles = [
    {
      id: 1,
      title: "10 bước chăm sóc da mặt cơ bản cho người mới bắt đầu",
      excerpt: "Hướng dẫn chi tiết từ A-Z về cách chăm sóc da mặt đúng cách, phù hợp cho mọi loại da...",
      category: "Kiến thức cơ bản",
      author: "BS. Lê Thị B",
      date: "15/01/2024",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Nguyên nhân và cách điều trị mụn trứng cá hiệu quả",
      excerpt: "Tìm hiểu về các loại mụn và phương pháp điều trị phù hợp với từng tình trạng da...",
      category: "Điều trị mụn",
      author: "TS.BS Nguyễn Văn A",
      date: "12/01/2024",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: 3,
      title: "Chống nắng đúng cách: Bí quyết để có làn da khỏe mạnh",
      excerpt: "Hướng dẫn chọn kem chống nắng phù hợp và cách sử dụng hiệu quả nhất...",
      category: "Chăm sóc da",
      author: "BS. Trần Văn C",
      date: "10/01/2024",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: 4,
      title: "Xu hướng chăm sóc da 2024: Những công nghệ mới nhất",
      excerpt: "Cập nhật những xu hướng và công nghệ mới trong ngành chăm sóc da năm 2024...",
      category: "Chống lão hóa",
      author: "BS. Phạm Thị D",
      date: "08/01/2024",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: 5,
      title: "Serum Vitamin C: Cách sử dụng và lựa chọn phù hợp",
      excerpt: "Tất cả những gì bạn cần biết về serum Vitamin C và cách tích hợp vào quy trình chăm sóc da...",
      category: "Chăm sóc da",
      author: "BS. Lê Thị B",
      date: "05/01/2024",
      readTime: "4 phút đọc",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: 6,
      title: "Điều trị nám da mặt: Phương pháp nào hiệu quả nhất?",
      excerpt: "So sánh các phương pháp điều trị nám hiện đại và lựa chọn phù hợp với tình trạng da...",
      category: "Điều trị mụn",
      author: "TS.BS Nguyễn Văn A",
      date: "03/01/2024",
      readTime: "9 phút đọc",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      featured: false
    }
  ];

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Kiến thức chăm sóc da
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cập nhật những kiến thức mới nhất về chăm sóc da từ đội ngũ bác sĩ 
            chuyên khoa tại Nadala
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <Card className="overflow-hidden border-primary/10">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <ImageWithFallback
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Bài viết nổi bật
                  </Badge>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-4">
                    {featuredArticle.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime}
                    </div>
                  </div>

                  <Button className="w-fit">
                    Đọc tiếp
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {regularArticles.map((article) => (
            <Card key={article.id} className="group overflow-hidden border-primary/10 hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge 
                  variant="outline" 
                  className="absolute top-3 left-3 bg-white"
                >
                  {article.category}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Đọc tiếp
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Xem thêm bài viết
          </Button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-secondary rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng ký nhận bài viết mới
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nhận thông báo khi có bài viết mới về chăm sóc da và các tips hữu ích 
            từ đội ngũ bác sĩ Nadala
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}