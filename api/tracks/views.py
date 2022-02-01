from commons.timeutil import utc_now
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, HttpResponseServerError
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from tracks.models import Playlist, PlaylistTrack, Track
from tracks.serializers import (PlaylistAddOrRemoveSerializer,
                                PlaylistReorderSerializer, PlaylistSerializer,
                                TrackSerializer)


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = ()


class PlaylistView(viewsets.ReadOnlyModelViewSet,
                   mixins.CreateModelMixin, mixins.DestroyModelMixin):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = ()


class PlaylistTracksView(APIView):
    """For this collection of endpoints the current Spotify contract is in place:

    - [POST] /playlists/{id}/tracks/: Add track to playlist
    - [DELETE] /playlists/{id}/tracks/: Delete track from playlist
    - [PUT] /playlists/{id}/tracks/: Reorder track in playlist

    One other approach would have been to target the PlaylistTrack object directly.
    """

    def get_serializer_class(self):
        if self.request.method in ('POST', 'DELETE'):
            return PlaylistAddOrRemoveSerializer
        elif self.request.method == 'PUT':
            return PlaylistReorderSerializer
        else:
            raise Exception('no serializer found for this request method')

    def get_playlist(self, id):
        try:
            return Playlist.objects.get(id=id)
        except ObjectDoesNotExist:
            raise Http404

    def get_track(self, tid):
        try:
            return Track.objects.get(id=tid)
        except ObjectDoesNotExist:
            raise Http404

    def get_playlist_track(self, pid, tid):
        try:
            return PlaylistTrack.objects.get(playlist_id=pid, track_id=tid)
        except ObjectDoesNotExist:
            raise Http404

    def post(self, request, id):
        playlist = self.get_playlist(id)

        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        track = self.get_track(serializer.data['tid'])

        last_track = PlaylistTrack.objects.filter(
            playlist=playlist).order_by('rank').last()
        if last_track is None:
            new_rank = 1
        else:
            new_rank = last_track.rank + PlaylistTrack.RANK_INCR

        try:
            PlaylistTrack.objects.create(
                playlist=playlist,
                track=track,
                rank=new_rank,
                added_at=utc_now()
            )
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, id):
        playlist = self.get_playlist(id)

        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        playlist_track = self.get_playlist_track(
            playlist.id, serializer.data['tid'])
        try:
            playlist_track.delete()
        except:
            raise HttpResponseServerError

        return Response(status=status.HTTP_200_OK)

    def put(self, request, id):
        """Client can calculate the average of top and bottom tracks and updatesthe rank
        with this new average. For example consider a playlist like this:
            - Track 1 [rank: 1]
            - Track 2 [rank: 21]
            - Track 3 [rank: 41]

        If you wanted to move the third track to the second place, you update its rank
        with value (1 + 21) / 2 = 11. This way, you won't need subsequent updates for other
        tracks as well. One write operation does the job.
        """

        playlist = self.get_playlist(id)

        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        playlist_track = self.get_playlist_track(
            playlist.id, serializer.data['tid'])
        try:
            playlist_track.rank = serializer.data['rank']
            playlist_track.save()
        except:
            raise HttpResponseServerError

        return Response(status=status.HTTP_200_OK)
