"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      // eslint-disable-next-line
      setIsAuthenticated(true)
    }
  }, [navigate])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
