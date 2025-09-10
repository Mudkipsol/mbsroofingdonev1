'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function MBSFamilySection() {
  const companies = [
    {
      name: "Modern Builders Supply, Inc.",
      logo: "https://ext.same-assets.com/3040939488/2678920723.webp",
      description: "Modern Builders Supply, Inc. has 26 locations in five states throughout the Midwest. MBS distributes name brand roofing, siding, windows and doors, kitchens, decking and so much more.",
      linkText: "Learn More!",
      href: "/about"
    },
    {
      name: "MBS Interiors",
      logo: "https://ext.same-assets.com/3040939488/2497090086.webp",
      description: "MBS Interiors provides you with a complete design solution from space planning, cabinetry design and appliance selection to flooring options and plumbing collections.",
      linkText: "Learn More!",
      href: "https://www.mbsinteriors.com"
    },
    {
      name: "Home Improvement Supply",
      logo: "https://ext.same-assets.com/3040939488/4071547533.webp",
      description: "Home Improvement Supply is the online store of Modern Builders Supply. Our selection of products to choose from is growing daily. We have the name brand products the Professional Builders use.",
      linkText: "Learn More!",
      href: "https://homeimprovementsupply.com"
    },
    {
      name: "Polaris Windows & Doors",
      logo: "https://ext.same-assets.com/3040939488/699513471.webp",
      description: "Polaris Windows & Doors provides high quality window and door products to the new construction and remodeling industry. Offer products at a competitive price with consistent delivery.",
      linkText: "Learn More!",
      href: "https://polariswindows.com"
    },
    {
      name: "Outdoor Adventures",
      logo: "https://ext.same-assets.com/3040939488/2039133788.webp",
      description: "Outdoor Adventures offers a diverse range of products tailored for outdoor enthusiasts. From rugged gear to reliable equipment, we provide everything you need for your next adventure.",
      linkText: "Click Here",
      href: "https://mbsoutdooradventures.com"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">OUR MBS FAMILY</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {companies.map((company, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mb-6 flex justify-center">
                  <Image
                    src={company.logo}
                    alt={`${company.name} Logo`}
                    width={200}
                    height={100}
                    className="max-h-20 w-auto object-contain"
                  />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {company.description}
                </p>
                <Button
                  variant="outline"
                  className="border-[#e33f3f] text-[#e33f3f] hover:bg-[#e33f3f] hover:text-white"
                  asChild
                >
                  <a href={company.href}>{company.linkText}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
