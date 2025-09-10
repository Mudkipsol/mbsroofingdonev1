'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  ShoppingCart,
  AlertCircle,
  Lock,
  DollarSign,
  Users,
  Eye,
  Truck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  QrCode,
  Plus,
  Minus,
  Save,
  Edit2,
  Phone,
  Mail,
  Building,
  UserCheck,
  UserX,
  Search,
  ScanLine,
  PackageCheck,
  History
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface SimpleOrder {
  id: string;
  customerName: string;
  date: string;
  status: string;
  total: number;
  items: any[];
  deliveryType?: 'ground' | 'airdrop';
  deliveryInfo?: any;
}

interface ProductAnalytics {
  productId: string;
  productName: string;
  category: string;
  totalSold: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  lastMonthSales: number;
  stockLevel: number;
}

interface DeliveryTracking {
  orderId: string;
  customerName: string;
  deliveryType: 'ground' | 'airdrop';
  status: 'preparing' | 'in-transit' | 'delivered' | 'delayed';
  estimatedDelivery: string;
  address: string;
  driver?: string;
  trackingNumber?: string;
  priority: 'standard' | 'express' | 'urgent';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  brand?: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  price: number;
  lastRestocked: string;
  qrCode?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  joinDate: string;
  lastOrderDate?: string;
  notes?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SimpleOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Analytics states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'ground' | 'airdrop'>('all');

