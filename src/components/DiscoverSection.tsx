'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function DiscoverSection() {
  const sections = [
    {
      title: "BRANCH LOCATIONS",
      image: "https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/d672ffa8-a0c0-4b43-b674-8b10abc2c0c6/Updated+Branch+Locations.png",
      buttonText: "FIND NOW >",
      href: "/branches/locations",
      bgColor: "bg-[#e33f3f]"
    },
    {
      title: "PRODUCT SOLUTIONS",
      image: "https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/2e0978d5-e9e2-4da3-9f0c-8359b7546723/Product-Solutions.png",
      buttonText: "SOLUTIONS NOW >",
      href: "/product-solutions",
      bgColor: "bg-[#e33f3f]"
    },
    {
      title: "MBS PURCHASE CARD",
      image: "https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/15bf1658-f9a2-4c16-9f75-a94882cbdf6e/Purchase-Card.png",
      buttonText: "SIGN UP NOW >",
      href: "/mbs-purchase-card",
      bgColor: "bg-[#23aab6]"
    },
    {
      title: "INCENTIVE PROGRAMS",
      image: "https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/4c553d88-9d3c-4c73-b5c1-ad4ff99f37f4/Incentive-Programs.png",
      buttonText: "EXPLORE NOW >",
      href: "/manufacturer-rewards",
      bgColor: "bg-gray-600"
    }
  ]

  return (
    <section className="py-16 mbs-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black">Discover What's New at MBS!</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className={`${section.bgColor} p-4`}>
                  <h3 className="text-white font-bold text-center text-sm leading-tight">
                    {section.title}
                  </h3>
                </div>

                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Button */}
                <div className="p-4">
                  <Button
                    className="w-full bg-black text-white hover:bg-gray-800 font-semibold"
                    asChild
                  >
                    <a href={section.href}>{section.buttonText}</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
