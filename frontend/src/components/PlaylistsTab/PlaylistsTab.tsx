import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridRowParams, MuiEvent } from '@mui/x-data-grid';
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider, useMutation, useQuery
} from 'react-query';
import { createPlaylist, deletePlaylist, getPlaylists } from '../../api/playlists';
import { Playlist, playlistToDict } from '../../api/types';
import { PlaylistCreateModal } from '../PlaylistCreateModal/PlaylistCreateModal';
import PlaylistsModal, { PlaylistAction } from '../PlaylistsModal/PlaylistsModal';

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 300
  }
]

export type PlaylistTabProps = {
  queryClient: QueryClient,
  onPlaylistSelected: (playlist: Playlist) => void;
  onPlaylistRemoved: (playlist: Playlist) => void;
}

export default function PlaylistsTab({ queryClient, onPlaylistSelected, onPlaylistRemoved }: PlaylistTabProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistsTabContent
        queryClient={queryClient}
        onPlaylistSelected={onPlaylistSelected}
        onPlaylistRemoved={onPlaylistRemoved}
      />
    </QueryClientProvider>
  );
}

function PlaylistsTabContent({ queryClient, onPlaylistSelected, onPlaylistRemoved }: PlaylistTabProps) {
  const [isOptionsModalOpen, setOptionsModalOpen] = React.useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Playlist | null>(null);
  const { isLoading, error, data } = useQuery("playlistsList", getPlaylists);
  const { mutate: deleteOne } = useMutation(deletePlaylist, {
    onSuccess: _ => { },
    onError: () => { },
    onSettled: () => {
      queryClient.invalidateQueries("playlistsList")
    }
  });

  const { mutate: createOne } = useMutation(createPlaylist, {
    onSuccess: _ => { },
    onError: () => { },
    onSettled: () => {
      queryClient.invalidateQueries("playlistsList")
    }
  });

  const handleAction = (action: PlaylistAction) => {
    if (!selected) {
      return
    }
    switch (action) {
      case PlaylistAction.View:
        onPlaylistSelected(selected)
        break;
      case PlaylistAction.Delete:
        deleteOne(selected.id)
        onPlaylistRemoved(selected)
        break;
    }
    setOptionsModalOpen(false)
  }

  const handleCreate = (title: string, cover: string) => {
    createOne({ title, cover })
    setCreateModalOpen(false)
  }

  const onOptionsModalDismiss = React.useCallback(() => {
    setOptionsModalOpen(false)
  }, [])

  const onCreateModalDismiss = React.useCallback(() => {
    setCreateModalOpen(false)
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

  const entries = data.map(p => playlistToDict(p))
  const entriesMap: { [key: string]: Playlist } = {};
  data.forEach((p) => {
    entriesMap[p.id] = p
  })

  return (
    <>
      <Button
        variant="contained"
        color="success"
        style={{ marginBottom: 16 }}
        onClick={() => setCreateModalOpen(true)}>
        New Playlist
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={entries}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          onRowClick={(params: GridRowParams, event: MuiEvent<React.MouseEvent>) => {
            event.defaultMuiPrevented = true;
            setSelected(entriesMap[params.row.id]);
            setOptionsModalOpen(true);
          }}
        />
        <PlaylistsModal
          isOpen={isOptionsModalOpen}
          onDismiss={onOptionsModalDismiss}
          onAction={handleAction}
        />
        <PlaylistCreateModal
          isOpen={isCreateModalOpen}
          onDismiss={onCreateModalDismiss}
          onSubmit={handleCreate}
        />
      </div>
    </>
  );
}
