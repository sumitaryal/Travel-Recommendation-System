from django.urls import path
from .views import GenerateItineraryView, SendRatingForCollaborativeFilteringView, RateDestinationsView, \
    ShowRecommendationInProfileView, RecordFeedbackView, SearchView, SaveBookmarkView, GenerateItineraryByChoosing, \
    GetAllLocationsView  # , SendRecommendationView

urlpatterns = [
    path('generate/', GenerateItineraryView.as_view()),
    # path('filter/', SendRecommendationView.as_view()),
    path('collaborativeFiltering/', SendRatingForCollaborativeFilteringView.as_view()),
    path('rateDestination/', RateDestinationsView.as_view()),
    path('showRecommendation/', ShowRecommendationInProfileView.as_view()),
    path('recordFeedback/', RecordFeedbackView.as_view()),
    path('search/', SearchView.as_view()),
    path('saveBookmark/', SaveBookmarkView.as_view()),
    path('generateByChoosing/', GenerateItineraryByChoosing.as_view()),
    path('getAllLocations/', GetAllLocationsView.as_view()),
]
