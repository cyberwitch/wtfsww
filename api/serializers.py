from django.contrib.auth.models import User

from rest_framework import serializers

from api import models


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Movie
        fields = ('id', 'title', 'year', 'image_url',)


class MovieshipSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='movie.id')
    title = serializers.ReadOnlyField(source='movie.title')
    year = serializers.ReadOnlyField(source='movie.year')
    image_url = serializers.ReadOnlyField(source='movie.image_url')

    class Meta:
        model = models.Movieship
        fields = ('id', 'title', 'year', 'image_url', 'seen', 'want_to_see',)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ('id', 'first_name', 'last_name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)
