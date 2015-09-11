from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_extensions.routers import ExtendedDefaultRouter

from api import views

router = ExtendedDefaultRouter(trailing_slash=False)
(
    router.register(r'movies', views.MovieViewSet)
)
(
    router.register(r'profiles', views.ProfileViewSet).register(r'movies', views.ProfileMovieViewSet, base_name='profiles-movie', parents_query_lookups=['profile__id'])
)
(
    router.register(r'users', views.UserViewSet)
)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^profile$', views.SignedInProfileView.as_view()),
    url(r'^profile/friends$', views.SignedInProfileFriendsView.as_view()),
    url(r'^profile/movies$', views.SignedInProfileMoviesView.as_view()),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
