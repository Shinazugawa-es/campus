import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'

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

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>

      <section style={{ marginTop: '24px' }}>
        <h3>My Uploaded Files</h3>
        {myUploads.length === 0 ? <p>None yet.</p> : (
          <ul>{myUploads.map(r => <li key={r.id}>{r.title} — {r.course_name}</li>)}</ul>
        )}
      </section>

      <section style={{ marginTop: '24px' }}>
        <h3>Download History</h3>
        {downloads.length === 0 ? <p>None yet.</p> : (
          <ul>{downloads.map(d => <li key={d.id}>{d.resource_title} — {new Date(d.downloaded_at).toLocaleString()}</li>)}</ul>
        )}
      </section>

      <section style={{ marginTop: '24px' }}>
        <h3>Emergency Alert History</h3>
        {alerts.length === 0 ? <p>None yet.</p> : (
          <ul>{alerts.map(a => <li key={a.id}>{new Date(a.triggered_at).toLocaleString()}</li>)}</ul>
        )}
      </section>
    </div>
  )
}