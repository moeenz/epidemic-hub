import axios from "axios";
import { buildEndpoint } from "./endpoints";
import { Track } from "./types";

export function getTracks(): Promise<Track[]> {
  return axios.get<Track[]>(buildEndpoint("/tracks/")).then((res) => res.data)
}
