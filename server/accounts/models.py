from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, nombre="", apellido="", role="colaborador", **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un email")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            nombre=nombre,
            apellido=apellido,
            role=role,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, nombre="Admin", apellido="Sistema", **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            email=email,
            password=password,
            nombre=nombre,
            apellido=apellido,
            role="administrador",
            **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):

    ROL_CHOICES = (
        ("administrador", "Administrador"),
        ("colaborador", "Colaborador"),
    )

    nombre = models.CharField(max_length=50, blank=True)
    apellido = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROL_CHOICES, default="colaborador")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # esto es opcional se puede sacar o dejar
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre", "apellido"]

    objects = UserManager()

    class Meta:
        ordering = ["apellido", "nombre"]

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.role}"
