from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
import re
from django.utils.decorators import method_decorator
from user_profile.models import UserProfile
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib.auth.models import User
from django.contrib import auth
from .serializers import UserSerializer


class CheckAuthenticatedView(APIView):
    def get(self, request):
        user = self.request.user

        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})

            else:
                return Response({'isAuthenticated': 'error'})
        except:
            return Response({'error': 'Something went wrong when checking authentication status'})


@method_decorator(csrf_protect, name='dispatch')
class SignUpView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        username = data['username']
        password = data['password']
        re_password = data['re_password']
        print(data)

        if password == re_password:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'})
            else:
                if len(password) < 6:
                    return Response({'error': 'Password must be at least 6 characters'})
                elif len(password) > 20:
                    return Response({'error': 'Password must be at most 20 characters'})
                elif not re.search('[a-z]', password):
                    return Response({'error': 'Password must contain at least one lowercase letter'})
                elif not re.search('[A-Z]', password):
                    return Response({'error': 'Password must contain at least one uppercase letter'})
                elif not re.search('[0-9]', password):
                    return Response({'error': 'Password must contain at least one digit'})
                # check for special characters
                elif not re.search('[^a-zA-Z0-9]', password):
                    return Response({'error': 'Password must contain at least one special character'})
                else:
                    try:
                        user = User.objects.create_user(username=username, password=password)
                        user.save()
                        user_profile = UserProfile(user=user, first_name='', last_name='', email='')
                        user_profile.save()
                        return Response({'success': 'User created successfully'})
                    except Exception as e:
                        return Response({'error': f'Failed to create user: {str(e)}'})
        else:
            return Response({'error': 'Passwords do not match'})


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data
        print(data)
        username = data['username']
        password = data['password']
        try:
            user = auth.authenticate(username=username, password=password)
            if user is not None:
                auth.login(request, user)
                return Response({'success': 'User logged in successfully'})
            else:
                return Response({'error': 'Invalid username or password'})
        except Exception as e:
            return Response({'error': f'Failed to log in user: {str(e)}'})


class LogoutView(APIView):
    def get(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'User logged out successfully'})
        except Exception as e:
            return Response({'error': f'Failed to log out user: {str(e)}'})


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'Token received successfully'})


@method_decorator(csrf_protect, name='dispatch')
class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        try:
            user = self.request.user
            User.objects.filter(username=user).delete()  # delete user from User table in database
            return Response({'success': 'Account deleted successfully'})
        except Exception as e:
            return Response({'error': f'Failed to delete account: {str(e)}'})


class getUsersView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        try:
            users = User.objects.all()
            userserialized = UserSerializer(users, many=True)
            return Response(userserialized.data)
        except Exception as e:
            return Response({'error': f'Failed to get users: {str(e)}'})
