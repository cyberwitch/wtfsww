from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_extensions.routers import ExtendedDefaultRouter

from api import views

router = ExtendedDefaultRouter(trailing_slash=False)
router.register(r'movies', views.MovieViewSet)
router.register(r'profile/friends', views.SignedInProfileFriendViewSet, base_name='profile-friend')
router.register(r'profile/movies', views.SignedInProfileMovieViewSet, base_name='profile-movieship')
router.register(
    r'profile/pendingFriends', views.SignedInProfilePendingFriendViewSet, base_name='profile-friend')
router.register(r'profiles', views.ProfileViewSet).register(
    r'movies', views.ProfileMovieViewSet, base_name='profile-movieship', parents_query_lookups=['profile__id'])

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^profile', views.SignedInProfileView.as_view()),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
