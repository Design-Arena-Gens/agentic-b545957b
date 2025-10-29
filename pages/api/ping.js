export default async function handler(req, res) {
  const dnsServers = [
    { name: 'Google DNS Primary', host: '8.8.8.8', url: 'https://dns.google/resolve?name=google.com&type=A' },
    { name: 'Google DNS Secondary', host: '8.8.4.4', url: 'https://dns.google/resolve?name=google.com&type=A' },
    { name: 'Cloudflare DNS Primary', host: '1.1.1.1', url: 'https://1.1.1.1/cdn-cgi/trace' },
    { name: 'Cloudflare DNS Secondary', host: '1.0.0.1', url: 'https://1.1.1.1/cdn-cgi/trace' },
    { name: 'OpenDNS Primary', host: '208.67.222.222', url: 'https://dns.google/resolve?name=google.com&type=A' },
    { name: 'OpenDNS Secondary', host: '208.67.220.220', url: 'https://dns.google/resolve?name=google.com&type=A' },
    { name: 'Quad9 DNS', host: '9.9.9.9', url: 'https://dns.google/resolve?name=google.com&type=A' },
    { name: 'AdGuard DNS', host: '94.140.14.14', url: 'https://dns.google/resolve?name=google.com&type=A' },
  ];

  const results = await Promise.all(
    dnsServers.map(async (server) => {
      try {
        const start = Date.now();
        const response = await fetch(server.url, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        const latency = Date.now() - start;

        return {
          name: server.name,
          host: server.host,
          status: response.ok ? 'online' : 'degraded',
          latency: latency,
          statusCode: response.status,
        };
      } catch (error) {
        return {
          name: server.name,
          host: server.host,
          status: 'offline',
          latency: null,
          error: error.message,
        };
      }
    })
  );

  res.status(200).json(results);
}
