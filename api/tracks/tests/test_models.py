from commons.timeutil import utc_now
from django.db.utils import IntegrityError
from django.test import TestCase
from tracks.models import Playlist, PlaylistTrack, Track


class PlaylistTestCases(TestCase):
    fixtures = ['interview_data.json']

    def test_create_playlist(self):
        t1 = Track.objects.all()[0]
        t2 = Track.objects.all()[1]

        p = Playlist.objects.create(title='Test Playlist 1',
                                    cover='https://some.place/for/cover.png')
        self.assertEqual(p.title, 'Test Playlist 1')
        self.assertEqual(p.cover, 'https://some.place/for/cover.png')

        pt1 = PlaylistTrack.objects.create(
            playlist=p, track=t1, rank=1.0, added_at=utc_now())
        pt2 = PlaylistTrack.objects.create(
            playlist=p, track=t2, rank=21.0, added_at=utc_now())

        self.assertEqual(pt1.track.title, t1.title)
        self.assertEqual(pt2.track.title, t2.title)

    def test_create_playlist_duplicate_tracks(self):
        t1 = Track.objects.all()[0]

        p = Playlist.objects.create(title='Test Playlist 2',
                                    cover='https://some.place/for/cover.png')

        with self.assertRaises(IntegrityError):
            PlaylistTrack.objects.create(
                playlist=p, track=t1, added_at=utc_now())
            PlaylistTrack.objects.create(
                playlist=p, track=t1, added_at=utc_now())

    def test_create_playlist_duplicate_ranks(self):
        t1 = Track.objects.all()[0]
        t2 = Track.objects.all()[1]

        p = Playlist.objects.create(title='Test Playlist 3',
                                    cover='https://some.place/for/cover.png')

        with self.assertRaises(IntegrityError):
            PlaylistTrack.objects.create(
                playlist=p, track=t1, added_at=utc_now())
            PlaylistTrack.objects.create(
                playlist=p, track=t2, added_at=utc_now())
