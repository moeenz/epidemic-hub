from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory
from tracks.models import Playlist


class PlaylistTestCase(TestCase):
    fixtures = ['interview_data.json']

    def setUp(self) -> None:
        self.client = APIClient()
        self.factory = APIRequestFactory()

        return super().setUp()

    def test_create_playlist(self):
        playlist_title = 'My Playlist'
        response = self.client.post('/playlists/', {
            'title': playlist_title,
            'cover': 'https://some.place/for/cover.png'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(
            Playlist.objects.filter(title=playlist_title).count(), 1)

    def test_create_playlist_invalid_title(self):
        response = self.client.post('/playlists/', {
            'title': '',
            'cover': 'https://some.place/for/cover.png'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_modify_playlist_tracks(self):
        p = Playlist.objects.create(title='Working Playlist',
                                    cover='https://some.place/for/cover.png')

        response = self.client.post(f'/playlists/{p.id}/tracks/', {
            'tid': 'ZkuGOyOiiE',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(f'/playlists/{p.id}/tracks/', {
            'tid': 'em55KruCAt',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(f'/playlists/{p.id}/tracks/', {
            'tid': 'mX542l3F2Q',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.delete(f'/playlists/{p.id}/tracks/', {
            'tid': 'em55KruCAt',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_modify_invalid_playlist(self):
        response = self.client.post(f'/playlists/999999/tracks/', {
            'tid': 'mX542l3F2Q',
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_modify_playlist_invalid_data(self):
        p = Playlist.objects.create(title='Working Playlist',
                                    cover='https://some.place/for/cover.png')

        response = self.client.post(f'/playlists/{p.id}/tracks/', {
            'some_field_1': 'some_value_1',
            'some_field_2': 'some_value_2'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
