import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Auth from './Auth'
import Sidebar from './Sidebar'
import CampusMap from './CampusMap'
import OrientationGuide from './OrientationGuide'
import ResourceUpload from './ResourceUpload'
import ResourceList from './ResourceList'
import EmergencyPage from './EmergencyPage'
import Mascot from './Mascot'
import AdminPage from './AdminPage'
import ProfilePage from './ProfilePage'
import ResetPassword from './ResetPassword'
function Home({ user }) {
  const stars = Array.from({ length: 90 }, () => {
    const size = Math.random() < 0.15 ? 6 : Math.random() < 0.5 ? 4 : 2
    return {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size,
    }
  })

  return (
    <div style={{ position: 'relative', minHeight: '85vh', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, width: s.size, height: s.size }}
        />
      ))}

      <div style={{ position: 'relative', maxWidth: '720px', margin: '60px auto', textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', color: 'var(--teal)', fontSize: '12px', letterSpacing: '1px' }}>
          YOUR PASS TO CAMPUS LIFE
        </p>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '26px' }}>Welcome to Campus Compass</h1>
        <p style={{ margin: '0 0 40px 0', color: 'var(--text-muted)', fontFamily: 'VT323, monospace', fontSize: '18px' }}>
          Signed in as {user.email}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Mascot size={400} />
          <p style={{ margin: 0, fontSize: '18px', color: 'var(--text-muted)', fontFamily: 'VT323, monospace' }}>
            Say hi 👋 — I know this place pretty well.
          </p>
        </div>
      </div>
    </div>
  )
}
function ResourcesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const stars = Array.from({ length: 60 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() < 0.2 ? 4 : 2,
  }))

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} className="star" style={{ top: s.top, left: s.left, animationDelay: s.delay, width: s.size, height: s.size }} />
        ))}
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontSize: '20px' }}>Resources</h2>
        <ResourceUpload onUploaded={() => setRefreshKey((k) => k + 1)} />
        <ResourceList refreshKey={refreshKey} />
      </div>
    </div>
  )
}
function App() {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Auth />

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, padding: '24px', minWidth: 0 }}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="/orientation" element={<OrientationGuide />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
