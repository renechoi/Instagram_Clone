from django.urls import path

from .views import (
    AuthViewSet,
    UserViewSet
)

signup = AuthViewSet.as_view({
    'post': 'signup'
})

signin = AuthViewSet.as_view({
    'post': 'signin'
})

authcode = AuthViewSet.as_view({
    'post': 'create_authcode',
    'put': 'check_authcode',
})

change_lostpassword = AuthViewSet.as_view({
    'put': 'change_lostpassword'
})

user_detail = UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'partial_update',
    'patch': 'partial_update'
})

change_user_password = UserViewSet.as_view({
    'put': 'change_password'
})

user_profile = UserViewSet.as_view({
    'put': 'upload_profile',
    'delete': 'delete_profile'
})

urlpatterns = [
    path('/signup', signup),
    path('/signin', signin),
    path('/authcode', authcode),
    path('/password', change_lostpassword),
    path('/<int:pk>', user_detail),
    path('/<int:pk>/password', change_user_password),
    path('/<int:pk>/profile', user_profile),
]