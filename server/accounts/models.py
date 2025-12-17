from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from core.messages import Messages

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, nombre="", apellido="", role="colaborador", **extra_fields):
        if not email:
            raise ValueError(Messages.USER_EMAIL_REQUIRED)
        if not password:
            raise ValueError(Messages.USER_PASSWORD_REQUIRED)

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

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True")


        return self.create_user(
            email=email,
            password=password,
            nombre=nombre,
            apellido=apellido,
            role="administrador",
            **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):

    ROLE_ADMIN = "administrador"
    ROLE_COLAB = "colaborador"

    ROL_CHOICES = (
        (ROLE_ADMIN, "Administrador"),
        (ROLE_COLAB, "Colaborador"),
    )

    nombre = models.CharField(max_length=50, blank=True)
    apellido = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROL_CHOICES, default="colaborador")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        ordering = ["apellido", "nombre"]

    def __str__(self):
        return self.email
