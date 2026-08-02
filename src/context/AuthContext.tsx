import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { isSupabaseConfigured, supabase } from '../lib/supabase'

interface DemoSession {
  user: { id: string; email: string }
  access_token: string
}

interface AuthContextValue {
  user: User | DemoSession['user'] | null
  session: Session | DemoSession | null
  loading: boolean
  demoAuth: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const DEMO_AUTH_KEY = 'carta-digital-demo-auth'

function getDemoSession(): DemoSession | null {
  const raw = window.localStorage.getItem(DEMO_AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as DemoSession
  } catch {
    window.localStorage.removeItem(DEMO_AUTH_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | DemoSession['user'] | null>(null)
  const [session, setSession] = useState<Session | DemoSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const demoSession = getDemoSession()
      setSession(demoSession)
      setUser(demoSession?.user ?? null)
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
      if (!email || !password) {
        throw new Error('Introduce email y contraseña para entrar en modo demo.')
      }

      const demoSession: DemoSession = {
        user: { id: 'demo-user', email },
        access_token: 'demo-token',
      }
      window.localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoSession))
      setSession(demoSession)
      setUser(demoSession.user)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setSession(data.session)
    setUser(data.user)
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      window.localStorage.removeItem(DEMO_AUTH_KEY)
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
      demoAuth: !isSupabaseConfigured,
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
