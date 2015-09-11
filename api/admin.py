from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from api.models import Movie, Profile


class MovieshipInline(admin.TabularInline):
    model = Profile.movies.through


class ProfileAdmin(admin.ModelAdmin):
    inlines = [MovieshipInline]


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False


class UserAdmin(UserAdmin):
    inlines = [ProfileInline]

admin.site.register(Movie)
admin.site.register(Profile, ProfileAdmin)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
