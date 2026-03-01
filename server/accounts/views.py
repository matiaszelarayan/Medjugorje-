from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .serializers import UserSerializer, CreateUserSerializer, UpdateUserSerializer, PerfilColaboradorSerializer
from .permissions import IsAdministrador, IsColaborador, IsAdminOrColaborador
from .models import User
from core.responses import success_response
from core.messages import Messages



# PERFIL DE USUARIO (PROTEGIDO)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def perfil_view(request):
    return success_response(
        Messages.RETRIEVED,
        UserSerializer(request.user).data,
        status=status.HTTP_200_OK,
    )


# CREAR USUARIO (SOLO ADMIN)
@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdministrador])
def crear_usuario_view(request):
    serializer = CreateUserSerializer(
        data=request.data,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return success_response(
        Messages.CREATED,
        UserSerializer(user).data,
        status=status.HTTP_201_CREATED,
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminOrColaborador])
def lista_usuarios_view(request):
    usuarios = User.objects.all()
    data = UserSerializer(usuarios, many=True).data

    return success_response(
        Messages.RETRIEVED,
        data,
        status=status.HTTP_200_OK,
    )

# EDITAR USUARIO (SOLO ADMIN)
@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdministrador])
def editar_usuario_view(request, user_id):
    usuario = get_object_or_404(User, id=user_id)

    serializer = UpdateUserSerializer(
        usuario,
        data=request.data,
        partial=True,
    )
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return success_response(
        Messages.UPDATED,
        UserSerializer(user).data,
        status=status.HTTP_200_OK,
    )


# ELIMINAR USUARIO (SOLO ADMIN)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdministrador])
def eliminar_usuario_view(request, user_id):
    usuario = get_object_or_404(User, id=user_id)
    usuario.delete()

    return success_response(
        Messages.DELETED,
        None,
        status=status.HTTP_200_OK,
    )

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsColaborador])
def editar_mi_perfil_view(request):
    serializer = PerfilColaboradorSerializer(
        request.user,
        data=request.data,
        partial=True,
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return success_response(
        Messages.UPDATED,
        serializer.data,
        status=status.HTTP_200_OK,
    )