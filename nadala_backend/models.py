# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.ForeignKey('Roles', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin'


class AdminLogs(models.Model):
    admin = models.ForeignKey(Admin, models.DO_NOTHING)
    action = models.CharField(max_length=255)
    action_date = models.DateTimeField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_logs'


class Appointments(models.Model):
    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    service = models.ForeignKey('Services', models.DO_NOTHING)
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=9, blank=True, null=True)
    confirmed_by = models.ForeignKey(Admin, models.DO_NOTHING, db_column='confirmed_by', blank=True, null=True)
    updated_by = models.ForeignKey(Admin, models.DO_NOTHING, db_column='updated_by', related_name='appointments_updated_by_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'appointments'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class Contacts(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'contacts'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class News(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'news'


class OrderDetails(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING, blank=True, null=True)
    service = models.ForeignKey('Services', models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'order_details'


class OrderShipping(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    shipping_method = models.CharField(max_length=100, blank=True, null=True)
    shipping_status = models.CharField(max_length=9, blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    shipping_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order_shipping'


class OrderStatusHistory(models.Model):
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    status = models.CharField(max_length=10)
    changed_by = models.ForeignKey(Admin, models.DO_NOTHING, db_column='changed_by', blank=True, null=True)
    change_date = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order_status_history'


class OrderTypes(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'order_types'


class Orders(models.Model):
    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=150, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    order_type = models.ForeignKey(OrderTypes, models.DO_NOTHING)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, blank=True, null=True)
    confirmed_by = models.ForeignKey(Admin, models.DO_NOTHING, db_column='confirmed_by', blank=True, null=True)
    updated_by = models.ForeignKey(Admin, models.DO_NOTHING, db_column='updated_by', related_name='orders_updated_by_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orders'


class Pages(models.Model):
    title = models.CharField(max_length=255)
    slug = models.CharField(unique=True, max_length=255)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pages'


class Payments(models.Model):
    order = models.ForeignKey(Orders, models.DO_NOTHING)
    payment_method = models.CharField(max_length=13, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=7, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payments'


class ProductCategories(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product_categories'


class Products(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.IntegerField()
    image = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(ProductCategories, models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'


class Reviews(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=150, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    rating = models.JSONField(blank=True, null=True)
    product = models.ForeignKey(Products, models.DO_NOTHING, blank=True, null=True)
    service = models.ForeignKey('Services', models.DO_NOTHING, blank=True, null=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reviews'


class Roles(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'


class Services(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'services'


class Users(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'users'


class UsersGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user_id = models.BigIntegerField()
    group_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'users_groups'
