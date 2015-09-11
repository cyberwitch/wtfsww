from django.contrib.auth.models import User

from rest_framework import serializers

from api.models import Movie, Movieship, Profile


class MovieSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Movie
        fields = ('url', 'id', 'tmdb_id', 'title', 'year', 'image_url', 'profiles')


class MovieshipSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source='movie.id')
    tmdb_id = serializers.ReadOnlyField(source='movie.tmdb_id')
    title = serializers.ReadOnlyField(source='movie.title')
    year = serializers.ReadOnlyField(source='movie.year')
    image_url = serializers.ReadOnlyField(source='movie.image_url')

    class Meta:
        model = Movieship
        fields = ('id', 'tmdb_id', 'title', 'year', 'image_url', 'seen', 'want_to_see')


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ('url', 'id', 'user')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'id', 'username')
