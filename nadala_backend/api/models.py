from django.db import models
from django.contrib.auth.models import AbstractUser

# ================================
# USERS (Custom User Model)
# ================================
class Role(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "role"

    def __str__(self):
        return self.name


class User(AbstractUser):
    id = models.BigAutoField(primary_key=True)
    email = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.username


# ================================
# CATEGORY & PRODUCT
# ================================
class ProductCategory(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stock = models.IntegerField(default=0)
    image = models.CharField(max_length=255, null=True, blank=True)
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="category_id"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"

    def __str__(self):
        return self.name


# ================================
# SERVICES
# ================================

class Service(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, db_index=True, null=False)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    image = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    category = models.CharField(
        max_length=50,
        choices=[('dermatology', 'Da liễu'), ('spa', 'Spa & Thẩm mỹ')],
        default='dermatology',
        db_index=True
    )

    class Meta:
        db_table = "services"

    def __str__(self):
        return self.name
# ================================
# CUSTOMER & DOCTOR & TIMESLOT
# ================================
class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=20, null=False)
    email = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "customers"

    def __str__(self):
        return self.name


# api/models.py
from django.db import models

class Doctor(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    specialization = models.CharField(max_length=255, null=True, blank=True)
    image = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "doctors"

    def __str__(self):
        return self.name




# api/models.py
class TimeSlot(models.Model):
    id = models.AutoField(primary_key=True)
    time = models.CharField(max_length=10, null=False, help_text='Khung giờ (VD: "08:00")')
    is_available = models.BooleanField(default=True, help_text='Trạng thái sẵn có')
    created_at = models.DateTimeField(auto_now_add=True, help_text='Thời gian tạo')
    updated_at = models.DateTimeField(auto_now=True, help_text='Thời gian cập nhật')

    class Meta:
        db_table = "time_slots"

    def __str__(self):
        return self.time



# ================================
# APPOINTMENT
# ================================
class Appointment(models.Model):
    id = models.AutoField(primary_key=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, db_column="service_id")
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE, db_column="doctor_id")
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20, null=True, blank=True)

    customer_email = models.CharField(max_length=255, null=True, blank=True)
    customer_notes = models.TextField(null=True, blank=True)
    date = models.DateField(null=True)
    time = models.CharField(max_length=10)
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "appointments"

    def __str__(self):
        return f"{self.customer_name} - {self.date} {self.time}"



# ================================
# ORDER
# ================================
class OrderType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "order_types"

    def __str__(self):
        return self.name


class Order(models.Model):
    id = models.BigAutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.CharField(max_length=150, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    order_type = models.ForeignKey(
        OrderType,
        on_delete=models.CASCADE,
        db_column="order_type_id"
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=100, default="pending")
    confirmed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="confirmed_orders",
        db_column="confirmed_by"
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_orders",
        db_column="updated_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"

    def __str__(self):
        return f"Order {self.id}"


class OrderDetail(models.Model):
    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_column="order_id")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, db_column="product_id")
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, db_column="service_id")
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        db_table = "order_details"

    def __str__(self):
        return f"OrderDetail {self.id}"


class OrderShipping(models.Model):
    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    class Meta:
        db_table = "order_shipping"

    def __str__(self):
        return f"OrderShipping {self.id}"


class OrderStatusHistory(models.Model):
    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_column="order_id")
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="changed_by"
    )

    class Meta:
        db_table = "order_status_history"

    def __str__(self):
        return f"OrderStatusHistory {self.id}"


# ================================
# REVIEW
# ================================
from django.core.exceptions import ValidationError

class Review(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=150, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)
    product = models.ForeignKey("Product", on_delete=models.SET_NULL, null=True, blank=True)
    service = models.ForeignKey("Service", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reviews"

    def clean(self):
        associations = sum(1 for field in [self.product, self.service] if field)
        if associations != 1:
            raise ValidationError("Review must be linked to exactly one of (product, service).")
        if self.rating is not None and not (1 <= self.rating <= 5):
            raise ValidationError("Rating must be between 1 and 5.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Gọi clean trước khi lưu
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review {self.id} - {self.name}"



# ================================
# PAGE & CONTACT & NEWS
# ================================
class Page(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pages"

    def __str__(self):
        return self.title


class Contact(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contacts"

    def __str__(self):
        return self.name if self.name else f"Contact {self.id}"


class News(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "news"

    def __str__(self):
        return self.title


# ================================
# ADMIN LOG
# ================================
class AdminLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = "admin_logs"

    def __str__(self):
        return f"AdminLog {self.id}"
