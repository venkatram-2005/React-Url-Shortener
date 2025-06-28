import axios from 'axios';

const API_BASE = 'https://react-short-url.vercel.app'; // replace this

export const createShortUrl = async (url: string, validity: number) => {
  const response = await axios.post(`${API_BASE}/shorturls`, {
    url,
    validity,
  });
  return response.data;
};

export const getStats = async (shortcode: string) => {
  const response = await axios.get(`${API_BASE}/shorturls/${shortcode}`);
  return response.data;
};
