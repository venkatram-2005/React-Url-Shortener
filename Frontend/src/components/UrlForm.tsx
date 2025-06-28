import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Typography,
  CircularProgress,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast from 'react-hot-toast';
import { createShortUrl } from '../services/api';

const presetDays = [1, 3, 7, 30, 90];

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [validityOption, setValidityOption] = useState<number | 'custom'>(1);
  const [customDays, setCustomDays] = useState<number>(5);
  const [shortLink, setShortLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL.');
      return;
    }

    const finalDays = validityOption === 'custom' ? customDays : validityOption;
    if (!finalDays || finalDays <= 0) {
      toast.error('Please enter a valid expiry duration.');
      return;
    }

    const validityMinutes = finalDays * 24 * 60;

    try {
      setLoading(true);
      const data = await createShortUrl(url, validityMinutes);
      setShortLink(data.shortLink);
      toast.success('Short URL created!');
    } catch (error: any) {
      const msg = error?.response?.data?.error || 'Something went wrong.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink);
    toast.success('Copied to clipboard!');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6" color="primary">
        Shorten your URL
      </Typography>

      <TextField
        label="Enter Long URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />

      <TextField
        select
        label="Expiry Duration (in days)"
        value={validityOption}
        onChange={(e) =>
          e.target.value === 'custom'
            ? setValidityOption('custom')
            : setValidityOption(Number(e.target.value))
        }
        fullWidth
      >
        {presetDays.map((days) => (
          <MenuItem key={days} value={days}>
            {days} day{days > 1 ? 's' : ''}
          </MenuItem>
        ))}
        <MenuItem value="custom">Custom</MenuItem>
      </TextField>

      {validityOption === 'custom' && (
        <TextField
          label="Custom Days"
          type="number"
          value={customDays}
          onChange={(e) => setCustomDays(Number(e.target.value))}
          fullWidth
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Creating...' : 'Shorten URL'}
      </Button>

      {shortLink && (
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Short Link Display */}
          <TextField
            label="Short URL"
            value={shortLink}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopy}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Shortcode Display */}
          <TextField
            label="Shortcode"
            value={shortLink.split('/').pop() || ''}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      const code = shortLink.split('/').pop() || '';
                      navigator.clipboard.writeText(code);
                      toast.success('Shortcode copied!');
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="caption" color="gray">
            This link will expire in{' '}
            {validityOption === 'custom' ? customDays : validityOption} day
            {(validityOption === 1 || customDays === 1) ? '' : 's'}.
          </Typography>
        </Box>
      )}

    </Box>
  );
};

export default UrlForm;
