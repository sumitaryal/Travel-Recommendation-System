from django.urls import path
from .views import SignUpView, GetCSRFToken, CheckAuthenticatedView, LoginView, LogoutView, DeleteAccountView, getUsersView

urlpatterns = [
    path('authenticated/', CheckAuthenticatedView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('csrf-cookie/', GetCSRFToken.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('delete/', DeleteAccountView.as_view()),
    path('getusers/', getUsersView.as_view()),
]