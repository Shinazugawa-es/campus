import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) setDone(true)
  }

  if (done) return <p style={{ maxWidth: 320, margin: '80px auto' }}>Password updated! You can log in now.</p>

  return (
    <form onSubmit={handleReset} style={{ maxWidth: 320, margin: '80px auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h2>Set New Password</h2>
      <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Update Password</button>
    </form>
  )
}