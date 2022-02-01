from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Artist(models.Model):
    name = models.CharField(max_length=100, null=False)

    def __str__(self):
        return f'{self.name}'


class Genre(models.Model):
    name = models.CharField(max_length=100, null=False)

    def __str__(self):
        return f'{self.name}'


class Mood(models.Model):
    name = models.CharField(max_length=100, null=False)

    def __str__(self):
        return f'{self.name}'


class Track(models.Model):
    id = models.CharField(primary_key=True, max_length=10)
    title = models.CharField(max_length=200, null=False)
    genres = models.ManyToManyField(Genre, related_name='genre')
    moods = models.ManyToManyField(Mood, related_name='mood')
    main_artists = models.ManyToManyField(Artist, related_name='main_artist')
    featured_artists = models.ManyToManyField(
        Artist, related_name='featured_artist')
    length = models.IntegerField(default=0)
    bpm = models.IntegerField(default=0)

    @property
    def audio(self):
        return '{}{}.{}'.format(settings.ASSETS_BASE, self.id, 'mp3')

    @property
    def cover_art(self):
        return '{}{}.{}'.format(settings.ASSETS_BASE, self.id, 'jpg')

    @property
    def waveform(self):
        return '{}{}.{}'.format(settings.ASSETS_BASE, self.id, 'json')

    @property
    def spotify(self):
        return '{}{}/{}'.format(settings.DSP_BASE, self.id, 'spotify')


class Playlist(models.Model):
    """
    This model could have been connected to the auth system if it was in place.
    """

    title = models.CharField(max_length=200, null=False, blank=False)
    cover = models.URLField(null=True)

    def __str__(self):
        return f'{self.title}'


class PlaylistTrack(models.Model):
    """
    I can think of a few reasons for this model:
    1. It separates itself from the Track and Playlist model so we could have the required
       metadata in an individual model aside. We don't need to clog the Track and Playlist
       models with unnecessary fields and data.
    2. Right now the relation is cascading but we can remove it so that if a track is deleted
       in the future we still would have it in our playlist. This will also be useful for
       analytics functions in the future.
    3. It also helps with things like ordering. Or maybe we wanted to save some data for the
       relation between a track and a playlist.
    """

    RANK_INCR = 20

    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, related_name='tracks')
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    rank = models.FloatField(validators=(MinValueValidator(1.0),), default=1.0)
    added_at = models.DateTimeField()

    class Meta:
        unique_together = (
            ('playlist', 'track'),
            ('playlist', 'rank'),
        )

    def __str__(self):
        return f'{self.rank}#{self.track} - {self.playlist}'
