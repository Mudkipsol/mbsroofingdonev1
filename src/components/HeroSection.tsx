'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HeroSection() {
  const [showPromo, setShowPromo] = useState(false)

  return (
    <>
      <section className="relative h-[600px] bg-cover bg-center"
               style={{
                 backgroundImage: `url('/images/youngstown.jpg')`
               }}>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Link href="/inventory">
            <Button className="bg-[#e33f3f] hover:bg-[#c73333] text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              View Live Inventory
            </Button>
          </Link>
        </div>

        {/* Category Labels */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex">
            <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">KITCHEN</span>
            </div>
            <div className="flex-1 h-20 bg-[#e33f3f]/80 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">BATH</span>
            </div>
            <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">COUNTERTOPS</span>
            </div>
            <div className="flex-1 h-20 bg-[#e33f3f]/80 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">APPLIANCES</span>
            </div>
            <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-wider">ACCESSORIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Popup (matches original site) */}
      <Dialog open={showPromo} onOpenChange={setShowPromo}>
        <DialogContent className="max-w-2xl">
          <div className="text-center p-6">
            <h2 className="text-3xl font-bold mb-4">Get Exclusive Promotions & Updates</h2>
            <p className="text-gray-600 mb-6">
              Sign up to receive tailored offers and exclusive updates straight to your inbox.
              Select the types of promotions & products that interest you most!
              From special online deals to updates from your local branches.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-[#e33f3f] hover:bg-[#c73333] text-white">
                Send Me Offers
              </Button>
              <Button
                className="w-full bg-[#e33f3f] hover:bg-[#c73333] text-white"
                onClick={() => window.open('https://homeimprovementsupply.com', '_blank')}
              >
                Shop HIS Online
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
