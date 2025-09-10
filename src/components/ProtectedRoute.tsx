'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('buyer' | 'supplier' | 'admin')[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  allowedRoles = ['buyer', 'supplier', 'admin'],
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push(redirectTo)
      return
    }

    // Check if user has required role
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized')
      return
    }
  }, [user, allowedRoles, router, redirectTo])

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
