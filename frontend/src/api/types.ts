import moment from 'moment'
import { formatSeconds } from '../commons/timeutils'

export interface Track {
  id: string;
  title: string;
  length: number;
  bpm: number;
  genres: string[];
  moods: string[];
  main_artists: string[];
  featured_artists: string[];
  audio: string;
  cover_art: string;
  waveform: string;
  spotify: string;
}

export function trackToDict(t: Track): { [key: string]: any; } {
  return {
    "id": t.id,
    "title": t.title,
    "length": formatSeconds(t.length),
    "bpm": t.bpm,
    "genres": t.genres.join(', '),
    "moods": t.moods.join(', '),
    "main_artists": t.main_artists.join(', '),
    "featured_artists": t.featured_artists.join(', '),
    "audio": t.audio,
    "cover_art": t.cover_art,
    "waveform": t.waveform,
    "spotify": t.spotify
  }
}

export interface Playlist {
  id: string;
  title: string;
  cover: string;
  tracks: PlaylistTrack[];
}

export function playlistToDict(p: Playlist): { [key: string]: any; } {
  return {
    "id": p.id,
    "title": p.title,
    "cover": p.cover,
    "tracks": p.tracks.map((t) => playlistTrackToDict(t))
  }
}

export interface PlaylistTrack {
  id: string;
  track: Track;
  rank: number;
  added_at: Date;
}

export function playlistTrackToDict(p: PlaylistTrack): { [key: string]: any; } {
  return {
    "id": p.id,
    "track": trackToDict(p.track),
    "rank": p.rank,
    "added_at": moment(p.added_at).fromNow(),
  }
}