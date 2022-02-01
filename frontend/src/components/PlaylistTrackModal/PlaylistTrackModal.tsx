import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { getDefaultModalStyle } from '../../commons/modalutils';

type PlaylistTrackModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onTrackPlayed: () => void;
  onTrackRemoved: () => void;
}


export default function PlaylistTrackModal(
  { isOpen, onDismiss, onTrackPlayed, onTrackRemoved }:
    PlaylistTrackModalProps) {
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
        <Button
          style={{ width: '100%', marginBottom: 16 }}
          variant="contained"
          color="error"
          onClick={() => onTrackRemoved()}>
          Remove Track
        </Button>
      </Box>
    </Modal >
  );
}
