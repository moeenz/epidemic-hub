import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import {
  QueryClient,
  QueryClientProvider, useQuery
} from 'react-query';
import { getPlaylists } from '../../api/playlists';
import { Playlist } from '../../api/types';
import { getDefaultModalStyle } from '../../commons/modalutils';

type TracksModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onPlaylistSelected: (pid: string) => void;
  onTrackPlayed: () => void;
  queryClient: QueryClient;
}

export default function TracksModal(
  { isOpen, onDismiss, onPlaylistSelected, onTrackPlayed, queryClient }:
    TracksModalProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TracksModalContent
        isOpen={isOpen}
        onDismiss={onDismiss}
        onPlaylistSelected={onPlaylistSelected}
        onTrackPlayed={onTrackPlayed}
        queryClient={queryClient} />
    </QueryClientProvider>
  );
}

function TracksModalContent(
  { isOpen, onDismiss, onPlaylistSelected, onTrackPlayed, queryClient }:
    TracksModalProps) {
  const { isLoading, data } = useQuery("playlistsList", getPlaylists);

  if (isLoading)
    return (
      <>Loading...</>
    );

  if (!data)
    return (
      <>No data</>
    );

  return (
    <Modal
      open={isOpen}
      onClose={() => onDismiss()}
    >
      <Box sx={getDefaultModalStyle()}>
        <Button
          style={{ width: '100%', marginBottom: 16 }}
          variant="contained"
          color="primary"
          onClick={() => onTrackPlayed()}>
          Play Track
        </Button>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add To Playlist
        </Typography>
        {data.length === 0 ?
          (
            <Typography id="modal-modal-title" variant="body1" component="p" color={'#aaa'}>
              You don't have any playlists yet
            </Typography>
          ) :
          (
            <List>
              {data.map((playlist: Playlist) =>
                <ListItem disablePadding key={playlist.id}>
                  <ListItemButton onClick={() => onPlaylistSelected(playlist.id)}>
                    <ListItemText primary={playlist.title} />
                  </ListItemButton>
                  <Divider />
                </ListItem>)
              }
            </List>
          )}
      </Box>
    </Modal >
  );
}
