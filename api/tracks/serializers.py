from rest_framework import serializers

from tracks.models import Playlist, PlaylistTrack, Track


class TrackSerializer(serializers.ModelSerializer):
    genres = serializers.StringRelatedField(many=True)
    moods = serializers.StringRelatedField(many=True)
    main_artists = serializers.StringRelatedField(many=True)
    featured_artists = serializers.StringRelatedField(many=True)

    class Meta:
        model = Track
        fields = [
            "id",
            "title",
            "length",
            "bpm",
            "genres",
            "moods",
            "main_artists",
            "featured_artists",
            "audio",
            "cover_art",
            "waveform",
            "spotify",
        ]


class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer()

    class Meta:
        model = PlaylistTrack
        fields = (
            'id',
            'track',
            'rank',
            'added_at'
        )


class PlaylistSerializer(serializers.ModelSerializer):
    tracks = PlaylistTrackSerializer(read_only=True, many=True)

    class Meta:
        model = Playlist
        fields = (
            'id',
            'title',
            'cover',
            'tracks',
        )

    def get_tracks(self, instance):
        items = instance.tracks.all().order_by('rank')
        return PlaylistTrackSerializer(items, many=True, read_only=True).data


class PlaylistAddOrRemoveSerializer(serializers.Serializer):
    tid = serializers.CharField(max_length=10)


class PlaylistReorderSerializer(serializers.Serializer):
    tid = serializers.CharField(max_length=10)
    rank = serializers.FloatField()
