from rest_framework.views import APIView
from .models import Rating, SaveRecommendation, Bookmark  # , Recommendation
from .serializers import SaveRecommendationSerializer, \
    RatingSerializer, FeedbackSerializer, \
    BookmarkSerializer  # ,RecommendationSerializer, ExportRecommendationSerializer,
from rest_framework.response import Response
import requests


class GenerateItineraryView(APIView):
    def post(self, request):
        data = self.request.data
        print(data)
        destination = data['destination']
        time = int(data['time'])
        budget = int(data['budget'])
        preference = data['preference']

        api_url = 'http://localhost:5000/generate'

        data = {
            'destination': destination,
            'time': time,
            'budget': budget,
            'preference': preference
        }
        print(data)
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, json=data, headers=headers)

        recommendation_table = response.json()["recommendations"][0]
        budget_total = response.json()["recommendations"][0]["total_budget"]

        recommendations = recommendation_table["destination"]

        print(recommendations)
        try:
            day = 0
            days = [day]
            flag = 0

            for recommendation in recommendations:
                temp_day = day
                if len(days) >= 1:
                    day = recommendation['time_taken'] + days[-1]
                    # temp_day = day
                    if float(int(day)) == day and flag == 0:
                        temp_day = day
                    else:
                        temp_day = temp_day + 0.5
                        flag = 1 if 0 else 0
                    days.append(temp_day)
            # print(i)
            days = [day + 0.5 if float(int(day)) !=
                                 day else day for day in days]
            days = days[1:]
            days = [int(day) for day in days]
            print(days)

            for i in range(len(recommendations)):
                recommendations[i]['time_taken'] = days[i]

            recommendation_table = {
                "destination": recommendations,
                "total_budget": budget_total
            }
            serialized_save_recommendation = SaveRecommendationSerializer(
                data={"recommendations": recommendation_table})
            if serialized_save_recommendation.is_valid():

                serialized_save_recommendation.save(user=request.user.username)

            else:
                print(serialized_save_recommendation.errors)
            return Response({'recommendation': recommendations, 'budget': budget_total})

        except (KeyError, ValueError) as e:
            # Handle JSON parsing error
            error_message = "Error parsing JSON data from API: {}".format(
                str(e))
            return Response({'error_message': error_message})


class SendRatingForCollaborativeFilteringView(APIView):
    def post(self, request):
        ratings = Rating.objects.all()
        ratings_dict_list = []
        data = self.request.data
        location = data['location']
        for rating in ratings:
            ratings_dict_list.append(
                {
                    'title': rating.destination,
                    'user': rating.user,
                    'rating': rating.rating,

                }
            )
        data = {
            'location': location,
            'ratings': ratings_dict_list
        }
        api_url = 'http://localhost:5000/collaborative'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, json=data, headers=headers)
        recommendation = response.json()['recommendations']
        print(recommendation)
        return Response({'recommendation': recommendation})


class RateDestinationsView(APIView):
    def post(self, request):
        data = self.request.data
        destination = data['destination']
        rating_value = float(data['rating'])
        # feedback = data['feedback']
        user = request.user.username

        try:
            rating_object = Rating.objects.get(user=user, destination=destination)
            rating_object.rating = rating_value
            rating_object.save()
        except Rating.DoesNotExist:
            data = {
                'destination': destination,
                'rating': rating_value,
                # 'feedback': feedback,
                'user': user
            }

            serialized_rating = RatingSerializer(data=data)
            if serialized_rating.is_valid():
                serialized_rating.save()

        return Response({'response': 'Success'})

class ShowRecommendationInProfileView(APIView):
    def get(self, request):
        save_recommendations = SaveRecommendation.objects.filter(
            user=request.user.username)
        serialized_save_recommendations = []
        for save_recommendation in save_recommendations:
            serialized_save_recommendation = SaveRecommendationSerializer(
                save_recommendation)
            serialized_save_recommendations.append(
                serialized_save_recommendation.data)

        return Response({'save_recommendations': serialized_save_recommendations})


