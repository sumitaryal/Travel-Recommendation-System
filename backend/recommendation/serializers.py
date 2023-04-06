from rest_framework import serializers
from .models import SaveRecommendation, Rating, Feedback, Bookmark  # ,Recommendation


class SaveRecommendationSerializer(serializers.Serializer):
    recommendations = serializers.JSONField()

    # budget = serializers.IntegerField()

    def create(self, validated_data):
        return SaveRecommendation.objects.create(**validated_data)



class RatingSerializer(serializers.Serializer):
    destination = serializers.CharField()
    rating = serializers.FloatField()
    # feedback = serializers.CharField()
    user = serializers.CharField()

    def create(self, validated_data):
        return Rating.objects.create(**validated_data)


class FeedbackSerializer(serializers.Serializer):
    feedback = serializers.CharField()
    user = serializers.CharField()

    def create(self, validated_data):
        return Feedback.objects.create(**validated_data)

class BookmarkSerializer(serializers.Serializer):
    destination = serializers.CharField()
    user = serializers.CharField()

    def create(self, validated_data):
        return Bookmark.objects.create(**validated_data)