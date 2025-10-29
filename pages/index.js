import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [ipInfo, setIpInfo] = useState(null);
  const [pingResults, setPingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIPInfo();
  }, []);

  const fetchIPInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/ipinfo');
      if (!response.ok) throw new Error('Failed to fetch IP info');
      const data = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runPingTest = async () => {
    try {
      setPinging(true);
      const response = await fetch('/api/ping');
      if (!response.ok) throw new Error('Failed to ping DNS servers');
      const data = await response.json();
      setPingResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPinging(false);
    }
  };

  return (
    <>
      <Head>
        <title>IP Information & DNS Ping Tool</title>
        <meta name="description" content="Check your IP address and network information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>🌐 IP Information Dashboard</h1>

          {loading && <div style={styles.loader}>Loading your IP information...</div>}

          {error && <div style={styles.error}>Error: {error}</div>}

          {ipInfo && (
            <>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Your IP Address</h2>
                <div style={styles.ipAddress}>{ipInfo.ip}</div>
                {ipInfo.hostname && ipInfo.hostname !== 'N/A' && (
                  <div style={styles.hostname}>Hostname: {ipInfo.hostname}</div>
                )}
              </div>

              <div style={styles.grid}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📍 Location</h3>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Country:</span>
                    <span style={styles.value}>{ipInfo.country} ({ipInfo.countryCode})</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>City:</span>
                    <span style={styles.value}>{ipInfo.city}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Region:</span>
                    <span style={styles.value}>{ipInfo.region}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Coordinates:</span>
                    <span style={styles.value}>{ipInfo.location}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Timezone:</span>
                    <span style={styles.value}>{ipInfo.timezone}</span>
                  </div>
                  {ipInfo.postal && (
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Postal Code:</span>
                      <span style={styles.value}>{ipInfo.postal}</span>
                    </div>
                  )}
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>🔌 Network Information</h3>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>ISP:</span>
                    <span style={styles.value}>{ipInfo.isp}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Organization:</span>
                    <span style={styles.value}>{ipInfo.org}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>ASN:</span>
                    <span style={styles.value}>{ipInfo.asn}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Connection Type:</span>
                    <span style={styles.value}>{ipInfo.connectionType}</span>
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>🔐 Security Status</h3>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>VPN Detected:</span>
                    <span style={{...styles.value, ...styles.badge, ...(ipInfo.isVpn ? styles.badgeRed : styles.badgeGreen)}}>
                      {ipInfo.isVpn ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Proxy Detected:</span>
                    <span style={{...styles.value, ...styles.badge, ...(ipInfo.isProxy ? styles.badgeRed : styles.badgeGreen)}}>
                      {ipInfo.isProxy ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Tor Exit Node:</span>
                    <span style={{...styles.value, ...styles.badge, ...(ipInfo.isTor ? styles.badgeRed : styles.badgeGreen)}}>
                      {ipInfo.isTor ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>Hosting/DC:</span>
                    <span style={{...styles.value, ...styles.badge, ...(ipInfo.isHosting ? styles.badgeOrange : styles.badgeGreen)}}>
                      {ipInfo.isHosting ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.pingSection}>
                <div style={styles.pingHeader}>
                  <h2 style={styles.cardTitle}>⚡ DNS Server Ping Test</h2>
                  <button
                    onClick={runPingTest}
                    disabled={pinging}
                    style={{...styles.button, ...(pinging ? styles.buttonDisabled : {})}}
                  >
                    {pinging ? 'Pinging...' : 'Run Ping Test'}
                  </button>
                </div>

                {pingResults.length > 0 && (
                  <div style={styles.pingResults}>
                    <div style={styles.tableHeader}>
                      <div style={{...styles.tableCell, flex: 2}}>DNS Server</div>
                      <div style={styles.tableCell}>IP Address</div>
                      <div style={styles.tableCell}>Status</div>
                      <div style={styles.tableCell}>Latency</div>
                    </div>
                    {pingResults.map((result, index) => (
                      <div key={index} style={styles.tableRow}>
                        <div style={{...styles.tableCell, flex: 2, fontWeight: '600'}}>
                          {result.name}
                        </div>
                        <div style={styles.tableCell}>{result.host}</div>
                        <div style={styles.tableCell}>
                          <span style={{
                            ...styles.badge,
                            ...(result.status === 'online' ? styles.badgeGreen :
                                result.status === 'degraded' ? styles.badgeOrange :
                                styles.badgeRed)
                          }}>
                            {result.status}
                          </span>
                        </div>
                        <div style={styles.tableCell}>
                          {result.latency ? `${result.latency}ms` : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button onClick={fetchIPInfo} style={styles.refreshButton}>
            🔄 Refresh IP Info
          </button>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: '2rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333',
  },
  ipAddress: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '8px',
    fontFamily: 'monospace',
  },
  hostname: {
    textAlign: 'center',
    marginTop: '0.5rem',
    color: '#666',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  label: {
    fontWeight: '600',
    color: '#4a5568',
  },
  value: {
    color: '#2d3748',
    textAlign: 'right',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'inline-block',
  },
  badgeGreen: {
    background: '#c6f6d5',
    color: '#22543d',
  },
  badgeRed: {
    background: '#fed7d7',
    color: '#742a2a',
  },
  badgeOrange: {
    background: '#feebc8',
    color: '#7c2d12',
  },
  pingSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  pingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  button: {
    background: '#667eea',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  buttonDisabled: {
    background: '#a0aec0',
    cursor: 'not-allowed',
  },
  refreshButton: {
    background: 'white',
    color: '#667eea',
    padding: '1rem 2rem',
    borderRadius: '8px',
    border: '2px solid white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  pingResults: {
    marginTop: '1rem',
  },
  tableHeader: {
    display: 'flex',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '8px 8px 0 0',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  tableRow: {
    display: 'flex',
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
  loader: {
    textAlign: 'center',
    color: 'white',
    fontSize: '1.2rem',
    padding: '2rem',
  },
  error: {
    background: '#fed7d7',
    color: '#742a2a',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
};
