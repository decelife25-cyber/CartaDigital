import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { isSupabaseConfigured, supabase } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase no está configurado. Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para acceder al panel de administración.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session)
    setUser(data.user)
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setSession(null)
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setSession(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn,
      signOut,
    }),
    [loading, session, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
