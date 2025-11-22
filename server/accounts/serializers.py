from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer simple para mostrar información del usuario.
    NO incluye contraseña.
    """
    class Meta:
        model = User
        fields = ["id", "nombre", "apellido", "email", "role"]


class CreateUserSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios desde la API.
    El campo password es write_only: se envía pero no se devuelve.
    """
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()  # aplica validación de formato

    class Meta:
        model = User
        fields = ["nombre", "apellido", "email", "role", "password"]

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

class UpdateUserSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar usuarios.
    """
    email = serializers.EmailField(required=False)

    class Meta:
        model = User
        fields = ["nombre", "apellido", "email", "role"]

    def validate_email(self, value):
        user = self.instance  # usuario que se está editando

        # Si el email no cambió todo ok
        if user and user.email == value:
            return value

        # Si el email pertenece a otro usuario tira error
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Este email ya está registrado por otro usuario.")

        return value

    def update(self, instance, validated_data):
        """
        Actualiza los campos del usuario
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
class PerfilColaboradorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["nombre", "apellido", "password"] 

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance