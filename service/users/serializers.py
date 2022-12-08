from rest_framework import serializers

from users.models import User

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    
    class Meta:
        model = User
        fields = (
            'pk',
            'email',
            'username',
            'profile',
            'description',
            'password',
            'updated'
        )
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'profile': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
