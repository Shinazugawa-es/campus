import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function ResourceList({ refreshKey }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseFilter, setCourseFilter] = useState('')

  useEffect(() => {
    fetchResources()
  }, [refreshKey])

  async function fetchResources() {
    setLoading(true)
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setResources(data)
    setLoading(false)
  }

  const filteredResources = courseFilter
    ? resources.filter((r) => r.course_name.toLowerCase().includes(courseFilter.toLowerCase()))
    : resources

  return (
    <div className="dialogue-box">
      <div className="dialogue-header" style={{ background: 'var(--surface-hover)', color: 'var(--teal)', borderBottom: '3px solid var(--border)' }}>
        📚 BROWSE RESOURCES
      </div>
      <div className="corner" style={{ top: -3, left: -3 }} />
      <div className="corner" style={{ top: -3, right: -3 }} />
      <div className="corner" style={{ bottom: -3, left: -3 }} />
      <div className="corner" style={{ bottom: -3, right: -3 }} />

      <div style={{ padding: '16px' }}>
        <input
          type="text"
          placeholder="Filter by course name..."
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          style={{ width: '100%', marginBottom: '14px' }}
        />

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading resources...</p>
        ) : filteredResources.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No resources found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredResources.map((r) => (
              <li
                key={r.id}
                style={{
                  border: '2px solid var(--border)',
                  background: 'var(--surface)',
                  padding: '12px',
                }}
              >
                <strong>{r.title}</strong>
                <br />
                <span style={{ color: 'var(--text-muted)', fontFamily: 'VT323, monospace', fontSize: '17px' }}>
                  {r.course_name} {r.year ? `(${r.year})` : ''} — {r.resource_type}
                </span>
                <br />
                <a 
  href={r.file_url}
  target="_blank"
  rel="noopener noreferrer"
  onClick={async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('download_logs').insert({
        user_id: user.id,
        resource_id: r.id,
        resource_title: r.title,
      })
    }
  }}
>
  View / Download
</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}