import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { getDefaultModalStyle } from '../../commons/modalutils';

export enum PlaylistAction {
  View = 1,
  Delete
}

type PlaylistsModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onAction: (action: PlaylistAction) => void;
}

export default function PlaylistsModal({ isOpen, onDismiss, onAction }: PlaylistsModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={() => onDismiss()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={getDefaultModalStyle()}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add To Playlist
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onAction(PlaylistAction.View)}>
              <ListItemText primary="View Playlist" />
            </ListItemButton>
            <Divider />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onAction(PlaylistAction.Delete)}>
              <ListItemText primary="Delete Playlist" />
            </ListItemButton>
            <Divider />
          </ListItem>
        </List>
      </Box>
    </Modal >
  );
}
