from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, PerfilColaboradorSerializer
from .permissions import IsAdministrador, IsColaborador
from .models import User



# PERFIL DE USUARIO (PROTEGIDO)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def perfil_view(request):
    return Response(UserSerializer(request.user).data)


# CREAR USUARIO (SOLO ADMIN)
@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdministrador])
def crear_usuario_view(request):
    serializer = CreateUserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdministrador])
def lista_usuarios_view(request):
    """
    Solo administradores pueden ver la lista completa de usuarios.
    """
    usuarios = User.objects.all()
    data = UserSerializer(usuarios, many=True).data
    return Response(data, status=status.HTTP_200_OK)

# EDITAR USUARIO (SOLO ADMIN)
@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdministrador])
def editar_usuario_view(request, user_id):
    try:
        usuario = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    # Usar el serializer de actualización, NO el de creación
    serializer = UpdateUserSerializer(usuario, data=request.data, partial=True)

    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ELIMINAR USUARIO (SOLO ADMIN)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdministrador])
def eliminar_usuario_view(request, user_id):
    try:
        usuario = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    usuario.delete()
    return Response({"mensaje": "Usuario eliminado correctamente"}, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsColaborador])
def editar_mi_perfil_view(request):
    usuario = request.user

    serializer = PerfilColaboradorSerializer(
        usuario,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)