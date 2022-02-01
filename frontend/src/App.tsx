import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import HomePanel from './components/HomePanel/HomePanel';
import banner from "./assets/banner.png";

export default function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
        },
        typography: {
          fontFamily: 'Epidemic',
        }
      }),
    [],
  );

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container style={{ marginTop: '16px' }}>
          <Box
            component="img"
            style={{ width: "70%" }}
            alt="Epidemic Sound Banner"
            src={banner}
            marginTop={4}
          />
          <Box sx={{ height: '100vh' }}>
            <HomePanel />
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment >
  );
}
