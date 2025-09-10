'use client'

import { Button } from '@/components/ui/button'

export default function NewsletterSection() {
  return (
    <section className="py-16 mbs-gray">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-black mb-8">
            Get Deals Straight to Your Inbox
          </h2>

          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-center">
              <span className="text-lg text-black">- <strong>Exclusive promos</strong></span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-lg text-black">- <strong>New product alerts</strong></span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-lg text-black">- <strong>Pro tips & updates</strong></span>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            No fluff. Just the info you need.
          </p>

          <Button
            className="mbs-red mbs-red-hover px-8 py-3 text-lg font-semibold"
            asChild
          >
            <a href="https://mailchi.mp/181a7ef3cee4/send-me-offers">Send Me Offers!</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
