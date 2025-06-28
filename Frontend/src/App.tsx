import { useState, useMemo } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Toaster } from 'react-hot-toast';
import UrlForm from './components/UrlForm';
import UrlStats from './components/UrlStats';

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.body.className = newMode;
  };

  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🔗 URL Shortener
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="center"
        alignItems="stretch"
        p={2}
        gap={3}
        minHeight="calc(100vh - 64px)"
        bgcolor="background.default"
        color="text.primary"
      >
        <Box
          flex={1}
          minWidth={300}
          bgcolor="background.paper"
          p={3}
          boxShadow={3}
          borderRadius={3}
        >
          <UrlForm />
        </Box>

        <Box
          flex={1}
          minWidth={300}
          bgcolor="background.paper"
          p={3}
          boxShadow={3}
          borderRadius={3}
          overflow="auto"
        >
          <UrlStats />
        </Box>
      </Box>

      <Toaster position="top-center" />
    </ThemeProvider>
  );
};

export default App;
