'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function FooterNewsletter() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', { firstName, lastName, email })
  }

  return (
    <section className="py-16 mbs-black">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Subscribe to receive the monthly MBS Newsletter!
          </h2>

          <p className="text-white text-lg mb-8 leading-relaxed">
            Sign up to stay up to date with all things MBS, including featured products,
            featured deals, any future blog posts as well as any other industry information!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white border-gray-300"
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-gray-300"
                required
              />
            </div>

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-gray-300"
              required
            />

            <Button
              type="submit"
              className="mbs-red mbs-red-hover px-8 py-3 text-lg font-semibold"
            >
              Receive the MBS Newsletter
            </Button>
          </form>

          <p className="text-white text-sm mt-6">
            Thank you for staying in touch with everything MBS!
          </p>
        </div>
      </div>
    </section>
  )
}
