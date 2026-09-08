import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'
import MascotAvatar from './MascotAvatar'

export default function ProfilePage() {
  const { user } = useAuth()
  const [myUploads, setMyUploads] = useState([])
  const [downloads, setDownloads] = useState([])
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('resources').select('*').eq('uploaded_by', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setMyUploads(data || []))
    supabase.from('download_logs').select('*').eq('user_id', user.id).order('downloaded_at', { ascending: false })
      .then(({ data }) => setDownloads(data || []))
    supabase.from('emergency_logs').select('*').eq('user_id', user.id).order('triggered_at', { ascending: false })
      .then(({ data }) => setAlerts(data || []))
  }, [user])

  const stars = Array.from({ length: 50 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() < 0.2 ? 4 : 2,
  }))

  function Section({ title, icon, children }) {
    return (
      <div className="dialogue-box" style={{ marginBottom: '20px' }}>
        <div className="dialogue-header" style={{ background: 'var(--surface-hover)', color: 'var(--teal)', borderBottom: '3px solid var(--border)' }}>
          {icon} {title}
        </div>
        <div className="corner" style={{ top: -3, left: -3 }} />
        <div className="corner" style={{ top: -3, right: -3 }} />
        <div className="corner" style={{ bottom: -3, left: -3 }} />
        <div className="corner" style={{ bottom: -3, right: -3 }} />
        <div style={{ padding: '16px' }}>{children}</div>
      </div>
    )
  }

  function EmptyState({ text }) {
    return <p style={{ color: 'var(--text-muted)', fontFamily: 'VT323, monospace', fontSize: '17px', margin: 0 }}>{text}</p>
  }

  function Row({ children }) {
    return (
      <div style={{ border: '2px solid var(--border)', background: 'var(--surface)', padding: '10px 14px', marginBottom: '8px', fontFamily: 'VT323, monospace', fontSize: '17px' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} className="star" style={{ top: s.top, left: s.left, animationDelay: s.delay, width: s.size, height: s.size }} />
        ))}
      </div>

      <div style={{ maxWidth: '650px', margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: 64, height: 64, flexShrink: 0 }}>
            <MascotAvatar size={64} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>My Profile</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'VT323, monospace', fontSize: '18px' }}>{user?.email}</p>
          </div>
        </div>

        <Section title="MY UPLOADED FILES" icon="📤">
          {myUploads.length === 0 ? (
            <EmptyState text="You haven't uploaded anything yet." />
          ) : (
            myUploads.map((r) => (
              <Row key={r.id}>
                <strong style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>{r.title}</strong>
                <br />
                <span style={{ color: 'var(--text-muted)' }}>{r.course_name}</span>
              </Row>
            ))
          )}
        </Section>

        <Section title="DOWNLOAD HISTORY" icon="⬇">
          {downloads.length === 0 ? (
            <EmptyState text="No downloads yet." />
          ) : (
            downloads.map((d) => (
              <Row key={d.id}>
                {d.resource_title} <span style={{ color: 'var(--text-muted)' }}>— {new Date(d.downloaded_at).toLocaleString()}</span>
              </Row>
            ))
          )}
        </Section>

        <Section title="EMERGENCY ALERT HISTORY" icon="🚨">
          {alerts.length === 0 ? (
            <EmptyState text="No alerts sent — hopefully it stays that way!" />
          ) : (
            alerts.map((a) => (
              <Row key={a.id}>
                Alert sent <span style={{ color: 'var(--text-muted)' }}>— {new Date(a.triggered_at).toLocaleString()}</span>
              </Row>
            ))
          )}
        </Section>
      </div>
    </div>
  )
}