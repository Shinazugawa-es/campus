import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { supabase } from './supabaseClient'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export default function CampusMap() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase.from('locations').select('*')
      if (!error) setLocations(data)
      setLoading(false)
    }
    fetchLocations()
  }, [])

  const campusCenter = [11.142068, 39.653293]

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

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontSize: '20px' }}>Campus Map</h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading map...</p>
        ) : (
          <div className="dialogue-box">
            <div className="dialogue-header" style={{ background: 'var(--surface-hover)', color: 'var(--teal)', borderBottom: '3px solid var(--border)' }}>
              🗺 YWM  DESSIE SPECIAL BOARDING SCHOOL
            </div>
            <div className="corner" style={{ top: -3, left: -3 }} />
            <div className="corner" style={{ top: -3, right: -3 }} />
            <div className="corner" style={{ bottom: -3, left: -3 }} />
            <div className="corner" style={{ bottom: -3, right: -3 }} />

            <MapContainer center={campusCenter} zoom={17} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
              />
              {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                  <Popup>
                    <strong>{loc.name}</strong><br />
                    {loc.category}
                    {loc.description && <><br />{loc.description}</>}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}