from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save


class Movie(models.Model):
    tmdb_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    year = models.CharField(max_length=9, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    profiles = models.ManyToManyField('Profile', through='Movieship')

    def __str__(self):
        return self.title


class Profile(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    user = models.OneToOneField(User, unique=True, on_delete=models.CASCADE)
    movies = models.ManyToManyField('Movie', through='Movieship')
    friends = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return self.user.username


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)


class Movieship(models.Model):
    profile = models.ForeignKey(Profile)
    movie = models.ForeignKey(Movie)
    seen = models.BooleanField()
    want_to_see = models.BooleanField()
