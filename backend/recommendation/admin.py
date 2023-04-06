from django.contrib import admin
from .models import SaveRecommendation, Rating, Feedback, Bookmark

# Register your models here.
admin.site.register(SaveRecommendation)
admin.site.register(Rating)
admin.site.register(Feedback)
admin.site.register(Bookmark)

