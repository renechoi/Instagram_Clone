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
            
    
    def create_authcode(self, request):
        email = request.data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": "해당 이메일이 존재하지 않습니다. 이메일을 확인해주세요."
                },
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            authcode = user.create_authcode()
        except Exception as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {
                "authcode": authcode
            },
            status=status.HTTP_200_OK
        )

    def check_authcode(self, request):
        # 이메일 확인하기
        email = request.data.get('email', None)
        if email is None:
            return Response(
                {
                    "message": "이메일을 입력해주세요."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 인증코드 확인하기
        authcode = request.data.get('authcode', None)
        if authcode is None:
            return Response(
                {
                    "message": "인증코드를 입력해주세요."
                },
                status=status.HTTP_400_BAD_REQUEST
            
            )

        # 해당 이메일 사용자 객체 가져오기
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": "해당 이메일을 가진 사용자가 존재하지 않습니다. 이메일을 확인해주세요."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # 인증코드 일치여부 확인
        try:
            result = user.check_authcode(authcode)
        except Exception as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if result:
            return Response(
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "message": "인증코드가 일치하지 않습니다."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def change_lostpassword(self, request):
        # 이메일 확인
        email = request.data.get('email', None)
        if email is None:
            return Response(
                {
                    "message": "이메일이 없습니다."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # 비밀번호 확인
        password = request.data.get('password', None)
        if password is None:
            return Response(
                {
                    "message": "비밀번호를 입력해주세요."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 사용자 객체 가져오기
        try:
            user = User.objects.get(email=email)
        except user.DoesNotExist:
            return Response(
                {
                    "message": "해당 이메일을 가진 사용자가 존재하지 않습니다. 이메일을 확인해주세요."
                },
                status=status.HTTP_404_NOT_FOUND
            )
        # 비밀번호 변경
        try:
            user.change_lostpassword(password)
        except Exception as e:
            return Response(
                {
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "비밀번호가 변경됐습니다."
            },
            status=status.HTTP_200_OK
        )