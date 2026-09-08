import { NavLink } from 'react-router-dom'
import { supabase } from './supabaseClient'

function PixelIcon({ type }) {
  const grids = {
    home: ['00100', '01110', '11111', '11011', '11011'],
    chat: ['11111', '10001', '10001', '11111', '00100'],
    map: ['11011', '11011', '11011', '11011', '11011'],
    book: ['11110', '10001', '10101', '10001', '11110'],
    alert: ['00100', '01110', '01110', '11111', '00100'],
    person: ['01110', '01110', '00100', '01110', '10001'],
  }
  const grid = grids[type]
  return (
    <svg viewBox="0 0 5 5" width="18" height="18">
      {grid.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="var(--border-dark)" /> : null
        )
      )}
    </svg>
  )
}

const navItems = [
  { to: '/', label: 'Home', icon: 'home', color: 'var(--teal)', end: true },
  { to: '/orientation', label: 'Orientation', icon: 'chat', color: 'var(--amber)' },
  { to: '/map', label: 'Map', icon: 'map', color: 'var(--pink)' },
  { to: '/resources', label: 'Resources', icon: 'book', color: '#8b7bf0' },
  { to: '/profile', label: 'Profile', icon: 'person', color: '#7bf096' },
  { to: '/emergency', label: 'Emergency', icon: 'alert', color: 'var(--red)' },
]

export default function Sidebar() {
  return (
    <>
      <nav
        className="desktop-sidebar"
        style={{
          width: '220px',
          padding: '24px 12px',
          background: 'var(--surface)',
          borderRight: '3px solid var(--border)',
          height: '100vh',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
        }}
      >
        <h3 style={{ padding: '0 12px', marginBottom: '24px' }}>🧭 Campus Compass</h3>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              marginBottom: '6px',
              textDecoration: 'none',
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--surface-hover)' : 'transparent',
              border: isActive ? '2px solid var(--border)' : '2px solid transparent',
              fontWeight: isActive ? 600 : 500,
            })}
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                background: item.color,
                border: '2px solid var(--border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PixelIcon type={item.icon} />
            </span>
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            marginTop: '20px',
            width: '100%',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '2px solid var(--border)',
          }}
        >
          Log Out
        </button>
      </nav>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} style={{ textDecoration: 'none' }}>
            <span
              style={{
                width: '34px',
                height: '34px',
                background: item.color,
                border: '2px solid var(--border-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelIcon type={item.icon} />
            </span>
          </NavLink>
        ))}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            width: '34px',
            height: '34px',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '2px solid var(--border)',
            fontSize: '16px',
            padding: 0,
          }}
        >
          ⏻
        </button>
      </nav>
    </>
  )
}