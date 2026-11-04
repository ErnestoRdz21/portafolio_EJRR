import { useEffect, useState, type ReactNode } from 'react'
import { Outlet } from 'react-router'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../../services/admin/auth.ts'
import type { AdminUser } from '../../services/admin/types.ts'
import { useNoIndex } from '../../seo/usePageMeta.ts'
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
} from './useAuth.ts'

export function AuthProvider({ children }: { children?: ReactNode }) {
  useNoIndex()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()

    getCurrentUser()
      .then((current) => {
        if (!controller.signal.aborted) {
          setUser(current)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setUser(null)
          setStatus('ready')
        }
      })

    return () => controller.abort()
  }, [])

  const value: AuthContextValue = {
    user,
    status,
    login: async (email, password) => {
      setUser(await loginRequest(email, password))
    },
    logout: async () => {
      await logoutRequest()
      setUser(null)
    },
    clear: () => {
      setUser(null)
      void logoutRequest().catch(() => undefined)
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children ?? <Outlet />}
    </AuthContext.Provider>
  )
}
