from django.db import models

class SaveRecommendation(models.Model):
    recommendations = models.JSONField()
    # budget = models.IntegerField()
    user = models.CharField(max_length=255, default="")


class Rating(models.Model):
    destination = models.CharField(max_length=300, default="")
    rating = models.FloatField(default=0.0)
    # feedback = models.CharField(max_length=300, default="")
    user = models.CharField(max_length=300, default="")

class Feedback(models.Model):
    feedback = models.CharField(max_length=300, default="")
    user = models.CharField(max_length=300, default="")

class Bookmark(models.Model):
    destination = models.CharField(max_length=300, default="")
    user = models.CharField(max_length=300, default="")