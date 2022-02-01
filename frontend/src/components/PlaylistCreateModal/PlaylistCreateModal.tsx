import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { getDefaultModalStyle } from '../../commons/modalutils';

type PlaylistCreateModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onSubmit: (title: string, cover: string) => void;
}

export function PlaylistCreateModal({ isOpen, onDismiss, onSubmit }: PlaylistCreateModalProps) {
  const [title, setTitle] = React.useState("");
  const [cover, setCover] = React.useState("");

  const handleSubmit = () => {
    if (title && cover) {
      onSubmit(title, cover)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => onDismiss()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={getDefaultModalStyle()} noValidate autoComplete="off">
        <Typography variant="h5" gutterBottom component="div" style={{ marginBottom: 16 }}>
          Playlist Details
        </Typography>
        <div>
          <TextField
            required
            id="input-title"
            label="Title"
            variant="outlined"
            style={{ marginBottom: 16 }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField id="input-cover"
            required
            label="Cover URL"
            variant="outlined"
            style={{ marginBottom: 16 }}
            onChange={(e) => setCover(e.target.value)}
          />
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Create Playlist
          </Button>
        </div>
      </Box>
    </Modal >
  );
}
