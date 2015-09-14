from rest_framework import filters, generics, mixins, status, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api import models, serializers
from api.tmdbutils import TMDBUtils

tmdb = TMDBUtils('1c9fdf67f8e8f9df79a09809f463bc25')


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns a movie from the global movie list
    """
    queryset = models.Movie.objects.all()
    serializer_class = serializers.MovieSerializer

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
                if models.Movie.objects.filter(tmdb_id=result['tmdb_id']).exists():
                    movies.append(models.Movie.objects.get(tmdb_id=result['tmdb_id']))
                else:
                    movie = models.Movie(**result)
                    movie.save()
                    movies.append(movie)
        else:
            movies = models.Movie.objects.all()
            if profiles:
                for profile in [profile.strip() for profile in profiles.split(',')]:
                    movies = movies.filter(profiles__in=profile)
        return Response(serializers.MovieSerializer(movies, many=True, context={'request': request}).data)


class SignedInProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        return self.request.user.profile

    def get(self, request):
        """
        Returns signed in profile
        """
        return Response(serializers.ProfileSerializer(request.user.profile, context={'request': request}).data)

    def put(self, request):
        """
        Updates the signed in profile
        ---
        consumes:
            - application/json
        parameters_strategy: replace
        parameters:
            - name: body
              required: true
              type: Profile
              paramType: body
              defaultValue: "{\\n  \\"first_name\\": \\"\\",\\n  \\"last_name\\": \\"\\"\\n}"
        """
        try:
            request.user.profile.first_name = request.data['first_name']
            request.user.profile.last_name = request.data['last_name']
            request.user.profile.save()
            return Response(status.HTTP_200_OK)
        except:
            return Response(status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        """
        Updates the signed in profile
        ---
        consumes:
            - application/json
        parameters_strategy: replace
        parameters:
            - name: body
              required: true
              type: Profile
              paramType: body
              defaultValue: "{\\n  \\"first_name\\": \\"\\",\\n  \\"last_name\\": \\"\\"\\n}"
        """
        try:
            request.user.profile.first_name = request.data.get('first_name', request.user.profile.first_name)
            request.user.profile.last_name = request.data.get('last_name', request.user.profile.last_name)
            request.user.profile.save()
            return Response(status.HTTP_200_OK)
        except:
            return Response(status.HTTP_400_BAD_REQUEST)


class SignedInProfileFriendViewSet(mixins.CreateModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.DestroyModelMixin,
                                   mixins.ListModelMixin,
                                   viewsets.GenericViewSet):
    """
    Returns friends of the signed in profile
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ProfileSerializer

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
            profile = models.Profile.objects.get(pk=request.data['id'])
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
            profile = models.Profile.objects.get(pk=pk)
            request.user.profile.friends.remove(pk)
            profile.friends.remove(request.user.profile)
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['GET'])
    def movies(self, request, pk):
        """
        Returns a friend's movie list
        """
        try:
            profile = self.get_queryset().get(pk=pk)
            return Response(
                serializers.MovieshipSerializer(profile.movieship_set, many=True, context={'request': request}).data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['GET'])
    def pending(self, request):
        """
        Returns the pending friend requests
        """
        return Response(serializers.ProfileSerializer(self.request.user.profile.friends.exclude(
            id__in=self.request.user.profile.friends.filter(friends=self.request.user.profile)),
            many=True, context={'request': request}).data)


class SignedInProfileMovieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Returns signed in profile's movie list
    """
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.MovieshipSerializer

    def get_queryset(self):
        return self.request.user.profile.movieship_set


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Query the global profile list
    ---
    list:
        parameters:
            - name: search
              paramType: query
    """
    filter_backends = (filters.SearchFilter,)
    queryset = models.Profile.objects.all()
    search_fields = ('first_name', 'last_name')
    serializer_class = serializers.ProfileSerializer

    @detail_route(methods=['GET'])
    def friends(self, request, pk):
        """
        Returns profile friend lists
        """
        # Only return friends who have friended back
        return Response(serializers.ProfileSerializer(
            models.Profile.objects.get(pk=pk).friends.filter(friends=pk), many=True, context={'request': request}).data)
