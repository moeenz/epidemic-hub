import Snackbar from '@mui/material/Snackbar';
import { DataGrid, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid';
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider, useMutation, useQuery
} from 'react-query';
import { addPlaylistTrack } from '../../api/playlists';
import { getTracks } from '../../api/tracks';
import { Track, trackToDict } from '../../api/types';
import TracksModal from '../TracksModal/TracksModal';

type TracksTabProps = {
  queryClient: QueryClient;
  setNowPlaying: (track: Track) => void;
}

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 300,
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
    width: 150,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'length',
    headerName: 'Length',
    width: 100,
    align: 'left',
    headerAlign: 'left'
  }
]

export default function TracksTab({ queryClient, setNowPlaying }: TracksTabProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TracksTabContent queryClient={queryClient} setNowPlaying={setNowPlaying} />
    </QueryClientProvider>
  );
}

function TracksTabContent({ queryClient, setNowPlaying }: TracksTabProps) {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);
  const [selectedTrackId, setSelectedTrackId] = React.useState("");
  const { isLoading, error, data } = useQuery("tracksList", getTracks);
  const { mutate: addOne } = useMutation(addPlaylistTrack, {
    onSuccess: _ => { },
    onError: () => { },
    onSettled: () => {
      queryClient.invalidateQueries("playlistsList")
      queryClient.invalidateQueries("playlistTracks")
    }
  });

  const onPlaylistSelected = (pid: string) => {
    addOne({ pid: pid, tid: selectedTrackId })
    setModalOpen(false)
    setSnackbarOpen(true)
  };

  const onTrackPlayed = () => {
    setNowPlaying(entriesMap[selectedTrackId])
    setModalOpen(false)
  }

  const onModalDismiss = React.useCallback(() => {
    setModalOpen(false)
  }, [])

  const onSnackbarDismiss = React.useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  if (isLoading)
    return (
      <>Loading...</>
    );

  if (error)
    return (
      <>Error: error.message</>
    );

  if (!data) {
    return <>No data</>
  }

  const entries = data.map(t => trackToDict(t));
  const entriesMap: { [key: string]: Track } = {};
  data.forEach((t) => {
    entriesMap[t.id] = t
  })

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={entries}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        onRowClick={(params: GridRowParams, event: MuiEvent<React.MouseEvent>) => {
          event.defaultMuiPrevented = true
          setSelectedTrackId(params.row.id)
          setModalOpen(true)
        }}
      />
      <TracksModal
        isOpen={isModalOpen}
        onDismiss={onModalDismiss}
        onPlaylistSelected={onPlaylistSelected}
        onTrackPlayed={onTrackPlayed}
        queryClient={queryClient} />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackbarDismiss}
        message="Track added to playlist"
      />
    </div>
  );
}
