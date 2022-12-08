# django modules
from django.contrib.auth import authenticate
from django.contrib.auth import login

# drf modules
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

# permissions
# from users.permissions import IsUserOwner

# models
from users.models import User

# serializers
from users.serializers import UserSerializer


class AuthViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [ AllowAny ]
    authentication_classes = []

    def signup(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        login(request, user)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    