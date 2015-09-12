from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_extensions.routers import ExtendedDefaultRouter

from api import views

router = ExtendedDefaultRouter(trailing_slash=False)
router.register(r'movies', views.MovieViewSet)
router.register(r'profile/friends', views.SignedInProfileFriendViewSet, base_name='profile-friends')
router.register(r'profile/movies', views.SignedInProfileMovieViewSet, base_name='profile-movies')
router.register(r'profiles', views.ProfileViewSet).register(
    r'movies', views.ProfileMovieViewSet, base_name='profiles-movies', parents_query_lookups=['profile__id'])

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^profile', views.SignedInProfileView.as_view()),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
