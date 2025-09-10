'use client'

import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mbs-gray py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Company</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="/about" className="hover:underline">About</Link>
              <span>|</span>
              <Link href="/branches/locations" className="hover:underline">Branches</Link>
              <span>|</span>
              <Link href="/careers" className="hover:underline">Careers</Link>
              <span>|</span>
              <Link href="/contact" className="hover:underline">Contact Us</Link>
              <span>|</span>
              <Link href="/manufacturer-price-increases" className="hover:underline">Price Increases</Link>
              <span>|</span>
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>

          {/* Popular Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Popular Resources</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="/manufacturer-rewards" className="hover:underline">Manufacturer Rewards</Link>
              <span>|</span>
              <Link href="/product-catalog" className="hover:underline">Product Catalog</Link>
              <span>|</span>
              <Link href="/product-solutions" className="hover:underline">Product Solutions</Link>
              <span>|</span>
              <Link href="/tool-catalog" className="hover:underline">Tool Catalog</Link>
              <span>|</span>
              <Link href="/mbs-exteriors-blog" className="hover:underline">MBS Blogs</Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Follow us on Social Media!</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.instagram.com/mbsinteriors/"
                className="text-gray-600 hover:text-[#e33f3f] transition-colors"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://www.facebook.com/modernbuilderssupply"
                className="text-gray-600 hover:text-[#e33f3f] transition-colors"
              >
                <Facebook size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
