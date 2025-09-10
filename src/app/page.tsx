'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Hero carousel images (no longer used in hero, but kept for possible future use)
  const heroSlides = [
    {
      image: 'https://ext.same-assets.com/3040939488/1684695165.webp',
      alt: 'Kitchen showcase'
    },
    {
      image: 'https://ext.same-assets.com/3040939488/2513592458.webp',
      alt: 'Bath showcase'
    },
    {
      image: 'https://ext.same-assets.com/3040939488/1907666183.webp',
      alt: 'Countertops showcase'
    },
    {
      image: 'https://ext.same-assets.com/3040939488/16831045.webp',
      alt: 'Appliances showcase'
    },
    {
      image: 'https://ext.same-assets.com/3040939488/1916374771.webp',
      alt: 'Accessories showcase'
    }
  ];

  useEffect(() => {
    // Ensure we're on the client side to prevent hydration mismatch
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only show popup after ensuring we're on client side
    if (!isClient) return;

    // Show popup after 2 seconds to improve UX
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isClient]);

  useEffect(() => {
    // Auto-advance carousel (not used in new hero, but kept for possible future use)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <>
      <Header />

      {/* Popup Modal */}
      {isClient && (
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className="max-w-2xl p-8 bg-white">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-bold">
                Get Exclusive Promotions & Updates
              </DialogTitle>
            </DialogHeader>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Sign up to receive tailored offers and exclusive updates straight to your
                inbox. Select the types of promotions & products that interest you most!
                From special online deals to updates from your local branches.
              </p>
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full max-w-md bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold py-6 text-lg rounded-full"
                  asChild
                >
                  <a href="https://mailchi.mp/181a7ef3cee4/send-me-offers" target="_blank" rel="noopener noreferrer">
                    Send Me Offers
                  </a>
                </Button>
                <Button
                  className="w-full max-w-md bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold py-6 text-lg rounded-full"
                  asChild
                >
                  <a href="https://homeimprovementsupply.com" target="_blank" rel="noopener noreferrer">
                    Shop HIS Online
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hero Section with Video */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/mbs-hero-video.mp4" type="video/mp4" />
          {/* Fallback to image if video doesn't load */}
          <Image
            src="https://ext.same-assets.com/3040939488/2513592458.webp"
            alt="MBS Mobile Display Trailer showcasing kitchen and bath products"
            fill
            className="object-cover"
          />
        </video>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20" />

        {/* MBS Logo and text overlay */}
        <div className="absolute top-8 left-8 text-white z-10">
          <div className="text-[#e74c4c] text-3xl font-bold italic drop-shadow-lg">Modern Builders Supply, Inc.</div>
          <div className="text-2xl italic drop-shadow-lg">Since 1944</div>
        </div>

        {/* Discrete Admin Button - bottom right of hero */}
        <Link
          href="/admin"
          className="absolute bottom-4 right-4 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white/70 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border border-white/10"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Admin Portal</span>
        </Link>
      </section>

      {/* Our MBS Family Section */}
      <section className="py-12 bg-[#e6e6e6]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-black tracking-wide">OUR MBS FAMILY</h2>

          {/* 5 Cards in a Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* MBS Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 mb-4 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/1652972435437-4LIQRMXBF8UXGSYEX9K8/mbs.png"
                  alt="Modern Builders Supply"
                  width={180}
                  height={80}
                  className="max-h-full w-auto"
                />
              </div>
              <p className="text-sm text-gray-700 text-left">
                Modern Builders Supply, Inc. has 26 locations in five states throughout the
                Midwest. MBS distributes name brand roofing, siding, windows and doors,
                kitchens, decking and so much more.
              </p>
            </div>

            {/* MBS Interiors Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 mb-4 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/1652972347775-85L9VOHNFY92AI2Q12RA/interiors.png"
                  alt="MBS Interiors"
                  width={180}
                  height={80}
                  className="max-h-full w-auto"
                />
              </div>
              <p className="text-sm text-gray-700 text-left">
                MBS Interiors provides you with a complete design solution from space
                planning, cabinetry design and appliance selection to flooring options
                and plumbing collections.
              </p>
            </div>

            {/* HIS Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 mb-4 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/d759bae9-fb88-4d8f-895a-b3172ffef971/HIS+Logo+no+text.jpg"
                  alt="Home Improvement Supply"
                  width={180}
                  height={80}
                  className="max-h-full w-auto"
                />
              </div>
              <p className="text-sm text-gray-700 text-left">
                Home Improvement Supply is the online store of Modern Builders Supply.
                Our selection of products to choose from is growing daily. We have the
                name brand products the Professional Builders use.
              </p>
            </div>

            {/* Polaris Windows & Doors Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 mb-4 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/1653070290340-3Z5IIIUTHA6ZKDAYBXB8/polarisBIG.png"
                  alt="Polaris Windows & Doors"
                  width={180}
                  height={80}
                  className="max-h-full w-auto"
                />
              </div>
              <p className="text-sm text-gray-700 text-left">
                Polaris Windows & Doors provides high quality window and door products
                to the new construction and remodeling industry. Offer products at a
                competitive price with consistent delivery.
              </p>
            </div>

            {/* Outdoor Adventures Card */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 mb-4 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/5f58d9b7-94ff-428d-8c08-3c053945a5ea/MBS-Outdoor-Adventures-Logo.png"
                  alt="MBS Outdoor Adventures"
                  width={180}
                  height={80}
                  className="max-h-full w-auto"
                />
              </div>
              <p className="text-sm text-gray-700 text-left">
                Outdoor Adventures offers a diverse range of products tailored for
                outdoor enthusiasts. From rugged gear to reliable equipment, we provide
                everything you need for your next adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Deals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-black">Get Deals Straight to Your Inbox</h2>

          <div className="mb-8">
            <p className="text-xl mb-2">- Exclusive promos</p>
            <p className="text-xl mb-2">- New product alerts</p>
            <p className="text-xl">- Pro tips & updates</p>
          </div>

          <p className="text-gray-600 mb-8">No fluff. Just the info you need.</p>

          <Button
            className="bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold py-3 px-8 text-lg rounded"
            asChild
          >
            <a href="https://mailchi.mp/181a7ef3cee4/send-me-offers" target="_blank" rel="noopener noreferrer">
              Send Me Offers!
            </a>
          </Button>
        </div>
      </section>

      {/* RoofWalker Section with Promo */}
      <section className="relative bg-black py-12">
        <div className="container mx-auto px-4">
          {/* Headline */}
          <h2 className="text-white text-center text-2xl lg:text-3xl font-semibold mb-8">
            Walk Roofs with Confidence - RoofWalker™
          </h2>

          {/* RoofWalker Promo Image */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full relative">
              <Image
                src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/c4de3d07-d632-4c36-98a2-f87deb860278/MBS-Outfitters-MBS-w-Logo.jpg"
                alt="RoofWalker - The Next Step in Roofing - $219.00 Free Shipping"
                width={900}
                height={400}
                className="w-full h-auto rounded-lg shadow-2xl"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
              />
            </div>
          </div>
        </div>

        {/* Sticky Shop Online Now Button */}
        <Button
          className="fixed right-4 top-1/2 -translate-y-1/2 bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold px-6 py-3 rounded-full shadow-lg z-40 hidden lg:block"
          asChild
        >
          <Link href="/inventory">
            Shop Online Now!
          </Link>
        </Button>
      </section>

      {/* Brands Built by MBS - Updated Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-10 text-black">Brands Built by MBS</h2>

          {/* 6 Brand Cards in a Row */}
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" role="list">
            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.craftlinecabinetry.com" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/2649f8c4-8c1c-4c0f-b4ee-35bbaec89e73/Craftline-MBS-w-Logo.jpg"
                      alt="Craftline Cabinetry"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">Craftline Cabinetry</p>
                </Link>
              </div>
            </li>

            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.everviewcabinetry.com" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/c28b72d7-1ad5-446e-b8b6-b7d8f0aa3044/Everview-MBS-w-Logo.jpg"
                      alt="Everview Cabinetry"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">Everview Cabinetry</p>
                </Link>
              </div>
            </li>

            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.polarissiding.com" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/021c43fa-ec42-4ddd-967a-82d97cf2c66f/Polaris-Siding-MBS-w-Logo.jpg"
                      alt="Polaris Siding"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">Polaris Siding</p>
                </Link>
              </div>
            </li>

            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.homeviewcabinetry.com" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/08ef6eb0-5f91-4160-880c-59418ed0c528/HomeView-MBS-w-Logo.jpg"
                      alt="Homeview Cabinetry"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">Homeview Cabinetry</p>
                </Link>
              </div>
            </li>

            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.mbsoutfitters.com/the-roofwalker" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/c4de3d07-d632-4c36-98a2-f87deb860278/MBS-Outfitters-MBS-w-Logo.jpg"
                      alt="MBS Outfitters"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">MBS Outfitters</p>
                </Link>
              </div>
            </li>

            <li>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Link href="https://www.hydroshieldbuildingproducts.com" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/b08ec0fe-2771-48e8-92ae-e06442a31457/Hydroshield-MBS-w-Logo.jpg"
                      alt="Hydroshield"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center py-3 text-sm text-gray-700">Hydroshield</p>
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Discover What's New */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Discover What's New at MBS!</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#e74c4c] text-white p-4">
                <h3 className="text-xl font-bold">BRANCH LOCATIONS</h3>
              </div>
              <Image
                src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/d672ffa8-a0c0-4b43-b674-8b10abc2c0c6/Updated+Branch+Locations.png"
                alt="Branch Locations"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  FIND NOW &gt;
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#e74c4c] text-white p-4">
                <h3 className="text-xl font-bold">PRODUCT SOLUTIONS</h3>
              </div>
              <Image
                src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/2e0978d5-e9e2-4da3-9f0c-8359b7546723/Product-Solutions.png"
                alt="Product Solutions"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  SOLUTIONS NOW &gt;
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#28adb8] text-white p-4">
                <h3 className="text-xl font-bold">MBS PURCHASE CARD</h3>
              </div>
              <Image
                src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/15bf1658-f9a2-4c16-9f75-a94882cbdf6e/Purchase-Card.png"
                alt="MBS Purchase Card"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  SIGN UP NOW &gt;
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-600 text-white p-4">
                <h3 className="text-xl font-bold">INCENTIVE PROGRAMS</h3>
              </div>
              <Image
                src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/4c553d88-9d3c-4c73-b5c1-ad4ff99f37f4/Incentive-Programs.png"
                alt="Incentive Programs"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  EXPLORE NOW &gt;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-black text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Subscribe to receive the monthly MBS Newsletter!</h2>
          <p className="mb-8 max-w-3xl mx-auto">
            Sign up to stay up to date with all things MBS, including featured products,
            featured deals, any future blog posts as well as any other industry information!
          </p>

          <form className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-4 py-3 rounded text-black"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-4 py-3 rounded text-black"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded text-black"
            />
            <Button
              type="submit"
              className="bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold py-6 px-8 text-lg rounded-full"
            >
              Receive the MBS Newsletter
            </Button>
          </form>

          <p className="mt-8 text-lg">Thank you for staying in touch with everything MBS!</p>

          {/* Discrete Admin Access - positioned bottom right */}
          <Link
            href="/admin"
            className="absolute bottom-4 right-4 text-gray-600 hover:text-gray-400 text-xs transition-colors duration-200"
            title="Admin Access"
          >
            <span className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Admin
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
