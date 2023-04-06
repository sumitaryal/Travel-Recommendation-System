from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # if on_delete = DoNothing, then the user profile will not be deleted if the user is deleted
    first_name = models.CharField(max_length=50, default = '')
    last_name = models.CharField(max_length=50,  default = '')
    email = models.EmailField(max_length=254,  default = '')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.first_name + ' ' + self.last_name
