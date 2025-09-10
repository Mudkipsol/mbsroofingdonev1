'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, Instagram, Facebook, ShoppingCart, User, Star, LogOut, Package, CreditCard, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthDialog from './AuthDialog';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper to get total cart items
  const getTotalItems = () => {
    if (!items) return 0;
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <header>
        {/* Top Navigation Bar */}
        <nav className="bg-[#dcdcdc] py-2">
          <div className="flex justify-center items-center text-sm">
            <div className="flex gap-1">
              <Link href="https://homeimprovementsupply.com" className="text-black hover:text-gray-600 px-3">
                Home Improvement Supply
              </Link>
              <span className="text-black">|</span>
              <Link href="/about" className="text-black hover:text-gray-600 px-3">
                About
              </Link>
              <span className="text-black">|</span>
              <Link href="/branches" className="text-black hover:text-gray-600 px-3">
                Branches
              </Link>
              <span className="text-black">|</span>
              <Link href="/careers" className="text-black hover:text-gray-600 px-3">
                Careers
              </Link>
              <span className="text-black">|</span>
              <Link href="/contact" className="text-black hover:text-gray-600 px-3">
                Contact Us
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Black Header Section */}
        <div className="bg-black relative">
          <div className="container mx-auto px-4">
            {/* Social Icons - Positioned Absolutely */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <Link href="https://www.instagram.com/mbsinteriors/" className="text-[#e74c4c] hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://www.facebook.com/modernbuilderssupply" className="text-[#e74c4c] hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>

            {/* Shop Online Now Button - Positioned Absolutely (hidden on inventory page) */}
            {!pathname?.startsWith('/inventory') && (
              <Button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold px-6 py-2 hidden md:block"
                asChild
              >
                <Link href="/inventory">
                  Shop Online Now!
                </Link>
              </Button>
            )}

            {/* Center Content - Logo and Navigation */}
            <div className="flex flex-col items-center py-4">
              {/* MBS Logo */}
              <Link href="/" className="mb-4">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/1191f955-2f2d-4fd5-ab17-9096b1b1aa16/MBS+HD+Logo.png?format=1500w"
                  alt="MBS"
                  width={180}
                  height={70}
                  className="h-16 w-auto"
                />
              </Link>

              {/* Navigation Menu Below Logo */}
              <nav className="flex items-center gap-8 text-white">
                <div className="group relative">
                  <button className="flex items-center hover:text-gray-300">
                    Services <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/express-pick-up" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Express Pick Up
                    </Link>
                    <Link href="/mbs-interiors" className="block px-4 py-2 text-black hover:bg-gray-100">
                      MBS Interiors
                    </Link>
                    <Link href="/ready2roof" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Ready-2-Roof
                    </Link>
                  </div>
                </div>

                <div className="group relative">
                  <button className="flex items-center hover:text-gray-300">
                    Products <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/product-solutions" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Product Solutions
                    </Link>
                    <Link href="/product-catalog" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Product Catalog
                    </Link>
                    <Link href="/roofing-catalog" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Roofing Catalog
                    </Link>
                    <Link href="/tool-catalog" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Tool Catalog
                    </Link>
                    <Link href="/inventory" className="block px-4 py-2 text-[#e74c4c] font-semibold hover:bg-gray-100">
                      View Live Inventory
                    </Link>
                  </div>
                </div>

                <div className="group relative">
                  <button className="flex items-center hover:text-gray-300">
                    Exclusive Brands <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="https://www.craftlinecabinetry.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Craftline Cabinetry
                    </Link>
                    <Link href="https://www.everviewcabinetry.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      EverView Cabinetry
                    </Link>
                    <Link href="https://www.homeviewcabinetry.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      HomeView Cabinetry
                    </Link>
                    <Link href="https://www.hydroshieldbuildingproducts.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      HydroShield
                    </Link>
                    <Link href="https://www.polarissiding.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Polaris Siding
                    </Link>
                    <Link href="https://polariswindows.com" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Polaris Windows
                    </Link>
                  </div>
                </div>

                <div className="group relative">
                  <button className="flex items-center hover:text-gray-300">
                    Customer Central <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/manage-account" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Manage Your Account
                    </Link>
                    <Link href="/mbs-newsletter" className="block px-4 py-2 text-black hover:bg-gray-100">
                      MBS Newsletter
                    </Link>
                    <Link href="/mbs-purchase-card" className="block px-4 py-2 text-black hover:bg-gray-100">
                      MBS Purchase Card
                    </Link>
                    <Link href="/manufacturer-rewards" className="block px-4 py-2 text-black hover:bg-gray-100">
                      Manufacturer Rewards
                    </Link>
                    <Link href="/admin" className="block px-4 py-2 text-[#e74c4c] font-semibold hover:bg-gray-100">
                      Admin Management
                    </Link>
                    {user?.role === 'supplier' && (
                      <Link href="/dashboard" className="block px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100">
                        Supplier Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </nav>

              {/* Auth Section */}
              <div className="flex items-center gap-3 mt-4">
                {/* Cart button with item count */}
                <Button variant="ghost" size="sm" asChild className="relative bg-white hover:bg-gray-100 text-black">
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden md:inline">{user.contactName}</span>
                        {/* Show loyalty tier badge */}
                        <Badge className={`text-xs ${
                          user.loyaltyTier === 'platinum' ? 'bg-purple-500' :
                          user.loyaltyTier === 'gold' ? 'bg-yellow-500' :
                          user.loyaltyTier === 'silver' ? 'bg-gray-400' :
                          'bg-orange-600'
                        } text-white capitalize`}>
                          {user.loyaltyTier}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.contactName}</p>
                        <p className="text-xs text-gray-500">{user.companyName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{user.loyaltyPoints?.toLocaleString() ?? 0} points</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account?tab=orders" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account?tab=loyalty" className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Loyalty Rewards
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account?tab=credit" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account?tab=settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    className="bg-white hover:bg-gray-100 text-black"
                    onClick={() => setAuthDialogOpen(true)}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden absolute right-4 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/inventory"
                    className="text-lg hover:text-[#e74c4c]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Live Inventory
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg hover:text-[#e74c4c]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/branches"
                    className="text-lg hover:text-[#e74c4c]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Branches
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg hover:text-[#e74c4c]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                  {!pathname?.startsWith('/inventory') && (
                    <Button
                      className="bg-[#e74c4c] hover:bg-[#d63838] text-white font-semibold w-full mt-4"
                      asChild
                    >
                      <Link href="/inventory">
                        Shop Online Now!
                      </Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
