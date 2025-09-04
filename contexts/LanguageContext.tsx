import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'vi' | 'en' | 'zh' | 'ja' | 'ko' | 'th' | 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  vi: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.services': 'Dịch vụ',
    'nav.products': 'Sản phẩm',
    'nav.booking': 'Đặt lịch hẹn',
    'nav.reviews': 'Đánh giá',
    'nav.contact': 'Liên hệ',

    
    // Home page
    'home.hero.title': 'Gửi trọn tin yêu – Tự tin tỏa sáng',
    'home.hero.subtitle': 'Phòng khám da liễu hàng đầu với 15 năm kinh nghiệm',
    'home.hero.description': 'Chuyên điều trị các bệnh lý da liễu và thẩm mỹ nội khoa với công nghệ tiên tiến, đội ngũ bác sĩ giàu kinh nghiệm.',
    'home.hero.cta': 'Đặt lịch ngay',
    'home.stats.experience': 'Năm kinh nghiệm',
    'home.stats.customers': 'Khách hàng hài lòng',
    'home.stats.treatments': 'Phương pháp điều trị',
    'home.stats.locations': 'Cơ sở',
    
    // About page
    'about.title': 'Về Nadala Beauty Clinic',
    'about.hero.title': 'Nơi khởi nguồn vẻ đẹp tự nhiên',
    'about.intro.title': 'Nadala Beauty Clinic',
    'about.intro.content1': 'không chỉ là tên một phòng khám Da liễu và Spa. Đó là nơi khơi nguồn của vẻ đẹp tự nhiên, nơi mỗi làn da được lắng nghe, chăm sóc và nâng niu bằng cả trái tim và chuyên môn.',
    'about.intro.content2': 'Với đội ngũ bác sĩ Da liễu, chuyên viên thẩm mỹ, Nadala không chỉ đơn thuần là chăm sóc da mà là nghệ thuật của sự kết hợp giữa điều trị các bệnh lý Da liễu và Thẩm mỹ nội khoa, giữa khoa học Da liễu hiện đại, công nghệ tiên tiến và sự tận tâm trong từng thao tác.',
    'about.mission.title': 'Sứ mệnh của chúng tôi',
    'about.mission.content': 'Mang đến cho mỗi khách hàng không chỉ là làn da đẹp mà còn là sự tự tin, niềm vui và chất lượng cuộc sống tốt hơn thông qua những giải pháp chăm sóc da tối ưu nhất.',
    'about.team.title': 'Đội ngũ bác sĩ & chuyên viên',
    'about.team.subtitle': 'Những chuyên gia hàng đầu trong lĩnh vực Da liễu và Thẩm mỹ, luôn tận tâm mang đến dịch vụ tốt nhất',
    'about.facilities.title': 'Cơ sở vật chất',
    'about.facilities.subtitle': 'Phòng khám được thiết kế hiện đại với đầy đủ trang thiết bị y tế tiên tiến, đảm bảo môi trường điều trị an toàn và chuyên nghiệp',
    
    // Services
    'services.title': 'Dịch vụ chuyên nghiệp',
    'services.subtitle': 'Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc da từ cơ bản đến nâng cao',
    'services.acne.title': 'Điều trị mụn trứng cá',
    'services.acne.desc': 'Phương pháp điều trị mụn hiện đại, an toàn và hiệu quả',
    'services.facial.title': 'Chăm sóc da mặt',
    'services.facial.desc': 'Làm sạch, tẩy tế bào chết và dưỡng ẩm chuyên sâu',
    'services.laser.title': 'Điều trị laser',
    'services.laser.desc': 'Công nghệ laser tiên tiến cho trẻ hóa và điều trị da',
    'services.melasma.title': 'Điều trị nám da',
    'services.melasma.desc': 'Phương pháp điều trị nám hiệu quả và an toàn',
    
    // Products
    'products.title': 'Sản phẩm chính hãng',
    'products.subtitle': 'Các sản phẩm chăm sóc da chất lượng cao được bác sĩ khuyên dùng',
    'products.skincare': 'Chăm sóc da',
    'products.sunscreen': 'Kem chống nắng',
    'products.treatment': 'Điều trị',
    'products.serum': 'Serum',
    'products.moisturizer': 'Kem dưỡng ẩm',
    'products.cleanser': 'Sữa rửa mặt',
    
    // Booking
    'booking.title': 'Đặt lịch hẹn',
    'booking.subtitle': 'Đặt lịch khám và tư vấn với bác sĩ da liễu',
    'booking.select_service': 'Chọn dịch vụ',
    'booking.select_doctor': 'Chọn bác sĩ',
    'booking.select_date': 'Chọn ngày',
    'booking.select_time': 'Chọn giờ',
    'booking.confirm': 'Xác nhận đặt lịch',
    
    // Reviews
    'reviews.title': 'Đánh giá khách hàng',
    'reviews.subtitle': 'Những chia sẻ chân thật từ khách hàng đã trải nghiệm dịch vụ',
    'reviews.write_review': 'Viết đánh giá',
    'reviews.rating': 'Đánh giá',
    'reviews.comment': 'Bình luận',
    
    // Contact
    'contact.title': 'Liên hệ với chúng tôi',
    'contact.subtitle': 'Hãy liên hệ để được tư vấn và hỗ trợ tốt nhất',
    'contact.info': 'Thông tin liên hệ',
    'contact.form': 'Gửi tin nhắn',
    'contact.location': 'Vị trí',
    'contact.hours': 'Giờ làm việc: 8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
    
    // Common
    'common.book_now': 'Đặt lịch ngay',
    'common.learn_more': 'Tìm hiểu thêm',
    'common.contact_us': 'Liên hệ ngay',
    'common.view_details': 'Xem chi tiết',
    'common.phone': 'Điện thoại',
    'common.email': 'Email',
    'common.address': 'Địa chỉ',
    'common.working_hours': 'Giờ làm việc',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Chỉnh sửa',
    'common.delete': 'Xóa',
    'common.add': 'Thêm',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.export': 'Xuất dữ liệu',
    'common.loading': 'Đang tải...',
    'common.error': 'Có lỗi xảy ra',
    'common.success': 'Thành công',
    'common.confirm': 'Xác nhận',
    'common.close': 'Đóng',
    
    // Admin
    'admin.title': 'Quản trị hệ thống',
    'admin.dashboard': 'Bảng điều khiển',
    'admin.content': 'Quản lý nội dung',
    'admin.products': 'Quản lý sản phẩm',
    'admin.bookings': 'Quản lý đặt lịch',
    'admin.reviews': 'Quản lý đánh giá',
    'admin.users': 'Quản lý người dùng',
    'admin.settings': 'Cài đặt',
    'admin.logout': 'Đăng xuất',
    
    // Forms
    'form.name': 'Họ và tên',
    'form.phone': 'Số điện thoại',
    'form.email': 'Email',
    'form.message': 'Tin nhắn',
    'form.service': 'Dịch vụ',
    'form.date': 'Ngày hẹn',
    'form.time': 'Giờ hẹn',
    'form.submit': 'Gửi',
    'form.required': 'Trường bắt buộc',
    'form.invalid_email': 'Email không hợp lệ',
    'form.invalid_phone': 'Số điện thoại không hợp lệ',
    
    // Social sharing
    'social.share': 'Chia sẻ',
    'social.share_facebook': 'Chia sẻ lên Facebook',
    'social.share_instagram': 'Chia sẻ lên Instagram',
    'social.share_zalo': 'Chia sẻ lên Zalo',
    
    // Footer
    'footer.about': 'Liên kết nhanh',
    'footer.services': 'Dịch vụ',
    'footer.contact': 'Kết nối với chúng tôi',
    'footer.follow': 'Theo dõi chúng tôi',
    'footer.copyright': '© 2025 Nadala Beauty Clinic. Tất cả quyền được bảo lưu.',
    'footer.newsletter': 'Đăng ký để nhận những thông tin mới nhất về chăm sóc da',
    'footer.share_website': 'Chia sẻ website:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.terms': 'Điều khoản sử dụng',
    'footer.refund': 'Chính sách hoàn tiền',
    'footer.faq': 'FAQ',
  },
  en: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.products': 'Products',
    'nav.booking': 'Booking',
    'nav.reviews': 'Reviews',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    
    // Home page
    'home.hero.title': 'Trust Completely – Shine Confidently',
    'home.hero.subtitle': 'Leading dermatology clinic with 15 years of experience',
    'home.hero.description': 'Specializing in dermatological treatments and medical aesthetics with advanced technology and experienced doctors.',
    'home.hero.cta': 'Book Now',
    'home.stats.experience': 'Years of Experience',
    'home.stats.customers': 'Satisfied Customers',
    'home.stats.treatments': 'Treatment Methods',
    'home.stats.locations': 'Locations',
    
    // About page
    'about.title': 'About Nadala Beauty Clinic',
    'about.hero.title': 'Where natural beauty begins',
    'about.intro.title': 'Nadala Beauty Clinic',
    'about.intro.content1': 'is more than just a dermatology and spa clinic. It is the birthplace of natural beauty, where every skin is listened to, cared for and nurtured with both heart and expertise.',
    'about.intro.content2': 'With a team of dermatologists and aesthetic specialists, Nadala is not just about skin care but the art of combining dermatological treatment and medical aesthetics, between modern dermatological science, advanced technology and dedication in every procedure.',
    'about.mission.title': 'Our Mission',
    'about.mission.content': 'To bring each customer not only beautiful skin but also confidence, joy and better quality of life through optimal skin care solutions.',
    'about.team.title': 'Our Medical Team',
    'about.team.subtitle': 'Leading experts in dermatology and aesthetics, always dedicated to providing the best service',
    'about.facilities.title': 'Facilities',
    'about.facilities.subtitle': 'Modern clinic design with complete advanced medical equipment, ensuring a safe and professional treatment environment',
    
    // Services
    'services.title': 'Professional Services',
    'services.subtitle': 'We provide comprehensive skin care services from basic to advanced',
    'services.acne.title': 'Acne Treatment',
    'services.acne.desc': 'Modern, safe and effective acne treatment methods',
    'services.facial.title': 'Facial Care',
    'services.facial.desc': 'Deep cleansing, exfoliation and moisturizing',
    'services.laser.title': 'Laser Treatment',
    'services.laser.desc': 'Advanced laser technology for rejuvenation and skin treatment',
    'services.melasma.title': 'Melasma Treatment',
    'services.melasma.desc': 'Effective and safe melasma treatment methods',
    
    // Products
    'products.title': 'Authentic Products',
    'products.subtitle': 'High-quality skincare products recommended by doctors',
    'products.skincare': 'Skincare',
    'products.sunscreen': 'Sunscreen',
    'products.treatment': 'Treatment',
    'products.serum': 'Serum',
    'products.moisturizer': 'Moisturizer',
    'products.cleanser': 'Cleanser',
    
    // Booking
    'booking.title': 'Book Appointment',
    'booking.subtitle': 'Schedule consultation and examination with dermatologists',
    'booking.select_service': 'Select Service',
    'booking.select_doctor': 'Select Doctor',
    'booking.select_date': 'Select Date',
    'booking.select_time': 'Select Time',
    'booking.confirm': 'Confirm Booking',
    
    // Reviews
    'reviews.title': 'Customer Reviews',
    'reviews.subtitle': 'Honest sharing from customers who have experienced our services',
    'reviews.write_review': 'Write Review',
    'reviews.rating': 'Rating',
    'reviews.comment': 'Comment',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch for the best consultation and support',
    'contact.info': 'Contact Information',
    'contact.form': 'Send Message',
    'contact.location': 'Location',
    'contact.hours': 'Working Hours: 8:00 AM - 8:00 PM (Monday - Sunday)',
    
    // Common
    'common.book_now': 'Book Now',
    'common.learn_more': 'Learn More',
    'common.contact_us': 'Contact Us',
    'common.view_details': 'View Details',
    'common.phone': 'Phone',
    'common.email': 'Email',
    'common.address': 'Address',
    'common.working_hours': 'Working Hours',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    
    // Admin
    'admin.title': 'System Administration',
    'admin.dashboard': 'Dashboard',
    'admin.content': 'Content Management',
    'admin.products': 'Product Management',
    'admin.bookings': 'Booking Management',
    'admin.reviews': 'Review Management',
    'admin.users': 'User Management',
    'admin.settings': 'Settings',
    'admin.logout': 'Logout',
    
    // Forms
    'form.name': 'Full Name',
    'form.phone': 'Phone Number',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.service': 'Service',
    'form.date': 'Date',
    'form.time': 'Time',
    'form.submit': 'Submit',
    'form.required': 'Required field',
    'form.invalid_email': 'Invalid email',
    'form.invalid_phone': 'Invalid phone number',
    
    // Social sharing
    'social.share': 'Share',
    'social.share_facebook': 'Share on Facebook',
    'social.share_instagram': 'Share on Instagram',
    'social.share_zalo': 'Share on Zalo',
    
    // Footer
    'footer.about': 'Quick Links',
    'footer.services': 'Services',
    'footer.contact': 'Connect with Us',
    'footer.follow': 'Follow Us',
    'footer.copyright': '© 2025 Nadala Beauty Clinic. All rights reserved.',
    'footer.newsletter': 'Subscribe to receive the latest skin care information',
    'footer.share_website': 'Share website:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.refund': 'Refund Policy',
    'footer.faq': 'FAQ',
  },
  zh: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.services': '服务',
    'nav.products': '产品',
    'nav.booking': '预约',
    'nav.reviews': '评价',
    'nav.contact': '联系',
    'nav.admin': '管理',
    
    // Home page
    'home.hero.title': '全心信赖 - 自信闪耀',
    'home.hero.subtitle': '拥有15年经验的领先皮肤科诊所',
    'home.hero.description': '专业皮肤科治疗和医学美容，采用先进技术和经验丰富的医生团队。',
    'home.hero.cta': '立即预约',
    'home.stats.experience': '年经验',
    'home.stats.customers': '满意客户',
    'home.stats.treatments': '治疗方法',
    'home.stats.locations': '诊所',
    
    // About page
    'about.title': '关于Nadala美容诊所',
    'about.hero.title': '自然美丽的起源地',
    'about.intro.title': 'Nadala美容诊所',
    'about.intro.content1': '不仅仅是一家皮肤科和水疗诊所。这里是自然美丽的诞生地，每一寸肌肤都被用心聆听、呵护和培育。',
    'about.intro.content2': '拥有皮肤科医生和美容专家团队，Nadala不仅仅是护肤，更是皮肤科治疗与医学美容相结合的艺术，是现代皮肤科学、先进技术与每个步骤中的奉献精神的完美结合。',
    'about.mission.title': '我们的使命',
    'about.mission.content': '为每位客户带来的不仅仅是美丽的肌肤，更是自信、快乐和更好的生活质量，通过最优质的护肤解决方案。',
    'about.team.title': '我们的医疗团队',
    'about.team.subtitle': '皮肤科和美容领域的顶尖专家，始终致力于提供最佳服务',
    'about.facilities.title': '设施',
    'about.facilities.subtitle': '现代化诊所设计，配备完善的先进医疗设备，确保安全专业的治疗环境',
    
    // Services
    'services.title': '专业服务',
    'services.subtitle': '我们提供从基础到高级的全面护肤服务',
    'services.acne.title': '痤疮治疗',
    'services.acne.desc': '现代、安全、有效的痤疮治疗方法',
    'services.facial.title': '面部护理',
    'services.facial.desc': '深层清洁、去角质和保湿',
    'services.laser.title': '激光治疗',
    'services.laser.desc': '先进激光技术用于再生和皮肤治疗',
    'services.melasma.title': '黄褐斑治疗',
    'services.melasma.desc': '有效安全的黄褐斑治疗方法',
    
    // Products
    'products.title': '正品产品',
    'products.subtitle': '医生推荐的高品质护肤产品',
    'products.skincare': '护肤',
    'products.sunscreen': '防晒霜',
    'products.treatment': '治疗',
    'products.serum': '精华',
    'products.moisturizer': '保湿霜',
    'products.cleanser': '洁面乳',
    
    // Booking
    'booking.title': '预约',
    'booking.subtitle': '安排与皮肤科医生的咨询和检查',
    'booking.select_service': '选择服务',
    'booking.select_doctor': '选择医生',
    'booking.select_date': '选择日期',
    'booking.select_time': '选择时间',
    'booking.confirm': '确认预约',
    
    // Reviews
    'reviews.title': '客户评价',
    'reviews.subtitle': '来自体验过我们服务的客户的真实分享',
    'reviews.write_review': '写评价',
    'reviews.rating': '评分',
    'reviews.comment': '评论',
    
    // Contact
    'contact.title': '联系我们',
    'contact.subtitle': '联系我们获得最佳咨询和支持',
    'contact.info': '联系信息',
    'contact.form': '发送消息',
    'contact.location': '位置',
    'contact.hours': '工作时间：上午8:00 - 晚上8:00（周一至周日）',
    
    // Common
    'common.book_now': '立即预约',
    'common.learn_more': '了解更多',
    'common.contact_us': '联系我们',
    'common.view_details': '查看详情',
    'common.phone': '电话',
    'common.email': '邮箱',
    'common.address': '地址',
    'common.working_hours': '工作时间',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.add': '添加',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.export': '导出',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '成功',
    'common.confirm': '确认',
    'common.close': '关闭',
    
    // Admin
    'admin.title': '系统管理',
    'admin.dashboard': '仪表板',
    'admin.content': '内容管理',
    'admin.products': '产品管理',
    'admin.bookings': '预约管理',
    'admin.reviews': '评价管理',
    'admin.users': '用户管理',
    'admin.settings': '设置',
    'admin.logout': '退出',
    
    // Forms
    'form.name': '姓名',
    'form.phone': '电话号码',
    'form.email': '邮箱',
    'form.message': '消息',
    'form.service': '服务',
    'form.date': '日期',
    'form.time': '时间',
    'form.submit': '提交',
    'form.required': '必填字段',
    'form.invalid_email': '无效邮箱',
    'form.invalid_phone': '无效电话号码',
    
    // Social sharing
    'social.share': '分享',
    'social.share_facebook': '分享到Facebook',
    'social.share_instagram': '分享到Instagram',
    'social.share_zalo': '分享到Zalo',
    
    // Footer
    'footer.about': '快速链接',
    'footer.services': '服务',
    'footer.contact': '与我们联系',
    'footer.follow': '关注我们',
    'footer.copyright': '© 2025 Nadala美容诊所。保留所有权利。',
    'footer.newsletter': '订阅以获取最新护肤信息',
    'footer.share_website': '分享网站:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': '隐私政策',
    'footer.terms': '使用条款',
    'footer.refund': '退款政策',
    'footer.faq': '常见问题',
  },
  ja: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'ホーム',
    'nav.about': '私たちについて',
    'nav.services': 'サービス',
    'nav.products': '製品',
    'nav.booking': '予約',
    'nav.reviews': 'レビュー',
    'nav.contact': 'お問い合わせ',
    'nav.admin': '管理',
    
    // Home page
    'home.hero.title': '完全な信頼 - 自信に満ちた輝き',
    'home.hero.subtitle': '15年の経験を持つ大手皮膚科クリニック',
    'home.hero.description': '先進技術と経験豊富な医師による皮膚科治療と医療美容を専門としています。',
    'home.hero.cta': '今すぐ予約',
    'home.stats.experience': '年の経験',
    'home.stats.customers': '満足した顧客',
    'home.stats.treatments': '治療法',
    'home.stats.locations': '施設',
    
    // About page
    'about.title': 'Nadala美容クリニックについて',
    'about.hero.title': '自然な美しさが始まる場所',
    'about.intro.title': 'Nadala美容クリニック',
    'about.intro.content1': 'は単なる皮膚科とスパのクリニックではありません。ここは自然な美しさの発祥地であり、すべての肌が心と専門知識で聞かれ、ケアされ、育まれる場所です。',
    'about.intro.content2': '皮膚科医と美容専門家のチームを持つNadalaは、単なるスキンケアではなく、皮膚科治療と医療美容を組み合わせる芸術であり、現代の皮膚科学、先進技術、そしてすべての手順における献身の完璧な組み合わせです。',
    'about.mission.title': '私たちの使命',
    'about.mission.content': '各顧客に美しい肌だけでなく、自信、喜び、そして最適なスキンケアソリューションを通じてより良い生活の質をもたらすこと。',
    'about.team.title': '私たちの医療チーム',
    'about.team.subtitle': '皮膚科と美容分野のトップエキスパートが、常に最高のサービスを提供することに専念',
    'about.facilities.title': '施設',
    'about.facilities.subtitle': '完備された先進医療機器を備えた現代的なクリニック設計で、安全で専門的な治療環境を保証',
    
    // Services
    'services.title': '専門サービス',
    'services.subtitle': '基本から高度まで包括的なスキンケアサービスを提供',
    'services.acne.title': 'ニキビ治療',
    'services.acne.desc': '現代的で安全で効果的なニキビ治療法',
    'services.facial.title': 'フェイシャルケア',
    'services.facial.desc': 'ディープクレンジング、角質除去、保湿',
    'services.laser.title': 'レーザー治療',
    'services.laser.desc': '若返りと皮膚治療のための先進レーザー技術',
    'services.melasma.title': 'シミ治療',
    'services.melasma.desc': '効果的で安全なシミ治療法',
    
    // Products
    'products.title': '正規品',
    'products.subtitle': '医師推奨の高品質スキンケア製品',
    'products.skincare': 'スキンケア',
    'products.sunscreen': '日焼け止め',
    'products.treatment': '治療',
    'products.serum': '美容液',
    'products.moisturizer': '保湿剤',
    'products.cleanser': 'クレンザー',
    
    // Booking
    'booking.title': '予約',
    'booking.subtitle': '皮膚科医との相談と検査をスケジュール',
    'booking.select_service': 'サービスを選択',
    'booking.select_doctor': '医師を選択',
    'booking.select_date': '日付を選択',
    'booking.select_time': '時間を選択',
    'booking.confirm': '予約を確認',
    
    // Reviews
    'reviews.title': '顧客レビュー',
    'reviews.subtitle': '私たちのサービスを体験した顧客からの正直なシェア',
    'reviews.write_review': 'レビュー��書く',
    'reviews.rating': '評価',
    'reviews.comment': 'コメント',
    
    // Contact
    'contact.title': 'お問い合わせ',
    'contact.subtitle': '最高の相談とサポートについてお問い合わせください',
    'contact.info': 'お問い合わせ情報',
    'contact.form': 'メッセージを送信',
    'contact.location': '場所',
    'contact.hours': '営業時間：午前8:00 - 午後8:00（月曜日 - 日曜日）',
    
    // Common
    'common.book_now': '今すぐ予約',
    'common.learn_more': '詳細を見る',
    'common.contact_us': 'お問い合わせ',
    'common.view_details': '詳細を表示',
    'common.phone': '電話',
    'common.email': 'メール',
    'common.address': '住所',
    'common.working_hours': '営業時間',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.add': '追加',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.export': 'エクスポート',
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.success': '成功',
    'common.confirm': '確認',
    'common.close': '閉じる',
    
    // Admin
    'admin.title': 'システム管理',
    'admin.dashboard': 'ダッシュボード',
    'admin.content': 'コンテンツ管理',
    'admin.products': '製品管理',
    'admin.bookings': '予約管理',
    'admin.reviews': 'レビュー管理',
    'admin.users': 'ユーザー管理',
    'admin.settings': '設定',
    'admin.logout': 'ログアウト',
    
    // Forms
    'form.name': '氏名',
    'form.phone': '電話番号',
    'form.email': 'メール',
    'form.message': 'メッセージ',
    'form.service': 'サービス',
    'form.date': '日付',
    'form.time': '時間',
    'form.submit': '送信',
    'form.required': '必須フィールド',
    'form.invalid_email': '無効なメール',
    'form.invalid_phone': '無効な電話番号',
    
    // Social sharing
    'social.share': 'シェア',
    'social.share_facebook': 'Facebookでシェア',
    'social.share_instagram': 'Instagramでシェア',
    'social.share_zalo': 'Zaloでシェア',
    
    // Footer
    'footer.about': 'クイックリンク',
    'footer.services': 'サービス',
    'footer.contact': 'お問い合わせ',
    'footer.follow': 'フォローしてください',
    'footer.copyright': '© 2025 Nadala美容クリニック。全権利保有。',
    'footer.newsletter': '最新のスキンケア情報を受け取るために購読',
    'footer.share_website': 'ウェブサイトをシェア:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.refund': '返金ポリシー',
    'footer.faq': 'よくある質問',
  },
  ko: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.services': '서비스',
    'nav.products': '제품',
    'nav.booking': '예약',
    'nav.reviews': '리뷰',
    'nav.contact': '연락처',
    'nav.admin': '관리',
    
    // Home page
    'home.hero.title': '완전한 신뢰 - 자신감 있는 빛남',
    'home.hero.subtitle': '15년 경험의 선도적인 피부과 클리닉',
    'home.hero.description': '첨단 기술과 경험 많은 의사들과 함께하는 피부과 치료 및 의료 미용 전문.',
    'home.hero.cta': '지금 예약',
    'home.stats.experience': '년 경험',
    'home.stats.customers': '만족한 고객',
    'home.stats.treatments': '치료 방법',
    'home.stats.locations': '시설',
    
    // About page
    'about.title': 'Nadala 뷰티 클리닉 소개',
    'about.hero.title': '자연스러운 아름다움이 시작되는 곳',
    'about.intro.title': 'Nadala 뷰티 클리닉',
    'about.intro.content1': '은 단순한 피부과와 스파 클리닉 그 이상입니다. 이곳은 자연스러운 아름다움의 탄생지이며, 모든 피부가 마음과 전문 지식으로 들어지고, 돌봄 받고, 양육되는 곳입니다.',
    'about.intro.content2': '피부과 의사와 미용 전문가 팀을 가진 Nadala는 단순한 스킨케어가 아니라 피부과 치료와 의료 미용을 결합하는 예술이며, 현대 피부과학, 첨단 기술, 그리고 모든 절차에서의 헌신의 완벽한 조합입니다.',
    'about.mission.title': '우리의 사명',
    'about.mission.content': '각 고객에게 아름다운 피부뿐만 아니라 자신감, 기쁨, 그리고 최적의 스킨케어 솔루션을 통한 더 나은 삶의 질을 제공하는 것.',
    'about.team.title': '우리의 의료진',
    'about.team.subtitle': '피부과 및 미용 분야의 최고 전문가들이 항상 최고의 서비스 제공에 전념',
    'about.facilities.title': '시설',
    'about.facilities.subtitle': '완비된 첨단 의료 장비를 갖춘 현대적인 클리닉 설계로 안전하고 전문적인 치료 환경 보장',
    
    // Services
    'services.title': '전문 서비스',
    'services.subtitle': '기본부터 고급까지 포괄적인 스킨케어 서비스 제공',
    'services.acne.title': '여드름 치료',
    'services.acne.desc': '현대적이고 안전하며 효과적인 여드름 치료법',
    'services.facial.title': '페이셜 케어',
    'services.facial.desc': '딥 클렌징, 각질 제거, 보습',
    'services.laser.title': '레이저 치료',
    'services.laser.desc': '젊어짐과 피부 치료를 위한 첨단 레이저 기술',
    'services.melasma.title': '기미 치료',
    'services.melasma.desc': '효과적이고 안전한 기미 치료법',
    
    // Products
    'products.title': '정품 제품',
    'products.subtitle': '의사 추천 고품질 스킨케어 제품',
    'products.skincare': '스킨케어',
    'products.sunscreen': '선크림',
    'products.treatment': '치료',
    'products.serum': '세럼',
    'products.moisturizer': '모이스처라이저',
    'products.cleanser': '클렌저',
    
    // Booking
    'booking.title': '예약',
    'booking.subtitle': '피부과 의사와의 상담 및 검진 일정',
    'booking.select_service': '서비스 선택',
    'booking.select_doctor': '의사 선택',
    'booking.select_date': '날짜 선택',
    'booking.select_time': '시간 선택',
    'booking.confirm': '예약 확인',
    
    // Reviews
    'reviews.title': '고객 리뷰',
    'reviews.subtitle': '우리 서비스를 경험한 고객들의 솔직한 공유',
    'reviews.write_review': '리뷰 작성',
    'reviews.rating': '평점',
    'reviews.comment': '댓글',
    
    // Contact
    'contact.title': '연락처',
    'contact.subtitle': '최고의 상담과 지원을 위해 연락하세요',
    'contact.info': '연락처 정보',
    'contact.form': '메시지 보내기',
    'contact.location': '위치',
    'contact.hours': '운영 시간: 오전 8:00 - 오후 8:00 (월요일 - 일요일)',
    
    // Common
    'common.book_now': '지금 예약',
    'common.learn_more': '더 알아보기',
    'common.contact_us': '연락하기',
    'common.view_details': '자세히 보기',
    'common.phone': '전화',
    'common.email': '이메일',
    'common.address': '주소',
    'common.working_hours': '운영 시간',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.add': '추가',
    'common.search': '검색',
    'common.filter': '필터',
    'common.export': '내보내기',
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.success': '성공',
    'common.confirm': '확인',
    'common.close': '닫기',
    
    // Admin
    'admin.title': '시스템 관리',
    'admin.dashboard': '대시보드',
    'admin.content': '콘텐츠 관리',
    'admin.products': '제품 관리',
    'admin.bookings': '예약 관리',
    'admin.reviews': '리뷰 관리',
    'admin.users': '사용자 관리',
    'admin.settings': '설정',
    'admin.logout': '로그아웃',
    
    // Forms
    'form.name': '이름',
    'form.phone': '전화번호',
    'form.email': '이메일',
    'form.message': '메시지',
    'form.service': '서비스',
    'form.date': '날짜',
    'form.time': '시간',
    'form.submit': '제출',
    'form.required': '필수 필드',
    'form.invalid_email': '잘못된 이메일',
    'form.invalid_phone': '잘못된 전화번호',
    
    // Social sharing
    'social.share': '공유',
    'social.share_facebook': 'Facebook에서 공유',
    'social.share_instagram': 'Instagram에서 공유',
    'social.share_zalo': 'Zalo에서 공유',
    
    // Footer
    'footer.about': '빠른 링크',
    'footer.services': '서비스',
    'footer.contact': '연락하기',
    'footer.follow': '팔로우하기',
    'footer.copyright': '© 2025 Nadala 뷰티 클리닉. 모든 권리 보유.',
    'footer.newsletter': '최신 스킨케어 정보를 받기 위해 구독',
    'footer.share_website': '웹사이트 공유:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': '개인정보 처리방침',
    'footer.terms': '이용약관',
    'footer.refund': '환불 정책',
    'footer.faq': '자주 묻는 질문',
  },
  th: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'หน้าหลัก',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.services': 'บริการ',
    'nav.products': 'ผลิตภัณฑ์',
    'nav.booking': 'จองนัด',
    'nav.reviews': 'รีวิว',
    'nav.contact': 'ติดต่อ',
    'nav.admin': 'จัดการ',
    
    // Home page
    'home.hero.title': 'ไว้วางใจเต็มที่ - ส่องประกายด้วยความมั่นใจ',
    'home.hero.subtitle': 'คลินิกผิวหนังชั้นนำที่มีประสบการณ์ 15 ปี',
    'home.hero.description': 'เชี่ยวชาญด้านการรักษาผิวหนังและความงามทางการแพทย์ด้วยเทคโนโลยีล้ำสมัยและแพทย์ผู้เชี่ยวชาญ',
    'home.hero.cta': 'จองเลย',
    'home.stats.experience': 'ปีประสบการณ์',
    'home.stats.customers': 'ลูกค้าพึงพอใจ',
    'home.stats.treatments': 'วิธีการรักษา',
    'home.stats.locations': 'สาขา',
    
    // About page
    'about.title': 'เกี่ยวกับ Nadala Beauty Clinic',
    'about.hero.title': 'ที่ซึ่งความงามธรรมชาติเริ่มต้น',
    'about.intro.title': 'Nadala Beauty Clinic',
    'about.intro.content1': 'ไม่ใช่เพียงแค่คลินิกผิวหนังและสปา แต่เป็นต้นกำเนิดของความงามธรรมชาติ ที่ซึ่งทุกผิวหนังได้รับการฟัง การดูแล และการบำรุงด้วยใจและความเชี่ยวชาญ',
    'about.intro.content2': 'ด้วยทีมแพทย์ผิวหนังและผู้เชี่ยวชาญด้านความงาม Nadala ไม่ใช่เพียงการดูแลผิว แต่เป็นศิลปะของการผสมผสานระหว่างการรักษาผิวหนังและความงามทางการแพทย์ ระหว่างวิทยาศาสตร์ผิวหนังสมัยใหม่ เทคโนโลยีล้ำสมัย และความทุ่มเทในทุกขั้นตอน',
    'about.mission.title': 'พันธกิจของเรา',
    'about.mission.content': 'มอบให้แต่ละลูกค้าไม่เพียงแค่ผิวที่สวยงาม แต่ยังเป็นความมั่นใจ ความสุข และคุณภาพชีวิตที่ดีขึ้นผ่านโซลูชันการดูแลผิวที่เหมาะสมที่สุด',
    'about.team.title': 'ทีมแพทย์ของเรา',
    'about.team.subtitle': 'ผู้เชี่ยวชาญชั้นนำในด้านผิวหนังและความงาม ที่มุ่งมั่นในการให้บริการที่ดีที่สุดเสมอ',
    'about.facilities.title': 'สิ่งอำนวยความสะดวก',
    'about.facilities.subtitle': 'การออกแบบคลินิกที่ทันสมัยพร้อมอุปกรณ์ทางการแพทย์ล้ำสมัยครบครัน รับประกันสภาพแวดล้อมการรักษาที่ปลอดภัยและเป็นมืออาชีพ',
    
    // Services
    'services.title': 'บริการมืออาชีพ',
    'services.subtitle': 'เรามีบริการดูแลผิวครบครันตั้งแต่พื้นฐานจนถึงขั้นสูง',
    'services.acne.title': 'การรักษาสิว',
    'services.acne.desc': 'วิธีการรักษาสิวที่ทันสมัย ปลอดภัย และมีประสิทธิภาพ',
    'services.facial.title': 'การดูแลผิวหน้า',
    'services.facial.desc': 'ทำความสะอาดลึก ขัดผิว และให้ความชุ่มชื้น',
    'services.laser.title': 'การรักษาด้วยเลเซอร์',
    'services.laser.desc': 'เทคโนโลยีเลเซอร์ล้ำสมัยสำหรับการฟื้นฟูและรักษาผิว',
    'services.melasma.title': 'การรักษาฝ้า',
    'services.melasma.desc': 'วิธีการรักษาฝ้าที่มีประสิทธิภาพและปลอดภัย',
    
    // Products
    'products.title': 'ผลิตภัณฑ์แท้',
    'products.subtitle': 'ผลิตภัณฑ์ดูแลผิวคุณภาพสูงที่แพทย์แนะนำ',
    'products.skincare': 'ดูแลผิว',
    'products.sunscreen': 'ครีมกันแดด',
    'products.treatment': 'การรักษา',
    'products.serum': 'เซรั่ม',
    'products.moisturizer': 'ครีมบำรุง',
    'products.cleanser': 'ครีมล้างหน้า',
    
    // Booking
    'booking.title': 'จองนัดหมาย',
    'booking.subtitle': 'นัดหมายปรึกษาและตรวจกับแพทย์ผิวหนัง',
    'booking.select_service': 'เลือกบริการ',
    'booking.select_doctor': 'เลือกแพทย์',
    'booking.select_date': 'เลือกวันที่',
    'booking.select_time': 'เลือกเวลา',
    'booking.confirm': 'ยืนยันการจอง',
    
    // Reviews
    'reviews.title': 'รีวิวลูกค้า',
    'reviews.subtitle': 'การแชร์ที่จริงใจจากลูกค้าที่ได้รับประสบการณ์บริการของเรา',
    'reviews.write_review': 'เขียนรีวิว',
    'reviews.rating': 'คะแนน',
    'reviews.comment': 'ความคิดเห็น',
    
    // Contact
    'contact.title': 'ติดต่อเรา',
    'contact.subtitle': 'ติดต่อเราเพื่อรับคำปรึกษาและการสนับสนุนที่ดีที่สุด',
    'contact.info': 'ข้อมูลติดต่อ',
    'contact.form': 'ส่งข้อความ',
    'contact.location': 'ที่ตั้ง',
    'contact.hours': 'เวลาทำการ: 08:00 - 20:00 น. (จันทร์ - อาทิตย์)',
    
    // Common
    'common.book_now': 'จองเลย',
    'common.learn_more': 'เรียนรู้เพิ่มเติม',
    'common.contact_us': 'ติดต่���เรา',
    'common.view_details': 'ดูรายละเอียด',
    'common.phone': 'โทรศัพท์',
    'common.email': 'อีเมล',
    'common.address': 'ที่อยู่',
    'common.working_hours': 'เวลาทำการ',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.add': 'เพิ่ม',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.export': 'ส่งออก',
    'common.loading': 'กำลังโหลด...',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.confirm': 'ยืนยัน',
    'common.close': 'ปิด',
    
    // Admin
    'admin.title': 'การจัดการระบบ',
    'admin.dashboard': 'แดชบอร์ด',
    'admin.content': 'จัดการเนื้อหา',
    'admin.products': 'จัดการผลิตภัณฑ์',
    'admin.bookings': 'จัดการการจอง',
    'admin.reviews': 'จัดการรีวิว',
    'admin.users': 'จัดการผู้ใช้',
    'admin.settings': 'การตั้งค่า',
    'admin.logout': 'ออกจากระบบ',
    
    // Forms
    'form.name': 'ชื่อ-นามสกุล',
    'form.phone': 'หมายเลขโทรศัพท์',
    'form.email': 'อีเมล',
    'form.message': 'ข้อความ',
    'form.service': 'บริการ',
    'form.date': 'วันที่',
    'form.time': 'เวลา',
    'form.submit': 'ส่ง',
    'form.required': 'ช่องที่จำเป็น',
    'form.invalid_email': 'อีเมลไม่ถูกต้อง',
    'form.invalid_phone': 'หมายเลขโทรศัพท์ไม่ถูกต้อง',
    
    // Social sharing
    'social.share': 'แชร์',
    'social.share_facebook': 'แชร์บน Facebook',
    'social.share_instagram': 'แชร์บน Instagram',
    'social.share_zalo': 'แชร์บน Zalo',
    
    // Footer
    'footer.about': 'ลิงก์ด่วน',
    'footer.services': 'บริการ',
    'footer.contact': 'ติดต่อเรา',
    'footer.follow': 'ติดตามเรา',
    'footer.copyright': '© 2025 Nadala Beauty Clinic สงวนลิขสิทธิ์',
    'footer.newsletter': 'สมัครรับข้อมูลดูแลผิวล่าสุด',
    'footer.share_website': 'แชร์เว็บไซต์:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'นโยบายความเป็นส่วนตัว',
    'footer.terms': 'เงื่อนไขการใช้งาน',
    'footer.refund': 'นโยบายการคืนเงิน',
    'footer.faq': 'คำถามที่พบบ่อย',
  },
  fr: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.products': 'Produits',
    'nav.booking': 'Réservation',
    'nav.reviews': 'Avis',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    
    // Home page
    'home.hero.title': 'Confiance totale - Brillez avec assurance',
    'home.hero.subtitle': 'Clinique dermatologique leader avec 15 ans d\'expérience',
    'home.hero.description': 'Spécialisé dans les traitements dermatologiques et l\'esthétique médicale avec une technologie avancée et des médecins expérimentés.',
    'home.hero.cta': 'Réserver maintenant',
    'home.stats.experience': 'Années d\'expérience',
    'home.stats.customers': 'Clients satisfaits',
    'home.stats.treatments': 'Méthodes de traitement',
    'home.stats.locations': 'Établissements',
    
    // About page
    'about.title': 'À propos de Nadala Beauty Clinic',
    'about.hero.title': 'Où commence la beauté naturelle',
    'about.intro.title': 'Nadala Beauty Clinic',
    'about.intro.content1': 'n\'est pas seulement une clinique dermatologique et spa. C\'est le berceau de la beauté naturelle, où chaque peau est écoutée, soignée et nourrie avec le cœur et l\'expertise.',
    'about.intro.content2': 'Avec une équipe de dermatologues et de spécialistes esthétiques, Nadala n\'est pas seulement un soin de la peau mais l\'art de combiner traitement dermatologique et esthétique médicale, entre science dermatologique moderne, technologie avancée et dévouement dans chaque procédure.',
    'about.mission.title': 'Notre mission',
    'about.mission.content': 'Apporter à chaque client non seulement une belle peau mais aussi la confiance, la joie et une meilleure qualité de vie grâce aux solutions de soins cutanés optimales.',
    'about.team.title': 'Notre équipe médicale',
    'about.team.subtitle': 'Experts de premier plan en dermatologie et esthétique, toujours dédiés à fournir le meilleur service',
    'about.facilities.title': 'Installations',
    'about.facilities.subtitle': 'Conception de clinique moderne avec équipements médicaux avancés complets, garantissant un environnement de traitement sûr et professionnel',
    
    // Services
    'services.title': 'Services professionnels',
    'services.subtitle': 'Nous fournissons des services de soins de la peau complets du basique à l\'avancé',
    'services.acne.title': 'Traitement de l\'acné',
    'services.acne.desc': 'Méthodes de traitement de l\'acné modernes, sûres et efficaces',
    'services.facial.title': 'Soins du visage',
    'services.facial.desc': 'Nettoyage en profondeur, exfoliation et hydratation',
    'services.laser.title': 'Traitement au laser',
    'services.laser.desc': 'Technologie laser avancée pour le rajeunissement et le traitement de la peau',
    'services.melasma.title': 'Traitement du mélasma',
    'services.melasma.desc': 'Méthodes de traitement du mélasma efficaces et sûres',
    
    // Products
    'products.title': 'Produits authentiques',
    'products.subtitle': 'Produits de soins de la peau de haute qualité recommandés par les médecins',
    'products.skincare': 'Soins de la peau',
    'products.sunscreen': 'Crème solaire',
    'products.treatment': 'Traitement',
    'products.serum': 'Sérum',
    'products.moisturizer': 'Hydratant',
    'products.cleanser': 'Nettoyant',
    
    // Booking
    'booking.title': 'Prendre rendez-vous',
    'booking.subtitle': 'Programmer une consultation et un examen avec des dermatologues',
    'booking.select_service': 'Sélectionner le service',
    'booking.select_doctor': 'Sélectionner le médecin',
    'booking.select_date': 'Sélectionner la date',
    'booking.select_time': 'Sélectionner l\'heure',
    'booking.confirm': 'Confirmer la réservation',
    
    // Reviews
    'reviews.title': 'Avis clients',
    'reviews.subtitle': 'Partages honnêtes de clients qui ont vécu nos services',
    'reviews.write_review': 'Écrire un avis',
    'reviews.rating': 'Évaluation',
    'reviews.comment': 'Commentaire',
    
    // Contact
    'contact.title': 'Nous contacter',
    'contact.subtitle': 'Contactez-nous pour les meilleures consultations et support',
    'contact.info': 'Informations de contact',
    'contact.form': 'Envoyer un message',
    'contact.location': 'Emplacement',
    'contact.hours': 'Heures d\'ouverture : 8h00 - 20h00 (Lundi - Dimanche)',
    
    // Common
    'common.book_now': 'Réserver maintenant',
    'common.learn_more': 'En savoir plus',
    'common.contact_us': 'Nous contacter',
    'common.view_details': 'Voir les détails',
    'common.phone': 'Téléphone',
    'common.email': 'Email',
    'common.address': 'Adresse',
    'common.working_hours': 'Heures d\'ouverture',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur s\'est produite',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.close': 'Fermer',
    
    // Admin
    'admin.title': 'Administration système',
    'admin.dashboard': 'Tableau de bord',
    'admin.content': 'Gestion de contenu',
    'admin.products': 'Gestion des produits',
    'admin.bookings': 'Gestion des réservations',
    'admin.reviews': 'Gestion des avis',
    'admin.users': 'Gestion des utilisateurs',
    'admin.settings': 'Paramètres',
    'admin.logout': 'Déconnexion',
    
    // Forms
    'form.name': 'Nom complet',
    'form.phone': 'Numéro de téléphone',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.service': 'Service',
    'form.date': 'Date',
    'form.time': 'Heure',
    'form.submit': 'Soumettre',
    'form.required': 'Champ requis',
    'form.invalid_email': 'Email invalide',
    'form.invalid_phone': 'Numéro de téléphone invalide',
    
    // Social sharing
    'social.share': 'Partager',
    'social.share_facebook': 'Partager sur Facebook',
    'social.share_instagram': 'Partager sur Instagram',
    'social.share_zalo': 'Partager sur Zalo',
    
    // Footer
    'footer.about': 'Liens rapides',
    'footer.services': 'Services',
    'footer.contact': 'Nous contacter',
    'footer.follow': 'Suivez-nous',
    'footer.copyright': '© 2025 Nadala Beauty Clinic. Tous droits réservés.',
    'footer.newsletter': 'Abonnez-vous pour recevoir les dernières informations sur les soins de la peau',
    'footer.share_website': 'Partager le site web:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.refund': 'Politique de remboursement',
    'footer.faq': 'FAQ',
  },
  es: {
    // Language names
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'lang.zh': '中文',
    'lang.ja': '日本語',
    'lang.ko': '한국어',
    'lang.th': 'ไทย',
    'lang.fr': 'Français',
    'lang.es': 'Español',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.services': 'Servicios',
    'nav.products': 'Productos',
    'nav.booking': 'Reservar',
    'nav.reviews': 'Reseñas',
    'nav.contact': 'Contacto',
    'nav.admin': 'Administración',
    
    // Home page
    'home.hero.title': 'Confianza completa - Brilla con seguridad',
    'home.hero.subtitle': 'Clínica dermatológica líder con 15 años de experiencia',
    'home.hero.description': 'Especializada en tratamientos dermatológicos y estética médica con tecnología avanzada y médicos experimentados.',
    'home.hero.cta': 'Reservar ahora',
    'home.stats.experience': 'Años de experiencia',
    'home.stats.customers': 'Clientes satisfechos',
    'home.stats.treatments': 'Métodos de tratamiento',
    'home.stats.locations': 'Instalaciones',
    
    // About page
    'about.title': 'Acerca de Nadala Beauty Clinic',
    'about.hero.title': 'Donde comienza la belleza natural',
    'about.intro.title': 'Nadala Beauty Clinic',
    'about.intro.content1': 'no es solo una clínica dermatológica y spa. Es el lugar de nacimiento de la belleza natural, donde cada piel es escuchada, cuidada y nutrida con corazón y experiencia.',
    'about.intro.content2': 'Con un equipo de dermatólogos y especialistas en estética, Nadala no es solo sobre el cuidado de la piel sino el arte de combinar tratamiento dermatológico y estética médica, entre ciencia dermatológica moderna, tecnología avanzada y dedicación en cada procedimiento.',
    'about.mission.title': 'Nuestra misión',
    'about.mission.content': 'Brindar a cada cliente no solo piel hermosa sino también confianza, alegría y mejor calidad de vida a través de soluciones óptimas de cuidado de la piel.',
    'about.team.title': 'Nuestro equipo médico',
    'about.team.subtitle': 'Expertos líderes en dermatología y estética, siempre dedicados a brindar el mejor servicio',
    'about.facilities.title': 'Instalaciones',
    'about.facilities.subtitle': 'Diseño de clínica moderno con equipos médicos avanzados completos, garantizando un ambiente de tratamiento seguro y profesional',
    
    // Services
    'services.title': 'Servicios profesionales',
    'services.subtitle': 'Proporcionamos servicios integrales de cuidado de la piel desde básico hasta avanzado',
    'services.acne.title': 'Tratamiento del acné',
    'services.acne.desc': 'Métodos de tratamiento del acné modernos, seguros y efectivos',
    'services.facial.title': 'Cuidado facial',
    'services.facial.desc': 'Limpieza profunda, exfoliación e hidratación',
    'services.laser.title': 'Tratamiento láser',
    'services.laser.desc': 'Tecnología láser avanzada para rejuvenecimiento y tratamiento de la piel',
    'services.melasma.title': 'Tratamiento del melasma',
    'services.melasma.desc': 'Métodos de tratamiento del melasma efectivos y seguros',
    
    // Products
    'products.title': 'Productos auténticos',
    'products.subtitle': 'Productos de cuidado de la piel de alta calidad recomendados por médicos',
    'products.skincare': 'Cuidado de la piel',
    'products.sunscreen': 'Protector solar',
    'products.treatment': 'Tratamiento',
    'products.serum': 'Suero',
    'products.moisturizer': 'Hidratante',
    'products.cleanser': 'Limpiador',
    
    // Booking
    'booking.title': 'Reservar cita',
    'booking.subtitle': 'Programar consulta y examen con dermatólogos',
    'booking.select_service': 'Seleccionar servicio',
    'booking.select_doctor': 'Seleccionar médico',
    'booking.select_date': 'Seleccionar fecha',
    'booking.select_time': 'Seleccionar hora',
    'booking.confirm': 'Confirmar reserva',
    
    // Reviews
    'reviews.title': 'Reseñas de clientes',
    'reviews.subtitle': 'Compartir honesto de clientes que han experimentado nuestros servicios',
    'reviews.write_review': 'Escribir reseña',
    'reviews.rating': 'Calificación',
    'reviews.comment': 'Comentario',
    
    // Contact
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Ponte en contacto para la mejor consulta y apoyo',
    'contact.info': 'Información de contacto',
    'contact.form': 'Enviar mensaje',
    'contact.location': 'Ubicación',
    'contact.hours': 'Horario de atención: 8:00 AM - 8:00 PM (Lunes - Domingo)',
    
    // Common
    'common.book_now': 'Reservar ahora',
    'common.learn_more': 'Saber más',
    'common.contact_us': 'Contáctanos',
    'common.view_details': 'Ver detalles',
    'common.phone': 'Teléfono',
    'common.email': 'Email',
    'common.address': 'Dirección',
    'common.working_hours': 'Horario de atención',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',
    
    // Admin
    'admin.title': 'Administración del sistema',
    'admin.dashboard': 'Panel de control',
    'admin.content': 'Gestión de contenido',
    'admin.products': 'Gestión de productos',
    'admin.bookings': 'Gestión de reservas',
    'admin.reviews': 'Gestión de reseñas',
    'admin.users': 'Gestión de usuarios',
    'admin.settings': 'Configuración',
    'admin.logout': 'Cerrar sesión',
    
    // Forms
    'form.name': 'Nombre completo',
    'form.phone': 'Número de teléfono',
    'form.email': 'Email',
    'form.message': 'Mensaje',
    'form.service': 'Servicio',
    'form.date': 'Fecha',
    'form.time': 'Hora',
    'form.submit': 'Enviar',
    'form.required': 'Campo requerido',
    'form.invalid_email': 'Email inválido',
    'form.invalid_phone': 'Número de teléfono inválido',
    
    // Social sharing
    'social.share': 'Compartir',
    'social.share_facebook': 'Compartir en Facebook',
    'social.share_instagram': 'Compartir en Instagram',
    'social.share_zalo': 'Compartir en Zalo',
    
    // Footer
    'footer.about': 'Enlaces rápidos',
    'footer.services': 'Servicios',
    'footer.contact': 'Contáctanos',
    'footer.follow': 'Síguenos',
    'footer.copyright': '© 2025 Nadala Beauty Clinic. Todos los derechos reservados.',
    'footer.newsletter': 'Suscríbete para recibir la información más reciente sobre el cuidado de la piel',
    'footer.share_website': 'Compartir sitio web:',
    'footer.made_with': 'Made with',
    'footer.for_skin': 'for healthy skin',
    'footer.privacy': 'Política de privacidad',
    'footer.terms': 'Términos de uso',
    'footer.refund': 'Política de reembolso',
    'footer.faq': 'Preguntas frecuentes',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['vi', 'en', 'zh', 'ja', 'ko', 'th', 'fr', 'es'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Update document language for SEO
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}