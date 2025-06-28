import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import toast from 'react-hot-toast';
import { getStats } from '../services/api';

const UrlStats: React.FC = () => {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchStats = async () => {
    if (!shortcode.trim()) {
      toast.error('Enter a shortcode');
      return;
    }

    try {
      setLoading(true);
      const data = await getStats(shortcode.trim());
      setStats(data);
      toast.success('Stats fetched!');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Could not fetch stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      <Typography variant="h6" color="primary">
        URL Statistics
      </Typography>

      <TextField
        label="Enter Shortcode"
        variant="outlined"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleFetchStats}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Fetching...' : 'Get Stats'}
      </Button>

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Fetching stats, please wait...
        </Typography>
      )}

      {stats && (
        <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Original URL:
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
            {stats.originalUrl}
          </Typography>

          <Typography variant="body2" mt={1}>
            <strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Total Clicks:</strong> {stats.clicks}
          </Typography>

          <Typography variant="subtitle1" mt={2} gutterBottom>
            Click History:
          </Typography>

          {stats.clickDetails.length > 0 ? (
            <List
              sx={{
                maxHeight: '200px',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              {stats.clickDetails.map((click: any, idx: number) => (
                <React.Fragment key={idx}>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body2">
                      <strong>Time:</strong> {new Date(click.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Source:</strong> {click.source}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {click.location}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No clicks yet.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default UrlStats;
