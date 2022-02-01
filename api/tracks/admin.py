from django.contrib import admin

from tracks.models import *

tracks_models = (
    Artist,
    Genre,
    Mood,
    Track,
    Playlist,
    PlaylistTrack
)

for model in tracks_models:
    admin.site.register(model)