  // Inventory states
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [editingInventory, setEditingInventory] = useState<string | null>(null);
  const [qrScanMode, setQrScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Customer states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'inactive' | 'vip'>('all');

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load orders safely
  useEffect(() => {
    if (!isClient || !isAuthenticated) return;

    try {
      const savedOrders = localStorage.getItem('mbs-orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const simpleOrders = parsedOrders.map((order: any, index: number) => {
          try {
            return {
              id: order.id || `ORD-${index}`,
              customerName: order.deliveryInfo?.contactName || order.customerName || 'Unknown Customer',
              date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : new Date().toLocaleDateString(),
              status: order.status || 'pending',
              total: Number(order.total) || 0,
              items: order.cartItems || order.items || [],
              deliveryType: order.deliveryInfo?.deliveryType || 'ground',
              deliveryInfo: order.deliveryInfo || {}
            };
          } catch {
            return {
              id: `ORD-ERROR-${index}`,
              customerName: 'Error Loading',
              date: new Date().toLocaleDateString(),
              status: 'error',
              total: 0,
              items: [],
              deliveryType: 'ground' as const,
              deliveryInfo: {}
            };
          }
        });
        setOrders(simpleOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setLoadError('Failed to load orders');
      setOrders([]);
    }
  }, [isClient, isAuthenticated]);

  // Generate product analytics from orders
  const generateProductAnalytics = (): ProductAnalytics[] => {
    const productMap = new Map<string, ProductAnalytics>();

    // Sample products with categories
    const sampleProducts = [
      { id: 'landmark-black', name: 'Landmark Black', category: 'shingles', baseStock: 250 },
      { id: 'landmark-pro-gray', name: 'Landmark Pro Gray', category: 'shingles', baseStock: 180 },
      { id: 'presidential-shake-brown', name: 'Presidential Shake Brown', category: 'shingles', baseStock: 95 },
      { id: 'prolam-red', name: 'ProLam Red', category: 'shingles', baseStock: 320 },
      { id: 'pinnacle-green', name: 'Pinnacle Green', category: 'shingles', baseStock: 145 },
      { id: '15lb-felt', name: '15lb Felt', category: 'underlayment', baseStock: 450 },
      { id: '30lb-felt', name: '30lb Felt', category: 'underlayment', baseStock: 380 },
      { id: 'ice-water-shield', name: 'Ice & Water Shield', category: 'ice-and-water', baseStock: 225 },
      { id: 'ridge-vent', name: 'Ridge Vent', category: 'ventilation', baseStock: 310 },
      { id: 'drip-edge-black', name: 'Drip Edge Black', category: 'drip-edge', baseStock: 520 },
      { id: 'step-flashing', name: 'Step Flashing', category: 'flashings', baseStock: 850 },
      { id: 'pipe-boot', name: 'Pipe Boot', category: 'accessories', baseStock: 425 }
    ];

    // Initialize products
    sampleProducts.forEach(product => {
      const salesData = Math.floor(Math.random() * 200);
      const lastMonth = Math.floor(Math.random() * 200);
      const revenue = salesData * (Math.random() * 150 + 50);

      productMap.set(product.id, {
        productId: product.id,
        productName: product.name,
        category: product.category,
        totalSold: salesData,
        revenue: revenue,
        trend: salesData > lastMonth ? 'up' : salesData < lastMonth ? 'down' : 'stable',
        lastMonthSales: lastMonth,
        stockLevel: product.baseStock - salesData
      });
    });

    // Add data from actual orders
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const existingProduct = productMap.get(item.id);
        if (existingProduct) {
          existingProduct.totalSold += item.quantity || 1;
          existingProduct.revenue += (item.price || 0) * (item.quantity || 1);
        }
      });
    });

    return Array.from(productMap.values());
  };

  // Generate delivery tracking data
  const generateDeliveryTracking = (): DeliveryTracking[] => {
    const statuses: DeliveryTracking['status'][] = ['preparing', 'in-transit', 'delivered', 'delayed'];
    const priorities: DeliveryTracking['priority'][] = ['standard', 'express', 'urgent'];
    const drivers = ['Mike Johnson', 'Sarah Williams', 'Tom Davis', 'Lisa Anderson', 'John Smith'];

    return orders.map((order, index) => {
      const status = order.status === 'delivered' ? 'delivered' :
                    order.status === 'delivering' ? 'in-transit' :
                    order.status === 'processing' ? 'preparing' :
                    statuses[Math.floor(Math.random() * statuses.length)];

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 7) + 1);

      return {
        orderId: order.id,
        customerName: order.customerName,
        deliveryType: order.deliveryType || 'ground',
        status: status,
        estimatedDelivery: deliveryDate.toLocaleDateString(),
        address: order.deliveryInfo?.address || '123 Main St, Youngstown, OH',
        driver: order.deliveryType === 'ground' ? drivers[Math.floor(Math.random() * drivers.length)] : undefined,
        trackingNumber: `MBS${Date.now()}${index}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      };
    });
  };

  // Generate inventory data
  const generateInventoryData = (): InventoryItem[] => {
    return [
      // Shingles
      { id: 'INV001', name: 'Landmark Black', category: 'shingles', brand: 'CertainTeed', sku: 'CT-LM-BLK', currentStock: 250, minStock: 50, maxStock: 500, location: 'Warehouse A-1', price: 125.99, lastRestocked: '2024-01-15', qrCode: 'QR-CT-LM-BLK-001' },
      { id: 'INV002', name: 'Landmark Pro Gray', category: 'shingles', brand: 'CertainTeed', sku: 'CT-LMP-GRY', currentStock: 180, minStock: 40, maxStock: 400, location: 'Warehouse A-2', price: 145.99, lastRestocked: '2024-01-20', qrCode: 'QR-CT-LMP-GRY-002' },
      { id: 'INV003', name: 'Presidential Shake Brown', category: 'shingles', brand: 'CertainTeed', sku: 'CT-PS-BRN', currentStock: 95, minStock: 30, maxStock: 300, location: 'Warehouse A-3', price: 185.99, lastRestocked: '2024-01-10', qrCode: 'QR-CT-PS-BRN-003' },
      { id: 'INV004', name: 'ProLam Black', category: 'shingles', brand: 'Atlas', sku: 'AT-PL-BLK', currentStock: 320, minStock: 60, maxStock: 600, location: 'Warehouse B-1', price: 115.99, lastRestocked: '2024-01-25', qrCode: 'QR-AT-PL-BLK-004' },
      { id: 'INV005', name: 'Pinnacle Green', category: 'shingles', brand: 'Atlas', sku: 'AT-PN-GRN', currentStock: 145, minStock: 35, maxStock: 350, location: 'Warehouse B-2', price: 135.99, lastRestocked: '2024-01-18', qrCode: 'QR-AT-PN-GRN-005' },
      // Underlayment
      { id: 'INV006', name: '15lb Felt', category: 'underlayment', sku: 'UL-15F', currentStock: 450, minStock: 100, maxStock: 800, location: 'Warehouse C-1', price: 35.99, lastRestocked: '2024-01-22', qrCode: 'QR-UL-15F-006' },
      { id: 'INV007', name: '30lb Felt', category: 'underlayment', sku: 'UL-30F', currentStock: 380, minStock: 80, maxStock: 700, location: 'Warehouse C-2', price: 45.99, lastRestocked: '2024-01-19', qrCode: 'QR-UL-30F-007' },
      { id: 'INV008', name: 'Synthetic Felt Pro', category: 'underlayment', sku: 'UL-SYN-PRO', currentStock: 220, minStock: 50, maxStock: 400, location: 'Warehouse C-3', price: 89.99, lastRestocked: '2024-01-17', qrCode: 'QR-UL-SYN-PRO-008' },
      // Ice & Water Shield
      { id: 'INV009', name: 'Ice & Water Shield Premium', category: 'ice-and-water', sku: 'IW-PREM', currentStock: 175, minStock: 40, maxStock: 350, location: 'Warehouse D-1', price: 135.99, lastRestocked: '2024-01-14', qrCode: 'QR-IW-PREM-009' },
      { id: 'INV010', name: 'Winter Guard', category: 'ice-and-water', brand: 'CertainTeed', sku: 'CT-WG', currentStock: 125, minStock: 30, maxStock: 250, location: 'Warehouse D-2', price: 145.99, lastRestocked: '2024-01-12', qrCode: 'QR-CT-WG-010' },
      // Ventilation
      { id: 'INV011', name: 'Ridge Vent 4ft', category: 'ventilation', sku: 'VT-RV-4', currentStock: 310, minStock: 70, maxStock: 500, location: 'Warehouse E-1', price: 22.99, lastRestocked: '2024-01-21', qrCode: 'QR-VT-RV-4-011' },
      { id: 'INV012', name: 'Box Vent Black', category: 'ventilation', sku: 'VT-BV-BLK', currentStock: 285, minStock: 60, maxStock: 450, location: 'Warehouse E-2', price: 35.99, lastRestocked: '2024-01-16', qrCode: 'QR-VT-BV-BLK-012' },
      // Flashings
      { id: 'INV013', name: 'Step Flashing 4x4x8', category: 'flashings', sku: 'FL-SF-448', currentStock: 850, minStock: 200, maxStock: 1500, location: 'Warehouse F-1', price: 3.99, lastRestocked: '2024-01-23', qrCode: 'QR-FL-SF-448-013' },
      { id: 'INV014', name: 'Roof to Wall Flashing', category: 'flashings', sku: 'FL-RTW', currentStock: 425, minStock: 100, maxStock: 800, location: 'Warehouse F-2', price: 35.99, lastRestocked: '2024-01-11', qrCode: 'QR-FL-RTW-014' },
      // Accessories
      { id: 'INV015', name: 'Pipe Boot Black', category: 'accessories', sku: 'AC-PB-BLK', currentStock: 520, minStock: 120, maxStock: 900, location: 'Warehouse G-1', price: 18.99, lastRestocked: '2024-01-24', qrCode: 'QR-AC-PB-BLK-015' },
      { id: 'INV016', name: 'Coil Nails 1.25"', category: 'nails', sku: 'NL-CN-125', currentStock: 750, minStock: 150, maxStock: 1200, location: 'Warehouse H-1', price: 89.99, lastRestocked: '2024-01-13', qrCode: 'QR-NL-CN-125-016' }
    ];
  };

  // Generate customer data
  const generateCustomerData = (): Customer[] => {
    return [
      { id: 'CUST001', name: 'Johnson Roofing LLC', email: 'contact@johnsonroofing.com', phone: '(330) 555-0101', company: 'Johnson Roofing LLC', address: '123 Main St', city: 'Youngstown', state: 'OH', totalOrders: 45, totalSpent: 28750.50, status: 'vip', joinDate: '2022-03-15', lastOrderDate: '2024-01-25', notes: 'Preferred customer, always pays on time' },
      { id: 'CUST002', name: 'Mike Thompson', email: 'mike.t@email.com', phone: '(330) 555-0102', address: '456 Oak Ave', city: 'Warren', state: 'OH', totalOrders: 12, totalSpent: 5420.75, status: 'active', joinDate: '2023-06-20', lastOrderDate: '2024-01-20' },
      { id: 'CUST003', name: 'Superior Construction Co', email: 'info@superiorconstruction.com', phone: '(330) 555-0103', company: 'Superior Construction Co', address: '789 Pine Rd', city: 'Boardman', state: 'OH', totalOrders: 78, totalSpent: 45890.25, status: 'vip', joinDate: '2021-11-10', lastOrderDate: '2024-01-24', notes: 'Large volume buyer, qualifies for bulk discounts' },
      { id: 'CUST004', name: 'Sarah Williams', email: 'swilliams@email.com', phone: '(330) 555-0104', address: '321 Elm St', city: 'Poland', state: 'OH', totalOrders: 3, totalSpent: 890.50, status: 'active', joinDate: '2023-12-05', lastOrderDate: '2024-01-15' },
      { id: 'CUST005', name: 'ABC Home Improvements', email: 'orders@abchome.com', phone: '(330) 555-0105', company: 'ABC Home Improvements', address: '654 Maple Dr', city: 'Canfield', state: 'OH', totalOrders: 34, totalSpent: 19875.00, status: 'active', joinDate: '2022-08-22', lastOrderDate: '2024-01-22', notes: 'Regular customer, prefers airdrop delivery' },
      { id: 'CUST006', name: 'Robert Davis', email: 'rdavis@email.com', phone: '(330) 555-0106', address: '987 Cedar Ln', city: 'Austintown', state: 'OH', totalOrders: 8, totalSpent: 3200.00, status: 'active', joinDate: '2023-09-15', lastOrderDate: '2024-01-18' },
      { id: 'CUST007', name: 'Premium Roofing Solutions', email: 'contact@premiumroofing.com', phone: '(330) 555-0107', company: 'Premium Roofing Solutions', address: '147 Birch Blvd', city: 'Struthers', state: 'OH', totalOrders: 92, totalSpent: 67340.75, status: 'vip', joinDate: '2021-05-30', lastOrderDate: '2024-01-26', notes: 'VIP customer, gets special pricing on bulk orders' },
      { id: 'CUST008', name: 'Linda Anderson', email: 'landerson@email.com', phone: '(330) 555-0108', address: '258 Spruce Ave', city: 'Campbell', state: 'OH', totalOrders: 1, totalSpent: 425.99, status: 'inactive', joinDate: '2023-11-10', lastOrderDate: '2023-11-15', notes: 'Has not ordered in 2+ months' },
      { id: 'CUST009', name: 'Quality Builders Inc', email: 'purchasing@qualitybuilders.com', phone: '(330) 555-0109', company: 'Quality Builders Inc', address: '369 Walnut St', city: 'Hubbard', state: 'OH', totalOrders: 56, totalSpent: 38920.50, status: 'vip', joinDate: '2022-01-18', lastOrderDate: '2024-01-23' },
      { id: 'CUST010', name: 'Thomas Green', email: 'tgreen@email.com', phone: '(330) 555-0110', address: '741 Cherry Rd', city: 'Liberty', state: 'OH', totalOrders: 15, totalSpent: 7650.25, status: 'active', joinDate: '2023-04-12', lastOrderDate: '2024-01-19' },
      { id: 'CUST011', name: 'Rapid Roof Repairs', email: 'service@rapidroof.com', phone: '(330) 555-0111', company: 'Rapid Roof Repairs', address: '852 Ash Ave', city: 'Girard', state: 'OH', totalOrders: 28, totalSpent: 15340.00, status: 'active', joinDate: '2022-10-05', lastOrderDate: '2024-01-21' },
      { id: 'CUST012', name: 'Jennifer Brown', email: 'jbrown@email.com', phone: '(330) 555-0112', address: '963 Poplar Ln', city: 'Niles', state: 'OH', totalOrders: 0, totalSpent: 0, status: 'inactive', joinDate: '2024-01-10', notes: 'New customer, no orders yet' }
    ];
  };

  // Load inventory and customers
  useEffect(() => {
    if (!isClient || !isAuthenticated) return;

    // Load or generate inventory
    const savedInventory = localStorage.getItem('mbs-inventory');
    if (savedInventory) {
      try {
        setInventoryItems(JSON.parse(savedInventory));
      } catch {
        setInventoryItems(generateInventoryData());
      }
    } else {
      setInventoryItems(generateInventoryData());
    }

    // Load or generate customers
    const savedCustomers = localStorage.getItem('mbs-customers');
    if (savedCustomers) {
      try {
        setCustomers(JSON.parse(savedCustomers));
      } catch {
        setCustomers(generateCustomerData());
      }
    } else {
      setCustomers(generateCustomerData());
    }
  }, [isClient, isAuthenticated]);

  // Update inventory quantity
  const updateInventoryQuantity = (itemId: string, newQuantity: number) => {
    const updatedItems = inventoryItems.map(item =>
      item.id === itemId ? { ...item, currentStock: Math.max(0, newQuantity) } : item
    );
    setInventoryItems(updatedItems);
    localStorage.setItem('mbs-inventory', JSON.stringify(updatedItems));
  };

  // Handle QR code scan simulation
  const handleQRScan = (code: string) => {
    const item = inventoryItems.find(i => i.qrCode === code);
    if (item) {
      setScannedCode(code);
      setEditingInventory(item.id);
      // Auto-focus on the found item
      const element = document.getElementById(`inventory-${item.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-yellow-100');
        setTimeout(() => element.classList.remove('bg-yellow-100'), 2000);
      }
    } else {
      alert('Product not found with this QR code');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MBS2024admin') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    // Update localStorage
    try {
      const savedOrders = localStorage.getItem('mbs-orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        const updatedOrders = parsedOrders.map((order: any) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('mbs-orders', JSON.stringify(updatedOrders));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewOrder = (order: SimpleOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'accepted': return 'bg-blue-500 text-white';
      case 'processing': return 'bg-purple-500 text-white';
      case 'delivering': return 'bg-orange-500 text-white';
      case 'delivered': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!isClient) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Access Required
              </CardTitle>
              <CardDescription>
                Enter the administrator password to access the management dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full mbs-red mbs-red-hover">
                  Access Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">MBS Admin Dashboard</h1>
            <p className="text-gray-600">Manage orders and inventory</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Orders
                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Pending Orders
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Delivered Orders
                  <Package className="h-4 w-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Revenue
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{loadError}</AlertDescription>
                    </Alert>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-gray-600">Orders will appear here when customers place them.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <Badge className={order.deliveryType === 'airdrop' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                                {order.deliveryType === 'airdrop' ? '✈️ Airdrop' : '🚛 Ground Drop'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewOrder(order)}
                                  title="View Order Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="delivering">Delivering</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Sales Analytics</h2>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="shingles">Shingles</SelectItem>
                      <SelectItem value="underlayment">Underlayment</SelectItem>
                      <SelectItem value="ice-and-water">Ice & Water</SelectItem>
                      <SelectItem value="ventilation">Ventilation</SelectItem>
                      <SelectItem value="flashings">Flashings</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={analyticsTimeRange} onValueChange={(value: any) => setAnalyticsTimeRange(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Sold Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Top Selling Products
                    </CardTitle>
                    <CardDescription>Products with highest sales volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generateProductAnalytics()
                        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
                        .sort((a, b) => b.totalSold - a.totalSold)
                        .slice(0, 5)
                        .map((product, index) => (
                          <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                              <div>
                                <p className="font-semibold">{product.productName}</p>
                                <p className="text-sm text-gray-500">{product.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{product.totalSold} units</p>
                              <p className="text-sm text-gray-500">${product.revenue.toFixed(2)}</p>
                              {product.trend === 'up' && <Badge className="bg-green-100 text-green-800">↑ {Math.abs(product.totalSold - product.lastMonthSales)}%</Badge>}
                              {product.trend === 'down' && <Badge className="bg-red-100 text-red-800">↓ {Math.abs(product.totalSold - product.lastMonthSales)}%</Badge>}
                              {product.trend === 'stable' && <Badge className="bg-gray-100 text-gray-800">→ Stable</Badge>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Least Sold Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      Lowest Selling Products
                    </CardTitle>
                    <CardDescription>Products that need attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generateProductAnalytics()
                        .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
                        .sort((a, b) => a.totalSold - b.totalSold)
                        .slice(0, 5)
                        .map((product, index) => (
                          <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                              <div>
                                <p className="font-semibold">{product.productName}</p>
                                <p className="text-sm text-gray-500">{product.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600">{product.totalSold} units</p>
                              <p className="text-sm text-gray-500">${product.revenue.toFixed(2)}</p>
                              <Badge className={`${product.stockLevel < 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                {product.stockLevel} in stock
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sales Overview Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sales Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['shingles', 'underlayment', 'ice-and-water', 'ventilation', 'accessories'].map(category => {
                      const categoryProducts = generateProductAnalytics().filter(p => p.category === category);
                      const totalRevenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
                      const maxRevenue = 50000; // Max for scale
                      const percentage = (totalRevenue / maxRevenue) * 100;

                      return (
                        <div key={category}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium capitalize">{category.replace('-', ' ')}</span>
                            <span className="text-sm font-bold">${totalRevenue.toFixed(0)}</span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deliveries Tab */}
            <TabsContent value="deliveries" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Delivery Monitoring</h2>
                <div className="flex gap-2">
                  <Select value={deliveryFilter} onValueChange={(value: any) => setDeliveryFilter(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Delivery Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Deliveries</SelectItem>
                      <SelectItem value="ground">Ground Drop</SelectItem>
                      <SelectItem value="airdrop">Airdrop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Delivery Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Preparing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">
                        {generateDeliveryTracking().filter(d => d.status === 'preparing').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">
                        {generateDeliveryTracking().filter(d => d.status === 'in-transit').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">
                        {generateDeliveryTracking().filter(d => d.status === 'delivered').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-2xl font-bold">
                        {generateDeliveryTracking().filter(d => d.status === 'delayed').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Deliveries Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Deliveries</CardTitle>
                  <CardDescription>Real-time delivery tracking and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                        <TableHead>Driver/Pilot</TableHead>
                        <TableHead>Tracking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateDeliveryTracking()
                        .filter(d => deliveryFilter === 'all' || d.deliveryType === deliveryFilter)
                        .map((delivery) => (
                          <TableRow key={delivery.orderId}>
                            <TableCell className="font-medium">{delivery.orderId}</TableCell>
                            <TableCell>{delivery.customerName}</TableCell>
                            <TableCell>
                              <Badge className={delivery.deliveryType === 'airdrop' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}>
                                {delivery.deliveryType === 'airdrop' ? '✈️ Airdrop' : '🚛 Ground'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                delivery.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                                delivery.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {delivery.status === 'in-transit' && <Truck className="w-3 h-3 inline mr-1" />}
                                {delivery.status === 'delivered' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                {delivery.status === 'delayed' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                                {delivery.status === 'preparing' && <Clock className="w-3 h-3 inline mr-1" />}
                                {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                delivery.priority === 'urgent' ? 'bg-red-500 text-white' :
                                delivery.priority === 'express' ? 'bg-orange-500 text-white' :
                                'bg-gray-500 text-white'
                              }>
                                {delivery.priority.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{delivery.estimatedDelivery}</TableCell>
                            <TableCell>{delivery.driver || 'Helicopter Crew'}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <MapPin className="w-4 h-4 mr-1" />
                                Track
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inventory Management Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search inventory..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    variant={qrScanMode ? "destructive" : "outline"}
                    onClick={() => setQrScanMode(!qrScanMode)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {qrScanMode ? 'Stop Scanning' : 'Scan QR'}
                  </Button>
                </div>
              </div>

              {/* QR Code Scanner Widget */}
              {qrScanMode && (
                <Card className="border-2 border-blue-500 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScanLine className="h-5 w-5" />
                      QR Code Scanner
                    </CardTitle>
                    <CardDescription>Enter or scan a QR code to quickly find and update inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter QR code (e.g., QR-CT-LM-BLK-001)"
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => handleQRScan(scannedCode)}>
                        <Search className="w-4 h-4 mr-2" />
                        Find Product
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">💡 Tip: Use a QR scanner app to scan actual codes</p>
                  </CardContent>
                </Card>
              )}

              {/* Inventory Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inventoryItems.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {inventoryItems.filter(i => i.currentStock < i.minStock).length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {inventoryItems.filter(i => i.currentStock === 0).length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${inventoryItems.reduce((sum, i) => sum + (i.currentStock * i.price), 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Products</CardTitle>
                  <CardDescription>Manage stock levels across all categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min/Max</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems
                        .filter(item =>
                          inventorySearch === '' ||
                          item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(inventorySearch.toLowerCase())
                        )
                        .map((item) => (
                          <TableRow key={item.id} id={`inventory-${item.id}`} className="transition-colors">
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.brand || '-'}</TableCell>
                            <TableCell>
                              {editingInventory === item.id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateInventoryQuantity(item.id, item.currentStock - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={item.currentStock}
                                    onChange={(e) => updateInventoryQuantity(item.id, parseInt(e.target.value) || 0)}
                                    className="w-20 h-8 text-center"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateInventoryQuantity(item.id, item.currentStock + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${
                                    item.currentStock === 0 ? 'text-red-600' :
                                    item.currentStock < item.minStock ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    {item.currentStock}
                                  </span>
                                  {item.currentStock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                                  {item.currentStock > 0 && item.currentStock < item.minStock && <Badge variant="secondary">Low Stock</Badge>}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {item.minStock} / {item.maxStock}
                            </TableCell>
                            <TableCell className="text-sm">{item.location}</TableCell>
                            <TableCell>${item.price}</TableCell>
                            <TableCell>
                              {editingInventory === item.id ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingInventory(null)}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingInventory(null)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingInventory(item.id)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleQRScan(item.qrCode || '')}
                                  >
                                    <QrCode className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Restock History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Restock History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {inventoryItems
                      .sort((a, b) => new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime())
                      .slice(0, 5)
                      .map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.lastRestocked}</p>
                            <p className="text-sm text-gray-500">+{Math.floor(Math.random() * 200) + 50} units</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Management Tab */}
            <TabsContent value="customers" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Customer Management</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={customerFilter} onValueChange={(value: any) => setCustomerFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customers.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {customers.filter(c => c.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {customers.filter(c => c.status === 'vip').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customers Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Customers</CardTitle>
                  <CardDescription>Manage customer information and order history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers
                        .filter(customer =>
                          (customerFilter === 'all' || customer.status === customerFilter) &&
                          (customerSearch === '' ||
                           customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                           customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                           (customer.company && customer.company.toLowerCase().includes(customerSearch.toLowerCase())))
                        )
                        .map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-mono text-sm">{customer.id}</TableCell>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>{customer.company || '-'}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {customer.email}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Phone className="w-3 h-3" />
                                  {customer.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {customer.city}, {customer.state}
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                customer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                                customer.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {customer.status === 'vip' && '⭐ '}
                                {customer.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>{customer.totalOrders}</TableCell>
                            <TableCell className="font-bold">${customer.totalSpent.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Top Customers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      Top Customers by Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customers
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                              <div>
                                <p className="font-semibold">{customer.name}</p>
                                <p className="text-sm text-gray-500">{customer.company || 'Individual'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserX className="h-5 w-5 text-red-500" />
                      Inactive Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {customers
                        .filter(c => c.status === 'inactive')
                        .slice(0, 5)
                        .map((customer) => (
                          <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-semibold">{customer.name}</p>
                              <p className="text-sm text-gray-500">Last order: {customer.lastOrderDate || 'Never'}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 mr-1" />
                              Re-engage
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Simple Order Detail Modal */}
          {showOrderDetail && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
                    <Button onClick={() => setShowOrderDetail(false)} variant="outline">
                      Close
                    </Button>
                  </div>

                  <div className={`p-4 rounded-lg mb-6 ${
                    selectedOrder.deliveryType === 'airdrop'
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6" />
                      <div>
                        <h3 className="font-semibold">
                          {selectedOrder.deliveryType === 'airdrop' ? 'Precision Airdrop Delivery' : 'Ground Drop Delivery'}
                        </h3>
                        <p className="text-sm">
                          {selectedOrder.deliveryType === 'airdrop'
                            ? 'Helicopter delivery with precise timing'
                            : 'Professional truck delivery to job site'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-3">Customer Information</h3>
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Phone:</strong> {selectedOrder.deliveryInfo?.contactPhone || 'N/A'}</p>
                      <p><strong>Company:</strong> {selectedOrder.deliveryInfo?.jobSiteName || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Delivery Information</h3>
                      <p><strong>Address:</strong> {selectedOrder.deliveryInfo?.address || 'N/A'}</p>
                      <p><strong>City:</strong> {selectedOrder.deliveryInfo?.city || 'N/A'}, {selectedOrder.deliveryInfo?.state || 'N/A'}</p>
                      <p><strong>Date:</strong> {selectedOrder.deliveryInfo?.date ? new Date(selectedOrder.deliveryInfo.date).toLocaleDateString() : 'TBD'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="border rounded">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3">Product</th>
                            <th className="text-right p-3">Quantity</th>
                            <th className="text-right p-3">Price</th>
                            <th className="text-right p-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{item.name}</td>
                              <td className="text-right p-3">{item.quantity}</td>
                              <td className="text-right p-3">${item.price?.toFixed(2) || '0.00'}</td>
                              <td className="text-right p-3">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">Total: ${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Detail Modal */}
          {selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Customer Details - {selectedCustomer.id}</h2>
                    <Button onClick={() => setSelectedCustomer(null)} variant="outline">
                      Close
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{selectedCustomer.name}</span>
                        </div>
                        {selectedCustomer.company && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span>{selectedCustomer.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Account Information</h3>
                      <div className="space-y-2">
                        <p><strong>Status:</strong>
                          <Badge className={`ml-2 ${
                            selectedCustomer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                            selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedCustomer.status === 'vip' && '⭐ '}
                            {selectedCustomer.status.toUpperCase()}
                          </Badge>
                        </p>
                        <p><strong>Customer Since:</strong> {selectedCustomer.joinDate}</p>
                        <p><strong>Last Order:</strong> {selectedCustomer.lastOrderDate || 'No orders yet'}</p>
                        <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
                        <p><strong>Total Spent:</strong> <span className="font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</span></p>
                      </div>
                    </div>
                  </div>

                  {selectedCustomer.notes && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Notes</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-gray-700">{selectedCustomer.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Order History</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders
                          .filter(order => order.customerName === selectedCustomer.name)
                          .slice(0, 5)
                          .map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.date}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {orders.filter(order => order.customerName === selectedCustomer.name).length === 0 && (
                      <p className="text-center text-gray-500 py-4">No orders found for this customer</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Customer
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Create Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
