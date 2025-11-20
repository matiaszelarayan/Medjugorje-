from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer simple para mostrar información del usuario.
    NO incluye contraseña.
    """
    class Meta:
        model = User
        fields = ["id", "nombre", "apellido", "email", "rol"]


class CreateUserSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios desde la API.
    El campo password es write_only: se envía pero no se devuelve.
    """
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()  # aplica validación de formato

    class Meta:
        model = User
        fields = ["nombre", "apellido", "email", "rol", "password"]

    def validate_email(self, value):
        """
        Valida que el email no esté ya registrado.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def create(self, validated_data):
        """
        Para crear un usuario correctamente debemos usar create_user(),
        que ya se encarga de hashear la contraseña y configurar email como username.
        """
        password = validated_data.pop("password")

        user = User.objects.create_user(
            **validated_data,
            password=password
        )

        return user
