from django.urls import path
from rest_framework import routers

from tracks.views import PlaylistTracksView, PlaylistView, TrackViewSet

router = routers.DefaultRouter()
router.register(r'tracks', TrackViewSet)
router.register(r'playlists', PlaylistView)

urlpatterns = [
    path('playlists/<int:id>/tracks/',
         PlaylistTracksView.as_view(), name='playlist_tracks')
]

urlpatterns += router.urls
