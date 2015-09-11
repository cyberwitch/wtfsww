from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from api.models import Movie, Profile


class MovieshipInline(admin.TabularInline):
    model = Profile.movies.through


class ProfileAdmin(admin.ModelAdmin):
    inlines = [MovieshipInline]
    profile = None

    def get_form(self, request, obj=None, **kwargs):
        self.profile = obj
        return super(ProfileAdmin, self).get_form(request, obj, **kwargs)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == 'friends' and self.profile:
            kwargs['queryset'] = Profile.objects.exclude(pk=self.profile.pk)
        return super(ProfileAdmin, self).formfield_for_manytomany(db_field, request, **kwargs)


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False


class UserAdmin(UserAdmin):
    inlines = [ProfileInline]

admin.site.register(Movie)
admin.site.register(Profile, ProfileAdmin)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
