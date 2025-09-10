import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About MBS</h1>

          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-gray-600 mb-8 text-center">
              Streamlining the connection between roofing companies and suppliers since 1944
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  Modern Builders Supply is dedicated to providing professional roofing companies
                  with seamless access to high-quality building materials. Our B2B platform
                  revolutionizes how contractors source their supplies with real-time inventory,
                  streamlined ordering, and reliable delivery scheduling.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Platform</h2>
                <p className="text-gray-700">
                  Our digital platform connects roofing professionals with suppliers across the
                  5-state region, offering live inventory tracking, professional pricing,
                  scheduled deliveries, and dedicated account management for contractors who
                  demand reliability and efficiency.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">For Roofing Companies:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Real-time inventory visibility</li>
                    <li>Professional contractor pricing</li>
                    <li>Scheduled delivery coordination</li>
                    <li>Account management tools</li>
                    <li>Mobile-friendly ordering</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">For Suppliers:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Comprehensive admin dashboard</li>
                    <li>Inventory management system</li>
                    <li>Order approval workflow</li>
                    <li>Customer-specific pricing</li>
                    <li>Delivery scheduling tools</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-6">
                Join hundreds of roofing professionals who trust MBS for their supply needs.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/inventory"
                  className="bg-[#e33f3f] hover:bg-[#c73333] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Live Inventory
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-[#e33f3f] text-[#e33f3f] hover:bg-[#e33f3f] hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