class SearchView(APIView):
    def post(self, request):
        data = self.request.data
        search = data['search']
        search = search.lower()
        data = {
            'location': search
        }
        api_url = 'http://localhost:5000/search'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(api_url, json=data, headers=headers)
        destinations = response.json()['recommendations']

        destination_list = []
        bookmarked_destinations = Bookmark.objects.filter(user=request.user.username)
        bookmarked_destination_title = []

        for bookmarked_destination in bookmarked_destinations:
            bookmarked_destination_title.append(bookmarked_destination.destination)

        rated_destination = Rating.objects.filter(user=request.user.username)
        rated_destination_title = []

        for rated_dest in rated_destination:
            rated_destination_title.append(rated_dest.destination)

        for destination in destinations:
            isBookmarked = True if destination['title'] in bookmarked_destination_title else False

            if destination['title'] in rated_destination_title:
                isRated = True
                rating = Rating.objects.get(user=request.user.username, destination=destination['title']).rating
            else:
                isRated = False
                rating = -1

            dest = {
                'title': destination['title'],
                'description': destination['description'],
                'rating': destination['rating'],
                'isBookmarked': isBookmarked,
                'isRated': isRated,
                'user_rating': rating
            }
            destination_list.append(dest)
        return Response({'destinations': destination_list})


class RecordFeedbackView(APIView):
    def post(self, request):
        data = self.request.data
        feedback = data['feedback']
        user = request.user.username

        try:
            data = {
                'feedback': feedback,
                'user': user
            }

            serialized_feedback = FeedbackSerializer(data=data)
            if serialized_feedback.is_valid():
                serialized_feedback.save()

            return Response({'response': 'Success'})

        except:
            return Response({'response': 'Failure'})


class SaveBookmarkView(APIView):
    def post(self, request):
        data = self.request.data
        destination = data['destination']
        user = request.user.username
        boolean = data['bookmarked']

        bookmarked = Bookmark.objects.filter(user=user)
        bookmarked_destinations = []
        for bookmark in bookmarked:
            bookmarked_destinations.append(bookmark.destination)

        if boolean:
            try:
                data = {
                    'destination': destination,
                    'user': user
                }
                if destination not in bookmarked_destinations:
                    serialized_bookmark = BookmarkSerializer(data=data)
                    if serialized_bookmark.is_valid():
                        serialized_bookmark.save()

                return Response({'response': 'Success'})

            except:
                return Response({'response': 'Failure'})
        else:
            try:
                bookmark = Bookmark.objects.get(user=user, destination=destination)
                bookmark.delete()
                return Response({'response': 'Success'})
            except Bookmark.DoesNotExist:
                return Response({'response': 'Failure - Bookmark does not exist'})
            except Exception as e:
                return Response({'response': f'Failure - {str(e)}'})


class GenerateItineraryByChoosing(APIView):
    def post(self, request):
        data = self.request.data
        locations = data['destinations']

        data = {
            'locations': locations
        }

        api_url = 'http://localhost:5000/itinerary'

        headers = {'Content-Type': 'application/json'}

        response = requests.post(api_url, json=data, headers=headers)

        recommendation_table = response.json()["recommendations"][0]
        budget_total = response.json()["recommendations"][0]["total_budget"]

        recommendations = recommendation_table["destination"]

        try:
            day = 0
            days = [day]
            flag = 0

            for recommendation in recommendations:
                temp_day = day
                if len(days) >= 1:
                    day = recommendation['time_taken'] + days[-1]
                    # temp_day = day
                    if float(int(day)) == day and flag == 0:
                        temp_day = day
                    else:
                        temp_day = temp_day + 0.5
                        flag = 1 if 0 else 0
                    days.append(temp_day)
            # print(i)
            days = [day + 0.5 if float(int(day)) !=
                                 day else day for day in days]
            days = days[1:]
            days = [int(day) for day in days]
            print(days)

            for i in range(len(recommendations)):
                recommendations[i]['time_taken'] = days[i]

            recommendation_table = {
                "destination": recommendations,
                "total_budget": budget_total
            }
            serialized_save_recommendation = SaveRecommendationSerializer(
                data={"recommendations": recommendation_table})
            if serialized_save_recommendation.is_valid():

                serialized_save_recommendation.save(user=request.user.username)

            else:
                print(serialized_save_recommendation.errors)
            return Response({'recommendation': recommendations, 'budget': budget_total})

        except (KeyError, ValueError) as e:
            # Handle JSON parsing error
            error_message = "Error parsing JSON data from API: {}".format(
                str(e))
            return Response({'error_message': error_message})


class GetAllLocationsView(APIView):
    def get(self, request):
        api_url = 'http://localhost:5000/get_locations'
        headers = {'Content-Type': 'application/json'}
        response = requests.get(api_url, headers=headers)

        destinations = response.json()['recommendations']

        destination_list = []

        for destination in destinations:
            dest = {
                'title': destination['title'],
                'description': destination['description'],
                'rating': destination['rating'],
            }
            destination_list.append(dest)
        return Response({'destinations': destination_list})
