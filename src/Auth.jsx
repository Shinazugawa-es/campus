import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentType, setStudentType] = useState('fresh')
  const [homeRegion, setHomeRegion] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

      if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        setError(error.message)
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists. Try logging in instead.')
      } else if (data.user) {
        setMessage('Account created!')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email first, then click "Forgot password?"')
      return
    }
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    if (error) setError(error.message)
    else setMessage('Password reset email sent — check your inbox.')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isSignUp && (
          <>
            <div>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  checked={studentType === 'fresh'}
                  onChange={() => setStudentType('fresh')}
                />
                Fresh Student
              </label>
              <label>
                <input
                  type="radio"
                  checked={studentType === 'returning'}
                  onChange={() => setStudentType('returning')}
                />
                Returning Student
              </label>
            </div>

            <input
              type="text"
              placeholder="Home region/city (optional)"
              value={homeRegion}
              onChange={(e) => setHomeRegion(e.target.value)}
            />
          </>
        )}

        {error && <p style={{ color: 'var(--red, red)' }}>{error}</p>}
        {message && <p style={{ color: 'var(--teal, green)' }}>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {!isSignUp && (
          <button type="button" onClick={handleForgotPassword}>
            Forgot password?
          </button>
        )}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }}>
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}