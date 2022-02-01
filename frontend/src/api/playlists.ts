import axios from "axios";
import { buildEndpoint } from "./endpoints";
import { Playlist, PlaylistTrack } from "./types";

export function getPlaylist(id: string): Promise<Playlist> {
  return axios.get<Playlist>(buildEndpoint(`/playlists/${id}`)).then((res) => res.data)
}

export function getPlaylists(): Promise<Playlist[]> {
  return axios.get<Playlist[]>(buildEndpoint("/playlists/")).then((res) => res.data)
}

export function deletePlaylist(id: string): Promise<Response> {
  return axios.delete(buildEndpoint(`/playlists/${id}/`)).then(res => res.data)
}

export function createPlaylist(data: { title: string, cover: string }): Promise<Playlist> {
  return axios.post<Playlist>(
    buildEndpoint(`/playlists/`),
    data)
    .then(res => res.data)
}

export function getPlaylistTracks(pid: string): Promise<PlaylistTrack[]> {
  return axios.get<PlaylistTrack[]>(buildEndpoint(`/playlists/${pid}/tracks/`)).then((res) => res.data)
}

export function addPlaylistTrack(data: { pid: string, tid: string }): Promise<Response> {
  return axios.post(
    buildEndpoint(`/playlists/${data.pid}/tracks/`),
    { tid: data.tid })
    .then(res => res.data);
}

export function deletePlaylistTrack(data: { pid: string, tid: string }): Promise<Response> {
  return axios.delete(
    buildEndpoint(`/playlists/${data.pid}/tracks/`),
    { data: { tid: data.tid } })
    .then(res => res.data);
}
