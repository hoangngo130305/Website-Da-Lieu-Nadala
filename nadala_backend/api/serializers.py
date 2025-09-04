# api/serializers.py
from rest_framework import serializers
from .models import (
    Role, User, ProductCategory, Product, Service, Appointment,
    OrderType, Order, OrderDetail, Review, Contact, News, Page,
    OrderStatusHistory, OrderShipping, AdminLog, Doctor, TimeSlot
)

# ===== Doctor =====
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

# ===== User & Role =====
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    """CRUD trực tiếp user (bao gồm password)"""
    class Meta:
        model = User
        fields = '__all__'

class SimpleUserSerializer(serializers.ModelSerializer):
    """Trả về thông tin user trong các model khác, không bao gồm password"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# ===== Product & Category =====
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        source='category',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = Product
        fields = '__all__'

# ===== Service =====
class ServiceSerializer(serializers.ModelSerializer):
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'price_display', 'image', 'created_at', 'updated_at', 'is_active', 'category']

    def get_price_display(self, obj):
        return f"{obj.price}đ"
# ===== Appointment =====
class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )
    doctor = DoctorSerializer(read_only=True)  # Trả về object Doctor khi đọc
    doctor_id = serializers.IntegerField(  # Nhận ID trực tiếp từ payload
        write_only=True,
        required=True
    )
    confirmed_by = SimpleUserSerializer(read_only=True)
    confirmed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='confirmed_by',
        write_only=True,
        allow_null=True,
        required=False
    )
    updated_by = SimpleUserSerializer(read_only=True)
    updated_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='updated_by',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = Appointment
        fields = '__all__'

def create(self, validated_data):
    print("Validated data:", validated_data)
    doctor_id = validated_data.pop('doctor_id')  # còn nguyên
    service = validated_data.pop('service')      # vì source='service'
    print("Doctor ID:", doctor_id, "Service ID:", service.id)

    validated_data['doctor_id'] = doctor_id
    validated_data['service_id'] = service.id

    request = self.context.get('request')
    if request and request.user.is_authenticated:
        validated_data['confirmed_by'] = request.user
        validated_data['updated_by'] = request.user
    return Appointment.objects.create(**validated_data)


def update(self, instance, validated_data):
    doctor_id = validated_data.pop('doctor_id', None)
    service = validated_data.pop('service', None)

    if doctor_id is not None:
        validated_data['doctor_id'] = doctor_id
    if service is not None:
        validated_data['service_id'] = service.id

    request = self.context.get('request')
    if request and request.user.is_authenticated:
        validated_data['updated_by'] = request.user
    return super().update(instance, validated_data)


# ===== Order & OrderDetail =====
class OrderTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderType
        fields = '__all__'

class OrderDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        allow_null=True,
        required=False
    )
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = OrderDetail
        fields = '__all__'

    def validate(self, attrs):
        product = attrs.get('product')
        service = attrs.get('service')
        if (product is None and service is None) or (product is not None and service is not None):
            raise serializers.ValidationError("OrderDetail must have exactly one of (product or service).")
        return attrs

class OrderSerializer(serializers.ModelSerializer):
    order_type = OrderTypeSerializer(read_only=True)
    order_type_id = serializers.PrimaryKeyRelatedField(
        queryset=OrderType.objects.all(),
        source='order_type',
        write_only=True
    )
    confirmed_by = SimpleUserSerializer(read_only=True)
    confirmed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='confirmed_by',
        write_only=True,
        allow_null=True,
        required=False
    )
    updated_by = SimpleUserSerializer(read_only=True)
    updated_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='updated_by',
        write_only=True,
        allow_null=True,
        required=False
    )
    details = OrderDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

# ===== Review =====
class ReviewSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True,
        allow_null=True,
        required=False
    )
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = Review
        fields = ['id', 'name', 'email', 'content', 'rating', 'product', 'product_id', 'service', 'service_id', 'created_at']
        extra_kwargs = {
            'name': {'required': True},
            'content': {'required': True},
            'rating': {'required': True},
            'email': {'required': False},
        }

    def validate(self, attrs):
        # Kiểm tra chỉ một trong product_id hoặc service_id có giá trị
        targets = [attrs.get('product'), attrs.get('service')]
        if targets.count(None) != 1:
            raise serializers.ValidationError(
                "Review must be linked to exactly one of (product, service)."
            )
        # Kiểm tra rating trong khoảng 1-5
        if not (1 <= attrs.get('rating', 0) <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return attrs

# ===== Contact, News, Page =====
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

# ===== Order Status History =====
class OrderStatusHistorySerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
        source='order',
        write_only=True
    )
    changed_by = SimpleUserSerializer(read_only=True)
    changed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='changed_by',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = OrderStatusHistory
        fields = '__all__'

# ===== Order Shipping =====
class OrderShippingSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
        source='order',
        write_only=True
    )

    class Meta:
        model = OrderShipping
        fields = '__all__'

# ===== Admin Log =====
class AdminLogSerializer(serializers.ModelSerializer):
    admin = SimpleUserSerializer(read_only=True)
    admin_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='admin',
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = AdminLog
        fields = '__all__'

# ===== TimeSlot =====
class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'time', 'is_available', 'created_at', 'updated_at']