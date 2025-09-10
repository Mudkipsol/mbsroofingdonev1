'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Minus, Calendar as CalendarIcon, MapPin, Truck, FileText, CreditCard, Building, Quote, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  unit: string
}

interface DeliveryInfo {
  deliveryType: 'ground' | 'airdrop' | ''
  date: Date | undefined
  deliveryTime: string
  address: string
  city: string
  state: string
  zipCode: string
  contactName: string
  contactPhone: string
  notes: string
  // New Cart Upgrade Fields
  purchaseOrderNumber: string
  orderType: 'purchase' | 'quote'
  jobSiteName: string
  jobSiteAddress: string
  creditTerms: 'net30' | 'cod' | 'credit-card'
}

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    deliveryType: '',
    date: undefined,
    deliveryTime: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactName: '',
    contactPhone: '',
    notes: '',
    // New Cart Upgrade Fields
    purchaseOrderNumber: '',
    orderType: 'purchase',
    jobSiteName: '',
    jobSiteAddress: '',
    creditTerms: 'credit-card'
  })

  const [showDeliveryScheduling, setShowDeliveryScheduling] = useState(false)
  const [quantityInputs, setQuantityInputs] = useState<{[key: string]: string}>({})

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const deliveryFee = deliveryInfo.deliveryType === 'airdrop' ? 150.00 : 75.00 // Airdrop costs more
  const total = subtotal + tax + deliveryFee

  const handleSubmitOrder = () => {
    // Prepare delivery info with proper date formatting
    const processedDeliveryInfo = {
      ...deliveryInfo,
      date: deliveryInfo.date ? deliveryInfo.date.toISOString() : null
    }

    const orderData = {
      orderType: 'delivery',
      cartItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      orderDate: new Date().toISOString(),
      status: 'pending',
      deliveryInfo: processedDeliveryInfo
    }

    // Save order to localStorage (in real app, this would be an API call)
    const existingOrders = JSON.parse(localStorage.getItem('mbs-orders') || '[]')
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData
    }
    existingOrders.push(newOrder)
    localStorage.setItem('mbs-orders', JSON.stringify(existingOrders))

    console.log('Order submitted:', newOrder)

    const deliveryType = deliveryInfo.deliveryType === 'airdrop' ? 'Airdrop' : 'Ground Drop'
    alert(`${deliveryType} delivery order submitted successfully! Order ID: ${newOrder.id}\n\nYou will receive a confirmation email shortly.`)

    clearCart()
    setShowDeliveryScheduling(false)

    // Reset form
    setDeliveryInfo({
      deliveryType: '',
      date: undefined,
      deliveryTime: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      contactName: '',
      contactPhone: '',
      notes: '',
      // Reset cart upgrade fields
      purchaseOrderNumber: '',
      orderType: 'purchase',
      jobSiteName: '',
      jobSiteAddress: '',
      creditTerms: 'credit-card'
    })
  }

  const handleQuantityInputChange = (itemId: string, value: string) => {
    setQuantityInputs(prev => ({ ...prev, [itemId]: value }))
  }

  const handleQuantityInputSubmit = (itemId: string) => {
    const newQuantity = parseInt(quantityInputs[itemId])
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
    // Clear the input state for this item
    setQuantityInputs(prev => {
      const newState = { ...prev }
      delete newState[itemId]
      return newState
    })
  }

  const isDeliveryInfoComplete =
    deliveryInfo.deliveryType &&
    deliveryInfo.date &&
    deliveryInfo.address &&
    deliveryInfo.city &&
    deliveryInfo.state &&
    deliveryInfo.zipCode &&
    deliveryInfo.contactName &&
    deliveryInfo.contactPhone &&
    (deliveryInfo.deliveryType === 'ground' || deliveryInfo.deliveryTime) &&
    // Additional validations for cart upgrades
    (deliveryInfo.creditTerms !== 'net30' || deliveryInfo.orderType === 'quote') // Net 30 requires quote or approval

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3" />
            <Link href="/cart" className="hover:text-red-600 transition-colors cursor-pointer">
              Shopping Cart
            </Link>
          </h1>
          <p className="text-gray-600 mt-2">Review your order and schedule delivery</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Button className="mbs-red mbs-red-hover" asChild>
                <Link href="/inventory">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <Input
                            type="number"
                            min="1"
                            value={quantityInputs[item.id] !== undefined ? quantityInputs[item.id] : item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputSubmit(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleQuantityInputSubmit(item.id)
                              }
                            }}
                            className="w-16 text-center h-8"
                          />

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Delivery Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Delivery Information
                  </CardTitle>
                  <CardDescription>
                    Professional delivery to your job site or location
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Professional Delivery Service</h3>
                        <p className="text-sm text-blue-700">
                          Our professional delivery team will bring your materials directly to your job site.
                          Delivery fee: $75.00 (covers 5-state region)
                        </p>
                      </div>
                    </div>
                  </div>

                  {!showDeliveryScheduling ? (
                    <Button
                      onClick={() => setShowDeliveryScheduling(true)}
                      className="w-full mbs-red mbs-red-hover"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Delivery
                    </Button>
                  ) : null}
                </CardContent>
              </Card>

              {/* Delivery Scheduling */}
              {showDeliveryScheduling && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Schedule {deliveryInfo.deliveryType === 'airdrop' ? 'Airdrop' : 'Ground Drop'} Delivery
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeliveryScheduling(false)}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Calendar */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Select Delivery Date</Label>
                      <Calendar
                        mode="single"
                        selected={deliveryInfo.date}
                        onSelect={(date) => setDeliveryInfo(prev => ({ ...prev, date }))}
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        className="rounded-md border"
                      />
                    </div>

                    {/* Delivery Time Selection - Only for Airdrop */}
                    {deliveryInfo.deliveryType === 'airdrop' && (
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Specific Delivery Time</Label>
                        <Select
                          value={deliveryInfo.deliveryTime}
                          onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, deliveryTime: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</SelectItem>
                            <SelectItem value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</SelectItem>
                            <SelectItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</SelectItem>
                            <SelectItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</SelectItem>
                            <SelectItem value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</SelectItem>
                            <SelectItem value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</SelectItem>
                            <SelectItem value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</SelectItem>
                            <SelectItem value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</SelectItem>
                            <SelectItem value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-600 mt-2">
                          Airdrop service includes precise timing coordination with your team.
                        </p>
                      </div>
                    )}

                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Delivery Address</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street"
                            value={deliveryInfo.address}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Youngstown"
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select value={deliveryInfo.state} onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, state: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OH">Ohio</SelectItem>
                              <SelectItem value="PA">Pennsylvania</SelectItem>
                              <SelectItem value="WV">West Virginia</SelectItem>
                              <SelectItem value="KY">Kentucky</SelectItem>
                              <SelectItem value="IN">Indiana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="44503"
                            value={deliveryInfo.zipCode}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information (Company Representative) */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Contact Information (Company Representative) if applicable</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName">Contact Name</Label>
                          <Input
                            id="contactName"
                            placeholder="John Smith"
                            value={deliveryInfo.contactName}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, contactName: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPhone">Phone Number</Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={deliveryInfo.contactPhone}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Notes */}
                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder={deliveryInfo.deliveryType === 'airdrop'
                          ? "Special timing requirements, coordination notes..."
                          : "Any special delivery instructions..."
                        }
                        value={deliveryInfo.notes}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    {/* ===== NEW CART UPGRADES ===== */}

                    {/* Business Information Section */}
                    <div className="border-t pt-6">
                      <Label className="text-base font-semibold mb-4 block">💼 Business Information</Label>

                      {/* Purchase Order & Job Site */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="purchaseOrder">Purchase Order # (Optional)</Label>
                          <Input
                            id="purchaseOrder"
                            placeholder="PO-2024-001"
                            value={deliveryInfo.purchaseOrderNumber}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobSiteName">Job Site Name (Optional)</Label>
                          <Input
                            id="jobSiteName"
                            placeholder="Downtown Office Building"
                            value={deliveryInfo.jobSiteName}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, jobSiteName: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Job Site Address */}
                      <div className="mb-4">
                        <Label htmlFor="jobSiteAddress">Job Site Address (if different)</Label>
                        <Input
                          id="jobSiteAddress"
                          placeholder="123 Construction Ave, Youngstown, OH 44503"
                          value={deliveryInfo.jobSiteAddress}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, jobSiteAddress: e.target.value }))}
                        />
                      </div>


                    </div>

                    {/* Order Type & Payment Terms */}
                    <div className="border-t pt-6">
                      <Label className="text-base font-semibold mb-4 block">💳 Order Type & Payment</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Order Type */}
                        <div>
                          <Label>Order Type</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              variant={deliveryInfo.orderType === 'purchase' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setDeliveryInfo(prev => ({ ...prev, orderType: 'purchase' }))}
                              className="flex-1"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Purchase Now
                            </Button>
                            <Button
                              type="button"
                              variant={deliveryInfo.orderType === 'quote' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setDeliveryInfo(prev => ({ ...prev, orderType: 'quote' }))}
                              className="flex-1"
                            >
                              <Quote className="w-4 h-4 mr-1" />
                              Request Quote
                            </Button>
                          </div>
                        </div>

                        {/* Payment Terms */}
                        <div>
                          <Label htmlFor="creditTerms">Payment Terms</Label>
                          <Select
                            value={deliveryInfo.creditTerms}
                            onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, creditTerms: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="cod">Cash on Delivery</SelectItem>
                              <SelectItem value="net30">Net 30 Terms (Approved Contractors)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Net 30 Notice */}
                      {deliveryInfo.creditTerms === 'net30' && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                          <p className="text-blue-800">
                            <strong>Net 30 Terms:</strong> Available for approved contractors with established credit.
                            <a href="#" className="underline ml-1">Apply for credit account →</a>
                          </p>
                        </div>
                      )}
                    </div>


                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee{deliveryInfo.deliveryType ? ` (${deliveryInfo.deliveryType === 'airdrop' ? 'Airdrop' : 'Ground Drop'})` : ''}:</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    {deliveryInfo.orderType === 'quote' && (
                      <div className="p-2 bg-blue-50 text-blue-800 text-xs rounded">
                        💡 Quote Mode: Final pricing subject to approval
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!showDeliveryScheduling ? (
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            setDeliveryInfo(prev => ({ ...prev, deliveryType: 'ground' }))
                            setShowDeliveryScheduling(true)
                          }}
                          className="w-full mbs-red mbs-red-hover text-sm"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Ground Drop ($75)
                        </Button>
                        <Button
                          onClick={() => {
                            setDeliveryInfo(prev => ({ ...prev, deliveryType: 'airdrop' }))
                            setShowDeliveryScheduling(true)
                          }}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Airdrop ($150)
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={handleSubmitOrder}
                          disabled={!isDeliveryInfoComplete}
                          className={`w-full ${deliveryInfo.orderType === 'quote' ? 'bg-blue-600 hover:bg-blue-700' : 'mbs-red mbs-red-hover'}`}
                        >
                          {deliveryInfo.orderType === 'quote' ? (
                            <>
                              <Quote className="w-4 h-4 mr-2" />
                              Request Quote
                            </>
                          ) : (
                            <>
                              <Truck className="w-4 h-4 mr-2" />
                              Confirm {deliveryInfo.deliveryType === 'airdrop' ? 'Airdrop' : 'Ground Drop'} Order
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setShowDeliveryScheduling(false)}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to Delivery Options
                        </Button>
                      </div>
                    )}

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/inventory">Continue Shopping</Link>
                    </Button>
                  </div>

                  {/* Order Status */}
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          Delivery Area
                        </Badge>
                        <span className="text-sm text-gray-600">5-State Region</span>
                      </div>

                      {deliveryInfo.date && (
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-green-500">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {deliveryInfo.date.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}
