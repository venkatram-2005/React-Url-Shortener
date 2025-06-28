import geoip from "geoip-lite";

export const getGeoLocation = (ip: string): string => {
  const geo = geoip.lookup(ip);

  // Avoid empty city or undefined country
  if (geo && geo.city && geo.country) {
    return `${geo.city}, ${geo.country}`;
  }

  if (geo && geo.country) {
    return `Unknown City, ${geo.country}`;
  }

  return "Unknown Location";
};
