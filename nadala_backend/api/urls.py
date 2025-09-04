from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, ServiceViewSet, OrderViewSet,
    ProductCategoryViewSet, AppointmentViewSet, OrderTypeViewSet,
    OrderDetailViewSet, ReviewViewSet, ContactViewSet,
    NewsViewSet, PageViewSet, OrderStatusHistoryViewSet,
    OrderShippingViewSet, AdminLogViewSet,TimeSlotViewSet,
    DoctorViewSet  # Thêm DoctorViewSet vào danh sách import
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'product-categories', ProductCategoryViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'order-types', OrderTypeViewSet)
router.register(r'order-details', OrderDetailViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'news', NewsViewSet)
router.register(r'pages', PageViewSet)
router.register(r'order-status-history', OrderStatusHistoryViewSet)
router.register(r'order-shipping', OrderShippingViewSet)
router.register(r'admin-logs', AdminLogViewSet)
router.register(r'doctors', DoctorViewSet)  # Thêm dòng này
router.register(r'time-slots', TimeSlotViewSet)

urlpatterns = router.urls