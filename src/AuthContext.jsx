import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function checkAdmin(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    setIsAdmin(data?.is_admin || false)
  }

  async function ensureProfile(userId) {
    const { data } = await supabase.from('profiles').select('id').eq('id', userId).single()
    if (!data) {
      await supabase.from('profiles').insert({ id: userId, student_type: 'fresh' })
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await ensureProfile(session.user.id)
        await checkAdmin(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await ensureProfile(session.user.id)
          await checkAdmin(session.user.id)
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = { user, isAdmin, loading }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}