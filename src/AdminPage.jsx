import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  console.log('isAdmin:', isAdmin, 'authLoading:', authLoading)

  // Password Unlock States
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('admin-unlocked') === 'true')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(null)
  const [verifying, setVerifying] = useState(false)

  // Campus Location Form States
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [addingLocation, setAddingLocation] = useState(false)
  const [locationMsg, setLocationMsg] = useState(null)

  // Manage Resources States
  const [resources, setResources] = useState([])
  const [loadingResources, setLoadingResources] = useState(true)

  // Only fetch resources if the user is an admin AND the panel is unlocked
  useEffect(() => {
    if (isAdmin && unlocked) fetchResources()
  }, [isAdmin, unlocked])

  async function handleUnlock(e) {
    e.preventDefault()
    setVerifying(true)
    setAuthError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: user?.email,
      password,
    })

    if (error) {
      setAuthError('Incorrect password.')
    } else {
      sessionStorage.setItem('admin-unlocked', 'true')
      setUnlocked(true)
    }
    setVerifying(false)
  }

  async function fetchResources() {
    setLoadingResources(true)
    const { data } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
    setResources(data || [])
    setLoadingResources(false)
  }

  async function handleAddLocation(e) {
    e.preventDefault()
    setAddingLocation(true)
    setLocationMsg(null)

    const { error } = await supabase.from('locations').insert({
      name,
      category,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      description: description || null,
    })

    if (error) {
      setLocationMsg(`Error: ${error.message}`)
    } else {
      setLocationMsg('Location added!')
      setName('')
      setCategory('')
      setLat('')
      setLng('')
      setDescription('')
    }
    setAddingLocation(false)
  }

  async function handleDeleteResource(resource) {
    if (!confirm(`Delete "${resource.title}"? This can't be undone.`)) return

    // Extract the storage path from the public URL
    const urlParts = resource.file_url.split('/resources/')
    const filePath = urlParts[1]

    if (filePath) {
      await supabase.storage.from('resources').remove([filePath])
    }

    const { error } = await supabase.from('resources').delete().eq('id', resource.id)

    if (error) {
      alert(`Error deleting: ${error.message}`)
    } else {
      setResources((prev) => prev.filter((r) => r.id !== resource.id))
    }
  }

  // Auth Guards
  if (authLoading) return <p>Loading...</p>
  if (!isAdmin) return <Navigate to="/" replace />

  // Unlock / Verification Guard
  if (!unlocked) {
    return (
      <div style={{ maxWidth: '320px', margin: '80px auto' }}>
        <h2>Admin Access</h2>
        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {authError && <p style={{ color: 'var(--red, red)' }}>{authError}</p>}
          <button type="submit" disabled={verifying}>
            {verifying ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    )
  }

  // Main Admin Content Panel
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Admin Panel</h2>

      <section style={{ marginBottom: '32px' }}>
        <h3>Add Campus Location</h3>
        <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Category (e.g. classroom, lab, dorm)" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="text" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} required />
          <input type="text" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} required />
          <input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          {locationMsg && <p>{locationMsg}</p>}
          <button type="submit" disabled={addingLocation} style={{ alignSelf: 'flex-start' }}>
            {addingLocation ? 'Adding...' : 'Add Location'}
          </button>
        </form>
      </section>

      <section>
        <h3>Manage Resources</h3>
        {loadingResources ? (
          <p>Loading...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {resources.map((r) => (
              <li
                key={r.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  <strong>{r.title}</strong> — {r.course_name} ({r.resource_type})
                </span>
                <button onClick={() => handleDeleteResource(r)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
