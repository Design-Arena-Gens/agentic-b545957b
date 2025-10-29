export default async function handler(req, res) {
  try {
    // Get IP info from ipapi.co
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();

    // Get additional info from ipwhois.app
    const whoisResponse = await fetch(`https://ipwhois.app/json/${ipData.ip}`);
    const whoisData = await whoisResponse.json();

    // Combine data
    const combinedData = {
      ip: ipData.ip || whoisData.ip,
      hostname: whoisData.hostname || ipData.hostname || 'N/A',
      city: ipData.city || whoisData.city,
      region: ipData.region || whoisData.region,
      country: ipData.country_name || whoisData.country,
      countryCode: ipData.country || whoisData.country_code,
      location: `${ipData.latitude || whoisData.latitude}, ${ipData.longitude || whoisData.longitude}`,
      latitude: ipData.latitude || whoisData.latitude,
      longitude: ipData.longitude || whoisData.longitude,
      timezone: ipData.timezone || whoisData.timezone,
      isp: ipData.org || whoisData.isp,
      asn: ipData.asn || whoisData.asn,
      org: ipData.org || whoisData.org,
      postal: ipData.postal || whoisData.postal,
      isVpn: whoisData.security?.vpn || false,
      isProxy: whoisData.security?.proxy || false,
      isTor: whoisData.security?.tor || false,
      isRelay: whoisData.security?.relay || false,
      isHosting: whoisData.type === 'Hosting' || false,
      connectionType: whoisData.connection?.type || 'Unknown',
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching IP info:', error);
    res.status(500).json({ error: 'Failed to fetch IP information' });
  }
}
