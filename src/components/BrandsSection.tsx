'use client'

import Image from 'next/image'

export default function BrandsSection() {
  const brands = [
    {
      name: "Craftline Cabinetry",
      image: "https://ext.same-assets.com/3040939488/2367706486.webp",
      href: "https://www.craftlinecabinetry.com"
    },
    {
      name: "Everview Cabinetry",
      image: "https://ext.same-assets.com/3040939488/2802598165.webp",
      href: "https://www.everviewcabinetry.com"
    },
    {
      name: "Polaris Siding",
      image: "https://ext.same-assets.com/3040939488/1168839081.webp",
      href: "https://www.polarissiding.com"
    },
    {
      name: "Homeview Cabinetry",
      image: "https://ext.same-assets.com/3040939488/3749385482.webp",
      href: "https://www.homeviewcabinetry.com"
    },
    {
      name: "MBS Outfitters",
      image: "https://ext.same-assets.com/3040939488/3668841630.webp",
      href: "https://www.mbsoutfitters.com"
    },
    {
      name: "Hydroshield",
      image: "https://ext.same-assets.com/3040939488/1712879817.png",
      href: "https://www.hydroshieldbuildingproducts.com"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black">Brands Built by MBS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <a
              key={index}
              href={brand.href}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                  <h3 className="text-white font-bold text-lg text-center">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
