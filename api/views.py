from django.contrib.auth.models import User

from rest_framework import generics, viewsets
from rest_framework.decorators import api_view, detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.reverse import reverse

from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import Movie, Profile
from api.serializers import MovieSerializer, ProfileSerializer, UserSerializer
from api.tmdbutils import TMDBUtils

tmdb = TMDBUtils('1c9fdf67f8e8f9df79a09809f463bc25')


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
    })


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def list(self, request, format=None):
        """
        ---
        parameters:
            - name: query
              paramType: query
            - name: profiles
              paramType: query
        """

        query = request.query_params.get('query', None)
        profiles = request.query_params.get('profiles', None)
        if query:
            results = tmdb.search(query)
            movies = []
            for result in results:
                if Movie.objects.filter(tmdb_id=result['tmdb_id']).exists():
                    movies.append(Movie.objects.get(tmdb_id=result['tmdb_id']))
                else:
                    movie = Movie(**result)
                    movie.save()
                    movies.append(movie)
        else:
            movies = Movie.objects.all()
            if profiles:
                for profile in [profile.strip() for profile in profiles.split(',')]:
                    movies = movies.filter(profiles__in=profile)
        return Response(MovieSerializer(movies, many=True, context={'request': request}).data)


class SignedInProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request, format=None):
        return Response(ProfileSerializer(self.queryset.get(user=self.request.user), context={'request': request}).data)


class SignedInProfileFriendsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get(self, request, format=None):
        return Response(ProfileSerializer(self.queryset.get(user=self.request.user).friends, many=True, context={'request': request}).data)


class SignedInProfileMoviesView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = MovieSerializer

    def get(self, request, format=None):
        return Response(MovieSerializer(self.queryset.get(user=self.request.user).movies, many=True, context={'request': request}).data)


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @detail_route(methods=['GET'])
    def friends(self, request, pk, format=None):
        return Response(ProfileSerializer(Profile.objects.get(pk=pk).friends, many=True, context={'request': request}).data)


class ProfileMovieViewSet(NestedViewSetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
