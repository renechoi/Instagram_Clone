from django.urls import path
from django.contrib import admin
from django.urls import include

from .views import (
    AuthViewSet,
    UserViewSet
)

signup = AuthViewSet.as_view({
    'post': 'signup'
})

urlpatterns = [
    path('/signup', signup),
    path('users', include('users.urls')),
]