import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid';
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider, useMutation, useQuery
} from 'react-query';
import { deletePlaylistTrack, getPlaylist } from '../../api/playlists';
import { playlistTrackToDict, Track } from '../../api/types';
import { flattenObject } from '../../commons/objectutils';
import PlaylistTrackModal from '../PlaylistTrackModal/PlaylistTrackModal';

export type PlaylistTracksTabProps = {
  playlistId: string;
  setNowPlaying: (track: Track) => void;
  queryClient: QueryClient;
}

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'main_artists',
    headerName: 'Main Artists',
    width: 200,
    align: 'left',
    headerAlign: 'left'
  },

  {
    field: 'genres',
    headerName: 'Genres',
    width: 200,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'moods',
    headerName: 'Moods',
    type: 'number',
    width: 200,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'length',
    headerName: 'Length',
    width: 100,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'added_at',
    headerName: 'Added At',
    width: 130,
    align: 'left',
    headerAlign: 'left'
  },
]


export default function PlaylistTracksTab({ playlistId, setNowPlaying, queryClient }: PlaylistTracksTabProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistTracksTabContent
        playlistId={playlistId}
        setNowPlaying={setNowPlaying}
        queryClient={queryClient} />
    </QueryClientProvider>
  );
}


function PlaylistTracksTabContent({ playlistId, setNowPlaying, queryClient }: PlaylistTracksTabProps) {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedTrackId, setSelectedTrackId] = React.useState("");
  const { isLoading, data } = useQuery("playlistTracks", () => getPlaylist(playlistId));
  const { mutate: deleteOne } = useMutation(deletePlaylistTrack, {
    onSuccess: _ => { },
    onError: () => { },
    onSettled: () => {
      queryClient.invalidateQueries("playlistsList")
      queryClient.invalidateQueries("playlistTracks")
    }
  });

  const handlePlay = () => {
    setNowPlaying(entriesMap[selectedTrackId])
    setModalOpen(false)
  }

  const handleRemove = () => {
    deleteOne({ pid: playlistId, tid: selectedTrackId })
    setModalOpen(false)
  }

  const handleDismiss = () => {
    setModalOpen(false)
  }

  if (isLoading)
    return <>Loading...</>

  if (!data)
    return <>No data</>

  const entries = data.tracks.map(t => playlistTrackToDict(t)).map(t => flattenObject(t));
  const entriesMap: { [key: string]: Track } = {};
  data.tracks.forEach((t) => {
    entriesMap[t.track.id] = t.track
  })
  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        {data.title}
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={entries}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          onRowClick={(params: GridRowParams, event: MuiEvent<React.MouseEvent>) => {
            event.defaultMuiPrevented = true;
            setSelectedTrackId(params.row.id);
            setModalOpen(true);
          }}
        />
      </div>
      <PlaylistTrackModal
        isOpen={isModalOpen}
        onDismiss={handleDismiss}
        onTrackPlayed={handlePlay}
        onTrackRemoved={handleRemove}
      />
    </>
  );
}
