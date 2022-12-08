from rest_framework.permissions import BasePermission

class IsUserOwner(BasePermission):
    message = "해당 사용자에 접근할 수 없습니다."

    def has_object_permission(self, request, view, obj):
        # /users/1 == User<pk=1>
        return request.user == obj