# python modules
import time
import hashlib

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    TIMEOUT = 60 * 5 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    email = models.EmailField(max_length=256, unique=True)
    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    profile = models.ImageField(null=False, blank=True)
    description = models.CharField(max_length=512, blank=True)
    authcode = models.CharField(max_length=17)
    
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    user_manager = UserManager()
    
    def __repr__(self):
        return f"<User {self.pk} {self.username} {self.updated}>"
    
    class Meta:
        ordering =['created']
        
        
    def _create_authcode(self):
        timestamp = int(time.time())
        while True:
            authcode = hashlib.sha224(f"{repr(self)}:{timestamp}".encode()).hexdigest()[:6]
            try:
                User.objects.get(authcode=authcode)
            except User.DoesNotExist:
                self.authcode = f"{authcode}:{timestamp}"
                break
        self.save()
        return authcode

    def create_authcode(self):
        if self.authcode != "":
            splited = self.authcode.split(":")
            if time.time() - int(splited[-1]) < self.TIMEOUT:
                raise ValidationError("5??? ????????? ??????????????? ????????? ??? ????????????.")
        
        authcode = self._create_authcode()
        return authcode

    def check_authcode(self, authcode):
        # ??????????????? ?????? ???
        if self.authcode == "":
            raise ValidationError("?????? ??????????????? ????????? ?????????.")
        # ???????????? ??????
        splited = self.authcode.split(":")
        if time.time() - int(splited[-1]) > self.TIMEOUT:
            raise ValidationError("??????????????? ??????????????????. ??????????????? ?????? ????????? ?????????.")
        # ??????????????? ??????
        if splited[0] == authcode:
            return True
        else:
            return False

    def change_lostpassword(self, password):
        self.authcode = ""
        self.set_password(password)
        self.save()

    # def check_password(self):
    #     pass

    def change_password(self, password, new_password):
        # password -X-> db
        # password -> ????????? -> db
        # if self.password == password:
        if self.check_password(password):
            self.set_password(new_password)
            self.save()
        else:
            raise ValidationError("???????????? ????????? ??????????????????.")

    def upload_profile(self, profile_image):
        # image/jpg
        if 'image' not in profile_image.content_type:
            raise ValidationError("????????? ????????? ????????????. ????????? ????????? ????????? ????????????.")
        ext = profile_image.content_type.split("/")[-1]
        self.profile.save(f"profiles/{self.pk}/profile-{int(time.time())}.{ext}", profile_image.file)
        return self
        
    def delete_profile(self):
        self.profile = None
        self.save()
        return self