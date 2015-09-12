from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import Movie, Profile
from api.serializers import MovieSerializer, ProfileSerializer
from api.tmdbutils import TMDBUtils

tmdb = TMDBUtils('1c9fdf67f8e8f9df79a09809f463bc25')


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns a movie from the global movie list
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def list(self, request):
        """
        Query the global movie list, with filters by name and profile
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

    def get(self, request):
        """
        Returns signed in profile
        """
        return Response(ProfileSerializer(request.user.profile, context={'request': request}).data)


class SignedInProfileFriendViewSet(mixins.CreateModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.DestroyModelMixin,
                                   mixins.ListModelMixin,
                                   viewsets.GenericViewSet):
    """
    Returns friends of the signed in profile
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_queryset(self):
        # Only return friends who have friended back
        return self.request.user.profile.friends.filter(friends=self.request.user.profile)

    def create(self, request):
        """
        Send/accept friend request
        ---
        consumes:
            - application/json
        parameters_strategy: replace
        parameters:
            - name: body
              required: true
              type: Profile
              paramType: body
              defaultValue: "{\\n  \\"id\\": 0\\n}"
        """
        try:
            profile = Profile.objects.get(pk=request.data['id'])
            if profile is request.user.profile:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            request.user.profile.friends.add(profile)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        """
        Remove friend/decline friend request
        """
        try:
            profile = Profile.objects.get(pk=pk)
            request.user.profile.friends.remove(pk)
            profile.friends.remove(request.user.profile)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class SignedInProfileMovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns signed in profile's movie list
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MovieSerializer

    def get_queryset(self):
        return self.request.user.profile.movies


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns profiles by id
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @detail_route(methods=['GET'])
    def friends(self, request, pk):
        """
        Returns profile friend lists
        """
        # Only return friends who have friended back
        return Response(ProfileSerializer(Profile.objects.get(pk=pk).friends.filter(friends=pk), many=True, context={'request': request}).data)


class ProfileMovieViewSet(NestedViewSetMixin, viewsets.ReadOnlyModelViewSet):
    """
    Returns profile movies
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
