from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from recommendation.models import SaveRecommendation, Bookmark
from user_profile.models import UserProfile
from user_profile.serializers import UserProfileSerializer


class GetUserProfileView(APIView):
    def get(self, request, format=None):
        try:
            user = self.request.user
            username = user.username

            user_profile = UserProfile.objects.get(user=user)
            user_profile_serialized = UserProfileSerializer(user_profile)

            email = user.email
            first_name = user.first_name
            last_name = user.last_name
            user_profile_serialized.data['email'] = email
            user_profile_serialized.data['first_name'] = first_name
            user_profile_serialized.data['last_name'] = last_name

            default_picture_url = '/media/default.jpeg'

            # import all saveRecommendation of the current user
            user_profile_recommendation = SaveRecommendation.objects.filter(user=username)
            recommendation_table = []
            for recommendation in user_profile_recommendation:
                recommendation_table.append(recommendation.recommendations)
            recommendation_table.reverse()

            user_profile_bookmark = Bookmark.objects.filter(user=username)
            bookmark_list = []
            for bookmark in user_profile_bookmark:
                bookmark_list.append(bookmark.destination)
            bookmark_list.reverse()

            if user_profile.profile_picture:
                profile_picture_url = user_profile.profile_picture.url
            else:
                profile_picture_url = default_picture_url

            user_profile_serialized.data['profile_picture'] = profile_picture_url
            print(bookmark_list)

            return Response({'profile': user_profile_serialized.data, 'username': str(username),
                             'recommendation_table': recommendation_table, 'bookmark_list': bookmark_list
                             })
        except:
            # return exact error into the response
            return Response({'error': 'Something went wrong when retrieving profile'})


class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        try:
            user = self.request.user
            username = user.username

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']
            # phone = data['phone']
            # city = data['city']
            email = data['email']

            # Handle profile picture
            profile_picture = None
            if 'profile_picture' in request.FILES:
                profile_picture_file = request.FILES['profile_picture']
                profile_picture_path = default_storage.save('profile_pictures/' + profile_picture_file.name,
                                                            profile_picture_file)
                profile_picture = profile_picture_path

            UserProfile.objects.filter(user=user).update(first_name=first_name, last_name=last_name,
                                                         email=email,
                                                         profile_picture=profile_picture)

            # UserProfile.objects.filter(user=user).update(first_name=first_name, last_name=last_name, email = email)

            user_profile = UserProfile.objects.get(user=user)
            user_profile_serialized = UserProfileSerializer(user_profile)

            return Response({'profile': user_profile_serialized.data, 'username': str(username)})
        except:
            return Response({'error': 'Something went wrong when updating profile'})
