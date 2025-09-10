'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookiesAccepted')
    if (!hasAccepted) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          By using this website, you agree to our use of cookies. We use cookies to provide you with a great experience and to help our website run effectively.
        </p>
        <Button
          onClick={handleAccept}
          className="mbs-red mbs-red-hover px-6 py-2 whitespace-nowrap"
        >
          Accept
        </Button>
      </div>
    </div>
  )
}
