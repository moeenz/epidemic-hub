import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import {
  QueryClient
} from 'react-query';
import { Playlist, Track } from '../../api/types';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import PlaylistsTab from '../PlaylistsTab/PlaylistsTab';
import PlaylistTracksTab from '../PlaylistTracksTab/PlaylistTracksTab';
import TracksTab from '../TracksTab/TracksTab';

const queryClient = new QueryClient();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`home-tabpanel-${index}`}
      aria-labelledby={`home-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `home-tabpanel-${index}`,
  };
}

export default function HomePanel() {
  const [value, setValue] = React.useState(0);
  const [nowPlaying, setNowPlaying] = React.useState<Track | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<Playlist | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setValue(2)
  }

  const handlePlaylistRemove = (playlist: Playlist) => {
    if (selectedPlaylist && selectedPlaylist.id === playlist.id) {
      setSelectedPlaylist(null)
    }
  }

  const handleNowPlaying = (track: Track) => {
    setNowPlaying(track)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Tracks" {...a11yProps(0)} />
          <Tab label="Playlists" {...a11yProps(1)} />
          {selectedPlaylist && <Tab label={selectedPlaylist.title} {...a11yProps(2)} />}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TracksTab queryClient={queryClient} setNowPlaying={handleNowPlaying} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PlaylistsTab
          queryClient={queryClient}
          onPlaylistSelected={handlePlaylistSelect}
          onPlaylistRemoved={handlePlaylistRemove}
        />
      </TabPanel>
      {
        selectedPlaylist &&
        <TabPanel value={value} index={2}>
          <PlaylistTracksTab
            queryClient={queryClient}
            playlistId={selectedPlaylist.id}
            setNowPlaying={handleNowPlaying}
          />
        </TabPanel>
      }
      {nowPlaying ? <AudioPlayer track={nowPlaying} /> : null}
    </Box>
  );
}
