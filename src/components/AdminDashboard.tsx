'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Check,
  X,
  Eye,
  Truck,
  DollarSign,
  Calendar,
  Save
} from 'lucide-react'
import Header from '@/components/Header'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  unit: string
  lowStockAlert: number
}

interface Order {
  id: string
  customerName: string
  company: string
  date: string
  deliveryDate: string
  deliveryType: 'ground' | 'airdrop'
  status: 'pending' | 'accepted' | 'processing' | 'delivering' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  tax: number
  deliveryFee: number
  items: { id: string; name: string; quantity: number; price: number }[]
  deliveryInfo: {
    address: string
    city: string
    state: string
    zipCode: string
    contactName: string
    contactPhone: string
    notes: string
    purchaseOrderNumber: string
    orderType: 'purchase' | 'quote'
    jobSiteName: string
    jobSiteAddress: string
    creditTerms: 'net30' | 'cod' | 'credit-card'
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    unit: '',
    lowStockAlert: '',
    description: ''
  })

  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Architectural Shingles - Charcoal', category: 'shingles', brand: 'CertainTeed', price: 89.99, stock: 245, unit: 'bundle', lowStockAlert: 50 },
    { id: '2', name: 'Synthetic Underlayment', category: 'underlayment', brand: 'Deck-Armor', price: 89.99, stock: 12, unit: 'roll', lowStockAlert: 15 },
    { id: '3', name: 'Aluminum Drip Edge - White', category: 'drip-edge', brand: 'Amerimax', price: 3.25, stock: 500, unit: 'linear ft', lowStockAlert: 100 },
  ])

  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const savedOrders = localStorage.getItem('mbs-orders')
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders)
          console.log('Raw orders from localStorage:', parsedOrders)

          // Transform cart orders to admin format with safe parsing
          const transformedOrders = parsedOrders.map((order: any) => {
            try {
              // Safe date parsing
              const orderDate = order.orderDate ? new Date(order.orderDate) : new Date()
              const deliveryDateRaw = order.deliveryInfo?.date
              let deliveryDate = 'TBD'

              if (deliveryDateRaw) {
                try {
                  const parsedDeliveryDate = new Date(deliveryDateRaw)
                  if (!isNaN(parsedDeliveryDate.getTime())) {
                    deliveryDate = parsedDeliveryDate.toLocaleDateString()
                  }
                } catch (dateError) {
                  console.warn('Error parsing delivery date:', dateError)
                }
              }

              return {
                id: order.id || `ORD-${Date.now()}`,
                customerName: order.deliveryInfo?.contactName || 'Unknown Customer',
                company: order.deliveryInfo?.jobSiteName || 'N/A',
                date: orderDate.toLocaleDateString(),
                deliveryDate,
                deliveryType: order.deliveryInfo?.deliveryType || 'ground',
                status: order.status || 'pending',
                total: Number(order.total) || 0,
                subtotal: Number(order.subtotal) || 0,
                tax: Number(order.tax) || 0,
                deliveryFee: Number(order.deliveryFee) || 0,
                items: Array.isArray(order.cartItems) ? order.cartItems : [],
                deliveryInfo: {
                  address: order.deliveryInfo?.address || '',
                  city: order.deliveryInfo?.city || '',
                  state: order.deliveryInfo?.state || '',
                  zipCode: order.deliveryInfo?.zipCode || '',
                  contactName: order.deliveryInfo?.contactName || '',
                  contactPhone: order.deliveryInfo?.contactPhone || '',
                  notes: order.deliveryInfo?.notes || '',
                  purchaseOrderNumber: order.deliveryInfo?.purchaseOrderNumber || '',
                  orderType: order.deliveryInfo?.orderType || 'purchase',
                  jobSiteName: order.deliveryInfo?.jobSiteName || '',
                  jobSiteAddress: order.deliveryInfo?.jobSiteAddress || '',
                  creditTerms: order.deliveryInfo?.creditTerms || 'credit-card'
                }
              }
            } catch (orderError) {
              console.error('Error transforming order:', orderError, order)
              // Return a minimal valid order object
              return {
                id: order.id || `ORD-ERROR-${Date.now()}`,
                customerName: 'Error Loading Customer',
                company: 'Error',
                date: new Date().toLocaleDateString(),
                deliveryDate: 'TBD',
                deliveryType: 'ground' as const,
                status: 'pending' as const,
                total: 0,
                subtotal: 0,
                tax: 0,
                deliveryFee: 0,
                items: [],
                deliveryInfo: {
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  contactName: '',
                  contactPhone: '',
                  notes: '',
                  purchaseOrderNumber: '',
                  orderType: 'purchase' as const,
                  jobSiteName: '',
                  jobSiteAddress: '',
                  creditTerms: 'credit-card' as const
                }
              }
            }
          })

          console.log('Transformed orders:', transformedOrders)
          setOrders(transformedOrders)
        } else {
          setOrders([])
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading orders:', error)
        setLoadError(`Failed to load orders: ${error instanceof Error ? error.message : 'Unknown error'}`)
        // Set empty orders array on error to prevent crashes
        setOrders([])
        setIsLoading(false)
      }
    }

    loadOrders()

    // Listen for storage changes (new orders)
    const handleStorageChange = () => {
      loadOrders()
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(loadOrders, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const stats = {
    totalProducts: products.length,
    lowStockItems: products.filter(p => p.stock <= p.lowStockAlert).length,
    pendingOrders: orders.filter(o => o?.status === 'pending').length,
    totalRevenue: orders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0)
  }

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'accepted' | 'processing' | 'delivering' | 'delivered' | 'cancelled') => {
    setOrders(prev => {
      const updated = prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )

      // Also update localStorage
      try {
        const savedOrders = localStorage.getItem('mbs-orders')
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders)
          const updatedSavedOrders = parsedOrders.map((order: any) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
          localStorage.setItem('mbs-orders', JSON.stringify(updatedSavedOrders))
        }
      } catch (error) {
        console.error('Error updating order status:', error)
      }

      return updated
    })
  }

  const openEditOrder = (order: Order) => {
    try {
      if (!order || !order.id) {
        console.error('Invalid order for editing:', order)
        return
      }
      setEditingOrder({ ...order })
      setIsEditOrderOpen(true)
    } catch (error) {
      console.error('Error opening order for edit:', error)
    }
  }

  const saveOrderChanges = () => {
    if (!editingOrder) return

    setOrders(prev => {
      const updated = prev.map(order =>
        order.id === editingOrder.id ? editingOrder : order
      )

      // Also update localStorage
      try {
        const savedOrders = localStorage.getItem('mbs-orders')
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders)
          const updatedSavedOrders = parsedOrders.map((order: any) =>
            order.id === editingOrder.id ? { ...order, ...editingOrder } : order
          )
          localStorage.setItem('mbs-orders', JSON.stringify(updatedSavedOrders))
        }
      } catch (error) {
        console.error('Error saving order changes:', error)
      }

      return updated
    })

    setIsEditOrderOpen(false)
    setEditingOrder(null)
  }

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      'pending': 'accepted',
      'accepted': 'processing',
      'processing': 'delivering',
      'delivering': 'delivered',
      'delivered': 'delivered', // Final state
      'cancelled': 'cancelled' // Final state
    }
    return statusFlow[currentStatus as keyof typeof statusFlow] || currentStatus
  }

  const canAdvanceStatus = (status: string) => {
    return !['delivered', 'cancelled'].includes(status)
  }

  const addProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      unit: newProduct.unit,
      lowStockAlert: parseInt(newProduct.lowStockAlert)
    }
    setProducts(prev => [...prev, product])
    setNewProduct({
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      unit: '',
      lowStockAlert: '',
      description: ''
    })
    setIsAddProductOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'accepted': return 'bg-blue-500'
      case 'processing': return 'bg-purple-500'
      case 'delivering': return 'bg-orange-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'accepted': return '✅'
      case 'processing': return '⚙️'
      case 'delivering': return '🚛'
      case 'delivered': return '📦'
      case 'cancelled': return '❌'
      default: return '❓'
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">MBS Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage inventory, orders, and customer accounts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                      <p className="text-3xl font-bold text-red-600">{stats.lowStockItems}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.company}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'accepted')}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory Management</h2>

              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="mbs-red mbs-red-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your inventory
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-name">Product Name</Label>
                        <Input
                          id="product-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shingles">Shingles</SelectItem>
                          <SelectItem value="underlayment">Underlayment</SelectItem>
                          <SelectItem value="drip-edge">Drip Edge</SelectItem>
                          <SelectItem value="flashings">Flashings</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          placeholder="bundle, roll, ft"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="low-stock">Low Stock Alert Level</Label>
                      <Input
                        id="low-stock"
                        type="number"
                        value={newProduct.lowStockAlert}
                        onChange={(e) => setNewProduct({...newProduct, lowStockAlert: e.target.value})}
                      />
                    </div>

                    <Button onClick={addProduct} className="w-full mbs-red mbs-red-hover">
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{product.category.replace('-', ' ')}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.stock} {product.unit}</p>
                            {product.stock <= product.lowStockAlert && (
                              <Badge className="bg-red-500 text-white text-xs">Low Stock</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge className={product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Management</h2>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {orders.length} Total Orders
              </Badge>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Orders...</h3>
                  <p className="text-gray-600">Please wait while we load your orders.</p>
                </CardContent>
              </Card>
            ) : loadError ? (
              <Card>
                <CardContent className="text-center py-12">
                  <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Orders</h3>
                  <p className="text-red-600 mb-4">{loadError}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reload Page
                  </Button>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600">Orders placed through the cart will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        try {
                          if (!order || !order.id) {
                            console.warn('Invalid order object:', order)
                            return null
                          }
                          return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.company}</p>
                              {order.deliveryInfo.purchaseOrderNumber && (
                                <p className="text-xs text-blue-600">PO: {order.deliveryInfo.purchaseOrderNumber}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              <div>
                                <p className="text-sm">{order.deliveryDate}</p>
                                <p className="text-xs text-gray-500">
                                  {order.deliveryInfo.city}, {order.deliveryInfo.state}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${order.deliveryType === 'airdrop' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}
                            >
                              {order.deliveryType === 'airdrop' ? '✈️ Airdrop' : '🚛 Ground Drop'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusColor(order.status)} text-white`}>
                                {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                {order.items.length} items
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" title="View Details">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - {order.id}</DialogTitle>
                                    <DialogDescription>
                                      Complete order information and delivery details
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Customer Information</h4>
                                        <p><strong>Name:</strong> {order.customerName}</p>
                                        <p><strong>Company:</strong> {order.company}</p>
                                        <p><strong>Phone:</strong> {order.deliveryInfo.contactPhone}</p>
                                        {order.deliveryInfo.purchaseOrderNumber && (
                                          <p><strong>PO Number:</strong> {order.deliveryInfo.purchaseOrderNumber}</p>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2">Delivery Information</h4>
                                        <p><strong>Type:</strong> {order.deliveryType === 'airdrop' ? 'Airdrop ($150)' : 'Ground Drop ($75)'}</p>
                                        <p><strong>Date:</strong> {order.deliveryDate}</p>
                                        <p><strong>Address:</strong> {order.deliveryInfo.address}</p>
                                        <p>{order.deliveryInfo.city}, {order.deliveryInfo.state} {order.deliveryInfo.zipCode}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-semibold mb-2">Order Items</h4>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {order.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{item.name}</TableCell>
                                              <TableCell>{item.quantity}</TableCell>
                                              <TableCell>${item.price.toFixed(2)}</TableCell>
                                              <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>

                                    <div className="border-t pt-4">
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Subtotal:</span>
                                          <span>${order.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Tax (8%):</span>
                                          <span>${order.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Delivery Fee:</span>
                                          <span>${order.deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                          <span>Total:</span>
                                          <span>${order.total.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {order.deliveryInfo.notes && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Special Instructions</h4>
                                        <p className="text-sm bg-gray-50 p-3 rounded">{order.deliveryInfo.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditOrder(order)}
                                title="Edit Order"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              {canAdvanceStatus(order.status) && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, getNextStatus(order.status) as any)}
                                  className="bg-blue-600 text-white hover:bg-blue-700"
                                  title={`Move to ${getNextStatus(order.status)}`}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}

                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  title="Cancel Order"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                              {/* Status Dropdown for quick changes */}
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">⏳ Pending</SelectItem>
                                  <SelectItem value="accepted">✅ Accepted</SelectItem>
                                  <SelectItem value="processing">⚙️ Processing</SelectItem>
                                  <SelectItem value="delivering">🚛 Delivering</SelectItem>
                                  <SelectItem value="delivered">📦 Delivered</SelectItem>
                                  <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                          )
                        } catch (orderRenderError) {
                          console.error('Error rendering order:', orderRenderError, order)
                          return (
                            <TableRow key={order?.id || Math.random()}>
                              <TableCell colSpan={8} className="text-center text-red-600 py-4">
                                Error loading order: {order?.id || 'Unknown'}
                              </TableCell>
                            </TableRow>
                          )
                        }
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Management</h2>

            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
                <p className="text-gray-600">Customer management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Order Dialog */}
        <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Order - {editingOrder?.id}</DialogTitle>
              <DialogDescription>
                Modify order details and customer information
              </DialogDescription>
            </DialogHeader>

            {editingOrder && (
              <div className="space-y-6">
                {/* Order Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-status">Order Status</Label>
                    <Select
                      value={editingOrder.status}
                      onValueChange={(value) => setEditingOrder({...editingOrder, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="accepted">✅ Accepted</SelectItem>
                        <SelectItem value="processing">⚙️ Processing</SelectItem>
                        <SelectItem value="delivering">🚛 Delivering</SelectItem>
                        <SelectItem value="delivered">📦 Delivered</SelectItem>
                        <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-delivery-type">Delivery Type</Label>
                    <Select
                      value={editingOrder.deliveryType}
                      onValueChange={(value) => {
                        const newDeliveryFee = value === 'airdrop' ? 150 : 75
                        const newTotal = editingOrder.subtotal + editingOrder.tax + newDeliveryFee
                        setEditingOrder({
                          ...editingOrder,
                          deliveryType: value as 'ground' | 'airdrop',
                          deliveryFee: newDeliveryFee,
                          total: newTotal
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ground">🚛 Ground Drop ($75)</SelectItem>
                        <SelectItem value="airdrop">✈️ Airdrop ($150)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-customer-name">Customer Name</Label>
                      <Input
                        id="edit-customer-name"
                        value={editingOrder.deliveryInfo.contactName}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          customerName: e.target.value,
                          deliveryInfo: {...editingOrder.deliveryInfo, contactName: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-company">Company/Job Site</Label>
                      <Input
                        id="edit-company"
                        value={editingOrder.deliveryInfo.jobSiteName}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          company: e.target.value,
                          deliveryInfo: {...editingOrder.deliveryInfo, jobSiteName: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={editingOrder.deliveryInfo.contactPhone}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, contactPhone: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-po">Purchase Order #</Label>
                      <Input
                        id="edit-po"
                        value={editingOrder.deliveryInfo.purchaseOrderNumber}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, purchaseOrderNumber: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="font-semibold mb-3">Delivery Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="edit-address">Street Address</Label>
                      <Input
                        id="edit-address"
                        value={editingOrder.deliveryInfo.address}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, address: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-city">City</Label>
                      <Input
                        id="edit-city"
                        value={editingOrder.deliveryInfo.city}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, city: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-state">State</Label>
                      <Input
                        id="edit-state"
                        value={editingOrder.deliveryInfo.state}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, state: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-zip">ZIP Code</Label>
                      <Input
                        id="edit-zip"
                        value={editingOrder.deliveryInfo.zipCode}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          deliveryInfo: {...editingOrder.deliveryInfo, zipCode: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <Label htmlFor="edit-notes">Special Instructions</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingOrder.deliveryInfo.notes}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      deliveryInfo: {...editingOrder.deliveryInfo, notes: e.target.value}
                    })}
                    rows={3}
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Order Summary</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${editingOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%):</span>
                      <span>${editingOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee ({editingOrder.deliveryType}):</span>
                      <span>${editingOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${editingOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditOrderOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveOrderChanges}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  )
}
