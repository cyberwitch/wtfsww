from django.conf.urls import include, url

urlpatterns = [
    url(r'^api/v1.0/', include('api.urls')),
]
