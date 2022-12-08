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
    
    def signin(self, request):
        user = authenticate(email=request.data['email'], password=request.data['password'])

        if user is not None:
            # ok
            login(request, user)
            serializer = self.get_serializer(user)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )
        else:
            # not ok
            try:
                user = User.objects.get(email=request.data['email'])
                message = "비밀번호를 확인해주세요."
            except User.DoesNotExist:
                message = "해당 이메일을 사용하는 사용자가 존재하지 않습니다."

            return Response(
                {
                    "message": message
                },
                status=status.HTTP_404_NOT_FOUND
            )