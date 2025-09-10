'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Filter, ShoppingCart, Package, Eye, Edit, Lock, Plus, Minus, X, Save, Upload } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  unit: string
  description: string
  image?: string
  specifications?: string[]
  sku?: string
}

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [quantities, setQuantities] = useState<{[key: string]: number}>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFullEditDialogOpen, setIsFullEditDialogOpen] = useState(false)
  const { addToCart, items: cartItems } = useCart()

  // Enhanced sample inventory data with images and out-of-stock item
  const [products, setProducts] = useState<Product[]>([
    // Shingles
    {
      id: '1',
      name: 'Architectural Shingles - Charcoal',
      category: 'shingles',
      brand: 'Owens Corning',
      price: 89.99,
      stock: 150,
      unit: 'bundle',
      description: 'Premium architectural shingles with 30-year warranty',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=300&fit=crop',
      specifications: ['30-year warranty', 'Class A fire rating', 'Wind resistant up to 130 mph', 'Weight: 260 lbs per square'],
      sku: 'OC-ARCH-CHAR-001'
    },
    {
      id: '2',
      name: '3-Tab Shingles - Storm Gray',
      category: 'shingles',
      brand: 'GAF',
      price: 65.99,
      stock: 0, // Out of stock item
      unit: 'bundle',
      description: 'Traditional 3-tab shingles, cost-effective solution',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=300&fit=crop',
      specifications: ['20-year warranty', 'Class A fire rating', 'Wind resistant up to 60 mph', 'Weight: 200 lbs per square'],
      sku: 'GAF-3TAB-GRAY-002'
    },
    {
      id: '3',
      name: 'Designer Shingles - Aged Copper',
      category: 'shingles',
      brand: 'CertainTeed',
      price: 125.99,
      stock: 75,
      unit: 'bundle',
      description: 'Premium designer shingles with enhanced curb appeal',
      image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=300&fit=crop',
      specifications: ['Lifetime warranty', 'Class A fire rating', 'Wind resistant up to 110 mph', 'Weight: 300 lbs per square'],
      sku: 'CT-DESIGN-COPP-003'
    },

    // Underlayment
    {
      id: '4',
      name: 'Synthetic Underlayment - 10 SQ',
      category: 'underlayment',
      brand: 'Titanium UDL',
      price: 89.99,
      stock: 100,
      unit: 'roll',
      description: 'High-performance synthetic underlayment',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      specifications: ['10 square coverage', 'Slip-resistant surface', '6-month UV exposure', 'Weight: 28 lbs per roll'],
      sku: 'TIT-SYNTH-10SQ-004'
    },
    {
      id: '5',
      name: 'Felt Underlayment #30',
      category: 'underlayment',
      brand: 'GAF',
      price: 45.99,
      stock: 250,
      unit: 'roll',
      description: 'Traditional asphalt-saturated felt underlayment',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=300&fit=crop',
      specifications: ['2 square coverage', 'ASTM compliant', 'Asphalt saturated', 'Weight: 60 lbs per roll'],
      sku: 'GAF-FELT30-005'
    },
    {
      id: '6',
      name: 'Ice & Water Shield',
      category: 'underlayment',
      brand: 'Grace',
      price: 125.99,
      stock: 15,
      unit: 'roll',
      description: 'Self-adhering ice and water barrier',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=300&fit=crop',
      specifications: ['Self-adhesive', '2 square coverage', 'Watertight seal', 'Weight: 45 lbs per roll'],
      sku: 'GRACE-IWS-006'
    },

    // Drip Edge
    {
      id: '7',
      name: 'Aluminum Drip Edge - White',
      category: 'drip-edge',
      brand: 'Amerimax',
      price: 3.25,
      stock: 500,
      unit: 'linear ft',
      description: 'Corrosion-resistant aluminum drip edge',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=300&fit=crop',
      specifications: ['10 ft length', 'Pre-painted finish', 'Corrosion resistant', '0.019" thickness'],
      sku: 'AMX-DRIP-WHT-007'
    },
    {
      id: '8',
      name: 'Steel Drip Edge - Galvanized',
      category: 'drip-edge',
      brand: 'Klauer',
      price: 4.15,
      stock: 400,
      unit: 'linear ft',
      description: 'Heavy-duty galvanized steel drip edge',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      specifications: ['10 ft length', 'Galvanized steel', 'Heavy gauge', '0.024" thickness'],
      sku: 'KL-DRIP-GALV-008'
    },

    // Flashings
    {
      id: '9',
      name: 'Step Flashing - Aluminum',
      category: 'flashings',
      brand: 'Amerimax',
      price: 2.85,
      stock: 300,
      unit: 'piece',
      description: 'Pre-bent aluminum step flashing',
      image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=300&fit=crop',
      specifications: ['2" x 3" x 7"', 'Pre-bent 90 degrees', 'Mill finish', '50 pieces per bundle'],
      sku: 'AMX-STEP-AL-009'
    },
    {
      id: '10',
      name: 'Valley Flashing - 20ft',
      category: 'flashings',
      brand: 'Klauer',
      price: 45.99,
      stock: 150,
      unit: 'piece',
      description: 'W-valley flashing, 20-foot length',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=300&fit=crop',
      specifications: ['20 ft length', '24" total width', 'Galvanized steel', '0.019" thickness'],
      sku: 'KL-VALLEY-20-010'
    },
    {
      id: '11',
      name: 'Pipe Boot Flashing',
      category: 'flashings',
      brand: 'Oatey',
      price: 12.99,
      stock: 200,
      unit: 'piece',
      description: 'Rubber pipe boot for roof penetrations',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=300&fit=crop',
      specifications: ['EPDM rubber', 'Fits 1.5"-3" pipes', 'Aluminum base', '-70°F to 212°F'],
      sku: 'OAT-BOOT-011'
    },

    // Accessories
    {
      id: '12',
      name: 'Roofing Nails - 1.25"',
      category: 'accessories',
      brand: 'Maze Nails',
      price: 89.99,
      stock: 100,
      unit: '50lb box',
      description: 'Hot-dipped galvanized roofing nails',
      image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=400&h=300&fit=crop',
      specifications: ['1.25" length', '11 gauge', 'Hot-dipped galvanized', 'Approx 7,200 nails per box'],
      sku: 'MAZE-NAIL-125-012'
    },
    {
      id: '13',
      name: 'Roof Cement - 10.3oz',
      category: 'accessories',
      brand: 'Henry',
      price: 8.99,
      stock: 30,
      unit: 'tube',
      description: 'Plastic roof cement for repairs and sealing',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      specifications: ['10.3 oz cartridge', 'All-weather formula', 'Asphalt based', 'Black color'],
      sku: 'HENRY-CEMENT-013'
    },
    {
      id: '14',
      name: 'Ridge Vent - 4ft',
      category: 'accessories',
      brand: 'Air Vent',
      price: 24.99,
      stock: 120,
      unit: 'piece',
      description: 'Ridge vent for proper attic ventilation',
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400&h=300&fit=crop',
      specifications: ['4 ft section', '18 sq in NFA per ft', 'Weather filter', 'Nail-line guides'],
      sku: 'AV-RIDGE-4FT-014'
    },
  ])

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('mbs_products')
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } catch (error) {
        console.error('Error loading saved products:', error)
      }
    }
  }, [])

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'shingles', name: 'Shingles', icon: Package },
    { id: 'underlayment', name: 'Underlayment', icon: Package },
    { id: 'drip-edge', name: 'Drip Edge', icon: Package },
    { id: 'flashings', name: 'Flashings', icon: Package },
    { id: 'accessories', name: 'Accessories', icon: Package },
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (product: Product, quantity: number) => {
    // Only add to cart, don't modify stock
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    }, quantity)
    setQuantities(prev => ({ ...prev, [product.id]: 1 })) // Reset quantity after adding
  }

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find(item => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const getStockBadgeColor = (stock: number) => {
    if (stock === 0) return 'bg-red-500'
    if (stock > 100) return 'bg-green-500'
    if (stock > 50) return 'bg-yellow-500'
    if (stock > 15) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock'
    if (stock <= 15) return `Only ${stock} left`
    return `${stock} in stock`
  }

  const handleQuantityChange = (productId: string, value: string) => {
    // Only update the quantity state, never touch the product stock
    const num = parseInt(value) || 1
    const product = products.find(p => p.id === productId)
    if (product) {
      // Ensure quantity doesn't exceed available stock
      const maxQuantity = Math.min(num, product.stock || 999)
      setQuantities(prev => ({ ...prev, [productId]: Math.max(1, maxQuantity) }))
    } else {
      setQuantities(prev => ({ ...prev, [productId]: Math.max(1, num) }))
    }
  }

  const handleMasterPasswordSubmit = () => {
    if (masterPassword === 'MBS2024admin') {
      setIsEditMode(true)
      setIsPasswordDialogOpen(false)
      setMasterPassword('')
    } else {
      alert('Incorrect password')
    }
  }

  const handleFullProductEdit = () => {
    if (editingProduct) {
      // Update the products array with the edited product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? editingProduct : p
      )
      setProducts(updatedProducts)
      // Save the updated products array to localStorage
      localStorage.setItem('mbs_products', JSON.stringify(updatedProducts))
      setIsFullEditDialogOpen(false)
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const newProducts = products.filter(p => p.id !== productId)
      setProducts(newProducts)
      localStorage.setItem('mbs_products', JSON.stringify(newProducts))
    }
  }

  const handleAddNewProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      category: 'shingles',
      brand: 'Brand Name',
      price: 0,
      stock: 0,
      unit: 'piece',
      description: 'Product description',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=300&fit=crop',
      specifications: [],
      sku: 'NEW-' + Date.now()
    }
    setEditingProduct(newProduct)
    setIsFullEditDialogOpen(true)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MBS Inventory</h1>
              <p className="text-gray-600 mt-2">Professional roofing supplies in stock and ready to ship</p>
            </div>
            <div className="flex gap-2">
              {!isEditMode ? (
                <Button
                  onClick={() => setIsPasswordDialogOpen(true)}
                  variant="outline"
                  className="flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Admin Edit
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleAddNewProduct}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                  <Button
                    onClick={() => setIsEditMode(false)}
                    className="mbs-red mbs-red-hover"
                  >
                    Exit Edit Mode
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id ? 'mbs-red' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products, brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stock">Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-200">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                          OUT OF STOCK
                        </Badge>
                      </div>
                    )}
                    {isEditMode && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsFullEditDialogOpen(true)
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-[#e33f3f]"
                            onClick={() => setSelectedProduct(product)}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <Badge
                        className={`${getStockBadgeColor(product.stock)} text-white`}
                      >
                        {getStockText(product.stock)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-xs text-gray-500 mb-4">SKU: {product.sku}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">/ {product.unit}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Quantity Input */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Qty:</Label>
                        <div className="flex items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, String((quantities[product.id] || 1) - 1))}
                            className="h-8 w-8 p-0"
                            disabled={product.stock === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={product.stock || 999}
                            step="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            className="w-16 h-8 text-center mx-1"
                            disabled={product.stock === 0}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(product.id, String((quantities[product.id] || 1) + 1))}
                            className="h-8 w-8 p-0"
                            disabled={product.stock === 0 || (quantities[product.id] || 1) >= product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedProduct(product)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleAddToCart(product, quantities[product.id] || 1)}
                          className="flex-1 mbs-red mbs-red-hover"
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                          {getCartQuantity(product.id) > 0 && (
                            <Badge className="ml-2 bg-white text-red-600">
                              {getCartQuantity(product.id)}
                            </Badge>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.brand}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  {selectedProduct.image ? (
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">SKU</Label>
                    <p className="font-semibold">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Category</Label>
                    <p className="font-semibold capitalize">{selectedProduct.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Price</Label>
                    <p className="font-semibold text-xl">${selectedProduct.price} / {selectedProduct.unit}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Stock Status</Label>
                    <Badge className={`${getStockBadgeColor(selectedProduct.stock)} text-white`}>
                      {getStockText(selectedProduct.stock)}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm text-gray-600">Description</Label>
                  <p className="mt-2">{selectedProduct.description}</p>
                </div>

                {/* Specifications */}
                {selectedProduct.specifications && (
                  <div>
                    <Label className="text-sm text-gray-600">Specifications</Label>
                    <ul className="mt-2 space-y-1">
                      {selectedProduct.specifications.map((spec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#e33f3f] mr-2">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Label className="mr-2">Quantity:</Label>
                      <div className="flex items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(selectedProduct.id, String((quantities[selectedProduct.id] || 1) - 1))}
                          className="h-8 w-8 p-0"
                          disabled={selectedProduct.stock === 0}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={selectedProduct.stock || 999}
                          step="1"
                          value={quantities[selectedProduct.id] || 1}
                          onChange={(e) => handleQuantityChange(selectedProduct.id, e.target.value)}
                          className="w-16 h-8 text-center mx-1"
                          disabled={selectedProduct.stock === 0}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(selectedProduct.id, String((quantities[selectedProduct.id] || 1) + 1))}
                          className="h-8 w-8 p-0"
                          disabled={selectedProduct.stock === 0 || (quantities[selectedProduct.id] || 1) >= selectedProduct.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleAddToCart(selectedProduct, quantities[selectedProduct.id] || 1)
                        setSelectedProduct(null)
                      }}
                      className="flex-1 mbs-red mbs-red-hover"
                      disabled={selectedProduct.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Product Edit Dialog */}
      <Dialog open={isFullEditDialogOpen} onOpenChange={setIsFullEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details below
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                <div>
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({...editingProduct, unit: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="edit-specs">Specifications (one per line)</Label>
                <Textarea
                  id="edit-specs"
                  value={editingProduct.specifications?.join('\n') || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    specifications: e.target.value.split('\n').filter(s => s.trim())
                  })}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsFullEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFullProductEdit} className="mbs-red mbs-red-hover">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Master Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access Required</DialogTitle>
            <DialogDescription>
              Enter the master password to access full editing capabilities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="master-password">Master Password</Label>
              <Input
                id="master-password"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMasterPasswordSubmit()}
                placeholder="Enter password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleMasterPasswordSubmit} className="mbs-red mbs-red-hover">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>

    <Footer />
    </>
  )
}
